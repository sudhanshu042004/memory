import { TaskType } from "@google/generative-ai";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PinconeClient} from "@pinecone-database/pinecone"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const llm = new ChatGoogleGenerativeAI({
  model : "google-2.0-flash",
  temperature : 0.5,
})

export const embeddings = new GoogleGenerativeAIEmbeddings({
  model : "text-embedding-004",
  taskType : TaskType.RETRIEVAL_DOCUMENT,
  title : "Document title"
})

const pinecone = new PinconeClient({
  apiKey : process.env.PINECONE_KEY!
});
const index = pinecone.index('ai-memory-vectore-store');

export const vectoreStore = new PineconeStore(embeddings,{
  pineconeIndex:index,
  maxConcurrency :5
})

export const splitters = new RecursiveCharacterTextSplitter({
  chunkOverlap : 200,
  chunkSize : 1000,
})