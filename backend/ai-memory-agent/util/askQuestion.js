import { MongoClient } from "mongodb";
import {GoogleGenerativeAIEmbeddings,ChatGoogleGenerativeAI,} from "@langchain/google-genai"; 
// GoogleGenerativeAIEmbeddings-->jo text ko vector mein convert karta hai.
// ChatGoogleGenerativeAI --- >jo tumhara final answer banata hai.
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { RunnableSequence } from "@langchain/core/runnables";
//RunnableSequence: poora flow banata hai (retrieve → prompt → answer).
import { PromptTemplate } from "@langchain/core/prompts";
// PromptTemplate: tumhara model ke liye prompt banata hai.
import { StringOutputParser } from "@langchain/core/output_parsers";
import * as dotenv from "dotenv";
dotenv.config();

export async function askQuestion(query) {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const collection = client
    .db(process.env.MONGODB_DB)
    .collection(process.env.MONGODB_COLLECTION);

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    modelName: "embedding-001",
  });

  const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: "default",
    textKey: "text",
    embeddingKey: "embedding",
  });

  const retriever = vectorStore.asRetriever();

  
  const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-1.5-flash", 
    temperature: 0.3,
  });

  const prompt = PromptTemplate.fromTemplate(`
Use the context to answer the question. If not found, say "I don't know".

Context:
{context}

Question: {question}
Answer:`);

  const chain = RunnableSequence.from([
    {
      context: async (input) => {
        const docs = await retriever.getRelevantDocuments(input.question); //retriever → context fetch karega
        return docs.map((doc) => doc.pageContent).join("\n"); 

      },
      question: (input) => input.question,
    },
    prompt, //prompt → final input banayega
    llm, // llm → Gemini answer generate karega
    new StringOutputParser(), //StringOutputParser → text extract karega

  ]);

  const response = await chain.invoke({ question: query });
  await client.close();
  return response;
}