import { MongoClient } from "mongodb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import * as dotenv from "dotenv";
import { PDFExtract } from "pdf.js-extract";
import fs from "fs";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION!;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const embedAndStore = async (text: string, metadata: any) => {
  let client: MongoClient | null = null;
  
  try {
    console.log("Connecting to MongoDB...");
    
    // Minimal connection options - let MongoDB handle defaults
    client = new MongoClient(MONGODB_URI!);
    
    await client.connect();
    console.log("MongoDB connected successfully!");
    
    const collection = client.db(MONGODB_DB).collection(MONGODB_COLLECTION);

    const vectorStore = new MongoDBAtlasVectorSearch(
      new GoogleGenerativeAIEmbeddings({
        apiKey: GEMINI_API_KEY,
        modelName: "embedding-001",
      }),
      {
        collection,
        indexName: "default",
        textKey: "text",
        embeddingKey: "embedding",
      }
    );

    const document = {
      pageContent: text,
      metadata,
    };

    console.log("Adding document to vector store...");
    await vectorStore.addDocuments([document]);
    console.log("Embedded and stored with metadata:", metadata);
    
  } catch (error) {
    console.error("Error in embedAndStore:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('authentication')) {
        throw new Error("MongoDB authentication failed. Check your credentials.");
      } else if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
        throw new Error("MongoDB network error. Check your connection string and network.");
      } else if (error.message.includes('timeout')) {
        throw new Error("MongoDB connection timeout. Check your database availability.");
      } else if (error.message.includes('tls') || error.message.includes('ssl')) {
        throw new Error("MongoDB TLS/SSL configuration error. Check your connection string.");
      }
    }
    
    throw error;
  } finally {
    if (client) {
      try {
        await client.close();
        console.log("MongoDB connection closed.");
      } catch (closeError) {
        console.error("Error closing MongoDB connection:", closeError);
      }
    }
  }
};

export const embedAndStorePDF = async (filePath: string, userId: number = 21): Promise<string | undefined> => {
  try {
    console.log("Loading PDF file:", filePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`PDF file not found: ${filePath}`);
    }
    
    // Get file stats for debugging
    const stats = fs.statSync(filePath);
    console.log(`PDF file size: ${stats.size} bytes`);
    
    // Initialize PDF extractor
    const pdfExtract = new PDFExtract();
    const options = {
      // PDF.js-extract options
      normalizeWhitespace: true,
      disableCombineTextItems: false,
    };
    
    console.log("Extracting text from PDF...");
    
    // Extract text from PDF
    const data = await pdfExtract.extract(filePath, options);
    
    console.log(`PDF extracted successfully. Found ${data.pages.length} pages.`);
    
    if (!data.pages || data.pages.length === 0) {
      console.log("No pages found in PDF");
      return undefined;
    }
    
    // Extract text from all pages
    let extractedText = "";
    
    data.pages.forEach((page: any, pageIndex: number) => {
      console.log(`Processing page ${pageIndex + 1} with ${page.content?.length || 0} text items`);
      
      if (page.content && Array.isArray(page.content)) {
        // Extract text from page content
        const pageText = page.content
          .filter((item: any) => item.str && typeof item.str === 'string') // Filter valid text items
          .map((item: any) => item.str.trim()) // Get and trim the text string
          .filter((str: string) => str.length > 0) // Remove empty strings
          .join(" "); // Join with spaces
        
        if (pageText.trim()) {
          extractedText += pageText + "\n\n"; // Add page separator
        }
      }
    });
    
    // Clean up the extracted text
    extractedText = extractedText
      .replace(/\s+/g, " ") // Replace multiple whitespace with single space
      .replace(/\n{3,}/g, "\n\n") // Limit consecutive newlines
      .trim(); // Remove leading/trailing whitespace
    
    if (!extractedText || extractedText.length === 0) {
      console.log("No text extracted from PDF");
      return undefined;
    }
    
    console.log("Text extraction completed successfully!");
    console.log("Extracted text length:", extractedText.length);
    console.log("First 300 characters:", extractedText.substring(0, 300));
    
    // Store the extracted text with enhanced metadata
    const metadata = {
      userId,
      filename: filePath.split('/').pop() || 'unknown.pdf',
      pageCount: data.pages.length,
      extractedAt: new Date().toISOString(),
    };
    
    console.log("Attempting to store in MongoDB...");
    await embedAndStore(extractedText, metadata);
    
    return extractedText;
    
  } catch (error) {
    console.error("Error processing PDF:", error);
    
    // Provide more specific error information
    if (error instanceof Error) {
      if (error.message.includes('PDF file not found')) {
        throw new Error("PDF file not found at the specified path");
      } else if (error.message.includes('Invalid PDF')) {
        throw new Error("The uploaded file is not a valid PDF or is corrupted");
      } else if (error.message.includes('MongoDB')) {
        // Re-throw MongoDB errors with original message
        throw error;
      }
    }
    
    throw error;
  }
};