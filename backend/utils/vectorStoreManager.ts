import { TaskType } from "@google/generative-ai";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PinconeClient } from "@pinecone-database/pinecone"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Annotation, StateGraph } from "@langchain/langgraph";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const promptTemplate = await pull<ChatPromptTemplate>("rlm/rag-prompt");

export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0.5,
})

export const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title"
})

const pinecone = new PinconeClient({
  apiKey: process.env.PINECONE_KEY!
});
const index = pinecone.index('ai-memory');

export const vectoreStore = new PineconeStore(embeddings, {
  pineconeIndex: index,
  maxConcurrency: 5
})

export const splitters = new RecursiveCharacterTextSplitter({
  chunkOverlap: 200,
  chunkSize: 1000,
})

const InputStateAnnotation = Annotation.Root({
  question: Annotation<string>,
})

const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  context: Annotation<Document[]>,
  answer: Annotation<string>,
});

export const retrieve = async (state: typeof InputStateAnnotation.State) => {
  const retrieveDocs = await vectoreStore.similaritySearch(state.question);
  return { context: retrieveDocs };
}

export const generate = async (state: typeof StateAnnotation.State) => {
  //@ts-ignore
  const docsContent = state.context.map((doc) => doc.pageContent).join("\n");
  const messages = await promptTemplate.invoke({
    question: state.question,
    context: docsContent,
  });
  const response = await llm.invoke(messages.toString());
  return { answer: response.content };
};

export const graph = new StateGraph(StateAnnotation)
  .addNode("retrieve", retrieve)
  .addNode("generate", generate)
  .addEdge("__start__", "retrieve")
  .addEdge("retrieve", "generate")
  .addEdge("generate", "__end__")
  .compile();