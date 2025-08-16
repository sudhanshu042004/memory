// utils/vectorStoreManager.ts
import { MongoClient, Collection } from "mongodb";
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import * as dotenv from "dotenv";

dotenv.config();

interface EnvironmentConfig {
  MONGODB_URI: string;
  MONGODB_DB: string;
  MONGODB_COLLECTION: string;
  GEMINI_API_KEY: string;
}

class VectorStoreManager {
  private static instance: VectorStoreManager;
  private client: MongoClient | null = null;
  private collection: Collection | null = null;
  private embeddings: GoogleGenerativeAIEmbeddings | null = null;
  private vectorStore: MongoDBAtlasVectorSearch | null = null;
  private llm: ChatGoogleGenerativeAI | null = null;
  private isInitializing: boolean = false;
  private env: EnvironmentConfig | null = null;

  private constructor() {}

  static getInstance(): VectorStoreManager {
    if (!VectorStoreManager.instance) {
      VectorStoreManager.instance = new VectorStoreManager();
    }
    return VectorStoreManager.instance;
  }

  private validateEnvironment(): EnvironmentConfig {
    if (this.env) return this.env;

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

    this.env = requiredVars as EnvironmentConfig;
    return this.env;
  }

  async initialize(): Promise<void> {
    // If already initialized, return
    if (this.client && this.vectorStore && this.embeddings && this.llm) {
      return;
    }

    // If currently initializing, wait for it to complete
    if (this.isInitializing) {
      return new Promise((resolve, reject) => {
        const checkInitialization = setInterval(() => {
          if (!this.isInitializing) {
            clearInterval(checkInitialization);
            if (this.client && this.vectorStore && this.embeddings && this.llm) {
              resolve();
            } else {
              reject(new Error('Initialization failed'));
            }
          }
        }, 100);
      });
    }

    this.isInitializing = true;

    try {
      const env = this.validateEnvironment();
      console.log('🚀 Initializing Vector Store Manager...');

      // Initialize MongoDB client with connection pooling
      const clientOptions = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
        retryWrites: true,
        retryReads: true,
        connectTimeoutMS: 10000,
        heartbeatFrequencyMS: 10000,
      };

      this.client = new MongoClient(env.MONGODB_URI, clientOptions);
      await this.client.connect();
      console.log('✅ MongoDB connected');

      this.collection = this.client.db(env.MONGODB_DB).collection(env.MONGODB_COLLECTION);

      // Initialize embeddings (reusable)
      this.embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: env.GEMINI_API_KEY,
        modelName: "embedding-001",
      });
      console.log('✅ Embeddings initialized');

      // Initialize vector store (reusable)
      this.vectorStore = new MongoDBAtlasVectorSearch(this.embeddings, {
        collection: this.collection,
        indexName: "default",
        textKey: "text",
        embeddingKey: "embedding",
      });
      console.log('✅ Vector store initialized');

      // Initialize LLM (reusable)
      this.llm = new ChatGoogleGenerativeAI({
        apiKey: env.GEMINI_API_KEY,
        model: "gemini-1.5-flash",
        temperature: 0.3,
      });
      console.log('✅ LLM initialized');

      // Handle connection events
      this.client.on('close', () => {
        console.log('🔌 MongoDB connection closed');
        this.cleanup();
      });

      this.client.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
        this.cleanup();
      });

      console.log('🎉 Vector Store Manager initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize Vector Store Manager:', error);
      this.cleanup();
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  async getVectorStore(): Promise<MongoDBAtlasVectorSearch> {
    if (!this.vectorStore) {
      await this.initialize();
    }
    
    if (!this.vectorStore) {
      throw new Error('Failed to initialize vector store');
    }
    
    return this.vectorStore;
  }

  async getEmbeddings(): Promise<GoogleGenerativeAIEmbeddings> {
    if (!this.embeddings) {
      await this.initialize();
    }
    
    if (!this.embeddings) {
      throw new Error('Failed to initialize embeddings');
    }
    
    return this.embeddings;
  }

  async getLLM(): Promise<ChatGoogleGenerativeAI> {
    if (!this.llm) {
      await this.initialize();
    }
    
    if (!this.llm) {
      throw new Error('Failed to initialize LLM');
    }
    
    return this.llm;
  }

  async getCollection(): Promise<Collection> {
    if (!this.collection) {
      await this.initialize();
    }
    
    if (!this.collection) {
      throw new Error('Failed to initialize collection');
    }
    
    return this.collection;
  }

  async ping(): Promise<boolean> {
    try {
      if (!this.client) {
        return false;
      }
      await this.client.db().admin().ping();
      return true;
    } catch (error) {
      console.error('❌ MongoDB ping failed:', error);
      return false;
    }
  }

  private cleanup(): void {
    this.client = null;
    this.collection = null;
    this.embeddings = null;
    this.vectorStore = null;
    this.llm = null;
    this.isInitializing = false;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.close();
        console.log('🔌 Vector Store Manager disconnected gracefully');
      } catch (error) {
        console.error('⚠️ Error disconnecting Vector Store Manager:', error);
      }
      this.cleanup();
    }
  }
}

export const vectorStoreManager = VectorStoreManager.getInstance();