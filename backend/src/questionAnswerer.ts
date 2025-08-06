import { MongoClient } from "mongodb";
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { PromptTemplate } from "@langchain/core/prompts";
import * as dotenv from "dotenv";

dotenv.config();

// Interface for the input to the chain
interface ChainInput {
  question: string;
}

// Interface for the document structure
interface Document {
  pageContent: string;
  metadata?: any;
}

// Validate environment variables
function validateEnvironment() {
  const requiredVars = {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
    MONGODB_COLLECTION: process.env.MONGODB_COLLECTION,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return requiredVars as { [K in keyof typeof requiredVars]: string };
}

export async function askQuestion(query: string): Promise<string> {
  // Input validation
  if (!query || typeof query !== 'string') {
    throw new Error('Query must be a non-empty string');
  }

  if (query.trim().length === 0) {
    throw new Error('Query cannot be empty or only whitespace');
  }

  // Validate environment variables
  const env = validateEnvironment();

  let client: MongoClient | null = null;

  try {
    console.log(`🔍 Processing question: "${query}"`);

    // Connect to MongoDB
    client = new MongoClient(env.MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const collection = client.db(env.MONGODB_DB).collection(env.MONGODB_COLLECTION);

    // Initialize embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: env.GEMINI_API_KEY,
      modelName: "embedding-001",
    });

    // Initialize vector store
    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
      collection,
      indexName: "default",
      textKey: "text",
      embeddingKey: "embedding",
    });

    const retriever = vectorStore.asRetriever();

    // Initialize LLM
    const llm = new ChatGoogleGenerativeAI({
      apiKey: env.GEMINI_API_KEY,
      model: "gemini-1.5-flash",
      temperature: 0.3,
    });

    // Create prompt template
    const prompt = PromptTemplate.fromTemplate(`
You are a helpful AI assistant. Use the provided context to answer the question accurately and concisely.

Context:
{context}

Question: {question}

Instructions:
- If the context contains relevant information, provide a clear and accurate answer
- If the context doesn't contain enough information to answer the question, say "I don't have enough information to answer this question based on the available context."
- Keep your answer focused and relevant to the question
- If the question is unclear, ask for clarification

Answer:`);

    // Process the question step by step
    console.log('🤖 Generating answer...');
    
    // Step 1: Retrieve relevant documents
    console.log('🔍 Retrieving relevant documents...');
    const docs = await retriever.getRelevantDocuments(query);
    console.log(`📄 Found ${docs.length} relevant documents`);
    
    let context = "No relevant documents found in the database.";
    if (docs.length > 0) {
      context = docs.map((doc: Document) => doc.pageContent).join("\n\n");
    }
    
    // Step 2: Format the prompt
    const formattedPrompt = await prompt.format({
      context,
      question: query
    });
    
    // Step 3: Generate response
    const response = await llm.invoke(formattedPrompt);
    
    // Step 4: Extract the text content from the response
    const answer = response.content as string;
    
    console.log('✅ Answer generated successfully');
    return answer;

  } catch (error) {
    console.error('❌ Error in askQuestion:', error);
    
    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('MongoDB')) {
        throw new Error('Database connection failed. Please check your MongoDB configuration.');
      } else if (error.message.includes('Gemini') || error.message.includes('API')) {
        throw new Error('AI service error. Please check your Gemini API key and quota.');
      } else if (error.message.includes('retrieve')) {
        throw new Error('Failed to search the document database. Please try again.');
      } else {
        throw new Error(`Question processing failed: ${error.message}`);
      }
    } else {
      throw new Error('An unexpected error occurred while processing your question.');
    }
  } finally {
    // Always close the database connection
    if (client) {
      try {
        await client.close();
        console.log('🔌 Database connection closed');
      } catch (error) {
        console.error('⚠️ Error closing database connection:', error);
      }
    }
  }
} 