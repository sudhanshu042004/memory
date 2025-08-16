// utils/questionAnswerer.ts
import { PromptTemplate } from "@langchain/core/prompts";
import { vectorStoreManager } from "./vectorStoreManager.js";

// Interface for vector search documents
interface VectorDocument {
  pageContent: string;
  metadata?: any;
}

export async function askQuestion(query: string): Promise<string> {
  console.log("🔍 Processing question:", query);
  
  // Input validation
  if (!query || typeof query !== 'string') {
    throw new Error('Query must be a non-empty string');
  }

  if (query.trim().length === 0) {
    throw new Error('Query cannot be empty or only whitespace');
  }

  try {
    // Get reusable components (no new connections!)
    const vectorStore = await vectorStoreManager.getVectorStore();
    const llm = await vectorStoreManager.getLLM();

    console.log('✅ Using existing vector store and LLM instances');

    // Create retriever from existing vector store
    const retriever = vectorStore.asRetriever({
      searchType: "similarity",
      k: 3, // Limit to top 3 results for better performance
    });

    // Create prompt template (lightweight operation)
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
    
    // Step 1: Retrieve relevant documents with timeout
    console.log('🔍 Retrieving relevant documents...');
    const retrievalPromise = retriever.getRelevantDocuments(query);
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Document retrieval timeout')), 30000);
    });
    
    const docs = await Promise.race([retrievalPromise, timeoutPromise]);
    console.log(`📄 Found ${docs.length} relevant documents`);
    
    let context = "No relevant documents found in the database.";
    if (docs.length > 0) {
      context = docs.map((doc: VectorDocument) => doc.pageContent).join("\n\n");
      console.log(`📊 Context length: ${context.length} characters`);
    }
    
    // Step 2: Format the prompt
    const formattedPrompt = await prompt.format({
      context,
      question: query
    });
    
    // Step 3: Generate response with timeout
    console.log('🧠 Generating LLM response...');
    const llmPromise = llm.invoke(formattedPrompt);
    const llmTimeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('LLM response timeout')), 30000);
    });
    
    const response = await Promise.race([llmPromise, llmTimeoutPromise]);
    
    // Step 4: Extract the text content from the response safely
    let answerText = '';
    const content: any = (response as any)?.content;
    
    if (typeof content === 'string') {
      answerText = content;
    } else if (Array.isArray(content)) {
      answerText = content
        .map((part: any) => {
          if (typeof part === 'string') return part;
          if (part && typeof part === 'object' && 'text' in part) return String((part as any).text);
          return '';
        })
        .join('');
    } else {
      answerText = JSON.stringify(content ?? '');
    }
    
    console.log('✅ Answer generated successfully');
    console.log(`📊 Answer length: ${answerText.length} characters`);
    
    return answerText;

  } catch (error) {
    console.error('❌ Error in askQuestion:', error);
    
    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        throw new Error('Request timeout. The service is taking too long to respond. Please try again.');
      } else if (error.message.includes('MongoDB') || error.message.includes('database') || error.message.includes('connection')) {
        throw new Error('Database connection failed. Please check your MongoDB configuration.');
      } else if (error.message.includes('Gemini') || error.message.includes('API') || error.message.includes('quota')) {
        throw new Error('AI service error. Please check your Gemini API key and quota.');
      } else if (error.message.includes('retrieve')) {
        throw new Error('Failed to search the document database. Please try again.');
      } else if (error.message.includes('Right side of assignment cannot be destructured')) {
        throw new Error('Database connection error. Please try again in a moment.');
      } else if (error.message.includes('Failed to initialize')) {
        throw new Error('Service initialization failed. Please try again.');
      } else {
        throw new Error(`Question processing failed: ${error.message}`);
      }
    } else {
      throw new Error('An unexpected error occurred while processing your question.');
    }
  }
}