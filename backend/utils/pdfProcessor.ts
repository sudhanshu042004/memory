// utils/pdfProcessor.ts
import { vectorStoreManager } from "./vectorStoreManager.js";
import { PDFExtract } from "pdf.js-extract";
import * as fs from "fs";

const pdfExtract = new PDFExtract();
const options = {};

export async function embedAndStore(
  text: string,
  metadata: { userId: number; type: string; createdAt: string }
): Promise<void> {
  try {
    const vectorStore = await vectorStoreManager.getVectorStore();
    
    // Split text into chunks if it's too long
    const chunks = splitTextIntoChunks(text, 1000);
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (chunk) {
        await vectorStore.addDocuments([
          {
            pageContent: chunk,
            metadata: {
              ...metadata,
              chunkIndex: i,
              totalChunks: chunks.length,
              chunkSize: chunk.length
            }
          }
        ]);
      }
    }
  } catch (error) {
    console.error("Error embedding and storing text:", error);
    throw error;
  }
}

export async function embedAndStorePDF(
  pdfPath: string,
  userId: number
): Promise<string | null> {
  try {
    // Extract text from PDF
    const data = await pdfExtract.extract(pdfPath, options);
    let extractedText = "";
    
    // Combine all pages
    for (const page of data.pages) {
      for (const content of page.content) {
        extractedText += content.str + " ";
      }
      extractedText += "\n";
    }
    
    if (!extractedText.trim()) {
      console.warn("No text extracted from PDF");
      return null;
    }
    
    // Clean up the extracted text
    extractedText = extractedText
      .replace(/\s+/g, " ")
      .trim();
    
    // Store the extracted text
    await embedAndStore(extractedText, {
      userId,
      type: "pdf",
      createdAt: new Date().toISOString()
    });
    
    return extractedText;
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw error;
  }
}

function splitTextIntoChunks(text: string, maxChunkSize: number): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let currentChunk = "";
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (trimmedSentence.length === 0) continue;
    
    if (currentChunk.length + trimmedSentence.length + 1 <= maxChunkSize) {
      currentChunk += (currentChunk ? " " : "") + trimmedSentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk + ".");
        currentChunk = trimmedSentence;
      } else {
        // If a single sentence is too long, split it by words
        const words = trimmedSentence.split(" ");
        let wordChunk = "";
        for (const word of words) {
          if (wordChunk.length + word.length + 1 <= maxChunkSize) {
            wordChunk += (wordChunk ? " " : "") + word;
          } else {
            if (wordChunk) {
              chunks.push(wordChunk + ".");
              wordChunk = word;
            } else {
              // If a single word is too long, truncate it
              chunks.push(word.substring(0, maxChunkSize) + "...");
            }
          }
        }
        if (wordChunk) {
          chunks.push(wordChunk + ".");
        }
      }
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk + ".");
  }
  
  return chunks;
}