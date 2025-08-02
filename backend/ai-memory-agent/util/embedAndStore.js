import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import fs from "fs";
import pdfParse from "pdf-parse";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const embedAndStore = async (text, metadata) => {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
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

  await vectorStore.addDocuments([document]);

  // console.log("Embedded and stored with metadata:", metadata);
  await client.close();
};

// This function reads a PDF, extracts text, and stores it with userId in metadata
export const embedAndStorePDF = async (filePath, userId=21) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  const text = data.text;

  if (!text.trim()) {
    console.log("No text found in PDF.");
    return;
  }

  await embedAndStore(text, { userId });
};
