import { TaskType } from "@google/generative-ai";
import { BaseMessage, createAgent } from "langchain";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PinconeClient } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import {
  Annotation,
  messagesStateReducer,
  StateGraph,
} from "@langchain/langgraph";
import * as prompts from "./Prompts"

export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  temperature: 0.5,
});

export const imageLLM = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  temperature: 0.5,
  maxOutputTokens: 150,
});

export const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
});

const pinecone = new PinconeClient({
  apiKey: process.env.PINECONE_KEY!,
});
const index = pinecone.index("ai-memory");

export const vectoreStore = new PineconeStore(embeddings, {
  pineconeIndex: index,
  maxConcurrency: 5,
});

export const splitters = new RecursiveCharacterTextSplitter({
  chunkOverlap: 200,
  chunkSize: 1000,
});

const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  chatHistory: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
  context: Annotation<Document[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  standaloneQuestion: Annotation<string>,
  answer: Annotation<string>,
  userId: Annotation<string>,
  needsRetrieval: Annotation<boolean>({
    reducer: (x, y) => y ?? x,
    default: () => false,
  }),
});


const classifyQueryNode = async (state: typeof StateAnnotation.State) => {


  const response = await llm.invoke([
    { role: "human", content: prompts.classificationPrompt(state.question) },
  ]);

  const classification = (response.content as string).trim().toUpperCase();
  const needsRetrieval = classification.includes("RETRIEVE");

  return { needsRetrieval };
};

const rewriteQueryNode = async (state: typeof StateAnnotation.State) => {
  if (!state.needsRetrieval) {
    return { standaloneQuestion: state.question };
  }

  if (!state.chatHistory || state.chatHistory.length === 0) {
    return { standaloneQuestion: state.question };
  }

  const chatHistoryStr = state.chatHistory
    .slice(-6) 
    .map((msg) => `${msg._getType()}: ${msg.content}`)
    .join("\n");


  const response = await llm.invoke([{ role: "user", content: prompts.rewritePrompt(chatHistoryStr, state.question) }]);

  const standaloneQuestion = response.content as string;


  return { standaloneQuestion };
};

const retrieveNode = async (state: typeof StateAnnotation.State) => {
  if (!state.needsRetrieval) {
    return { context: [] };
  }
  try {
    const queryToUse = state.standaloneQuestion || state.question;

    
    const filter = state.userId ? { userId: state.userId } : undefined;

    const retrievedDocs = await vectoreStore.similaritySearch(
      queryToUse,
      5, 
      filter
    );


    return { context: retrievedDocs };
  } catch (error) {
    console.error("Error in retrieveNode:", error);
    return { context: [] };
  }
};


const generateNode = async (state: typeof StateAnnotation.State) => {
  
  if (!state.needsRetrieval) {
    const chatHistoryStr = state.chatHistory
      .slice(-6)
      .map((msg) => `${msg._getType()}: ${msg.content}`)
      .join("\n");


    const response = await llm.invoke([
      { role: "user", content: prompts.conversationalPrompt(chatHistoryStr, state.question) },
    ]);

    return { answer: response.content as string };
  }

  
  if (!state.context || state.context.length === 0) {
    const fallbackResponse = await llm.invoke([
      {
        role: "user",
        content: `Answer this question: ${state.question}\n\nNote: No relevant information was found in the knowledge base. If you don't know the answer, say so.`,
      },
    ]);
    return { answer: fallbackResponse.content as string };
  }

  const docsContent = state.context
    .map(
      (doc, idx) =>
        `[Document ${idx + 1}]\nsource: ${doc.metadata.source || "unknown"
        }\ncontent: ${doc.pageContent}`
    )
    .join("\n\n");

  const messages = [
    { role: "user", content: prompts.ragPrompt(docsContent, state.standaloneQuestion || state.question) }
  ];

  const response = await llm.invoke(messages);
  return { answer: response.content as string };
};

const workflow = new StateGraph(StateAnnotation)
  .addNode("classify", classifyQueryNode)
  .addNode("rewrite", rewriteQueryNode)
  .addNode("retrieve", retrieveNode)
  .addNode("generate", generateNode)
  .addEdge("__start__", "classify")
  .addEdge("classify", "rewrite")
  .addEdge("rewrite", "retrieve")
  .addEdge("retrieve", "generate")
  .addEdge("generate", "__end__");


export const ragAgent = workflow.compile();
