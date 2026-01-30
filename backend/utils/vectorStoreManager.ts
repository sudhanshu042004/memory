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
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const promptTemplate = await pull<ChatPromptTemplate>("rlm/rag-prompt");

export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0.5,
});

export const imageLLM = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.5,
  maxOutputTokens: 150,
});

export const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
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
  userId: Annotation<number>,
  needsRetrieval: Annotation<boolean>({
    reducer: (x, y) => y ?? x,
    default: () => false,
  }),
});

// Node 1 : classify if the query needs retireval or not
const classifyQueryNode = async (state: typeof StateAnnotation.State) => {
  const classificationPrompt = `Analyze this user message and determine if it requires searching a knowledge base or if it's a conversational message.

  User message: "${state.question}"

A query needs retrieval if it:
- Asks for specific information, facts, or details
- Contains "who", "what", "when", "where", "why", "how" questions
- Asks about a specific topic, person, or event
- Requests data or documentation

A query does NOT need retrieval if it:
- Is casual conversation (greetings, thanks, acknowledgments)
- Is sharing personal information
- Is expressing emotions or opinions
- Is a simple statement without a question

Respond with only "RETRIEVE" or "CONVERSATIONAL"`;

  const response = await llm.invoke([
    { role: "human", content: classificationPrompt },
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
    .slice(-6) // Only last 6 messages for context
    .map((msg) => `${msg._getType()}: ${msg.content}`)
    .join("\n");

  const rewritePrompt = `Given a chat history and a follow-up question, rephrase the follow-up question to be a standalone question that contains all necessary context.

  Chat History:
  ${chatHistoryStr}

  Follow-up Question: ${state.question}

  Standalone Question:`;

  const response = await llm.invoke([{ role: "user", content: rewritePrompt }]);

  const standaloneQuestion = response.content as string;

  console.log("Original question:", state.question);
  console.log("Rewritten question:", standaloneQuestion);

  return { standaloneQuestion };
};

const retrieveNode = async (state: typeof StateAnnotation.State) => {
  if (!state.needsRetrieval) {
    console.log("Skipping retrieval - conversational query");
    return { context: [] };
  }
  try {
    const queryToUse = state.standaloneQuestion || state.question;

    // Add metadata filter for userId if provided
    const filter = state.userId ? { userId: state.userId } : undefined;

    const retrievedDocs = await vectoreStore.similaritySearch(
      queryToUse,
      5, // Retrieve top 5 most relevant
      filter
    );

    console.log(retrievedDocs)

    return { context: retrievedDocs };
  } catch (error) {
    console.error("Error in retrieveNode:", error);
    return { context: [] };
  }
};

// Node 4: Generate answer
const generateNode = async (state: typeof StateAnnotation.State) => {
  // For conversational queries, respond naturally with chat history
  if (!state.needsRetrieval) {
    const chatHistoryStr = state.chatHistory
      .slice(-6)
      .map((msg) => `${msg._getType()}: ${msg.content}`)
      .join("\n");

    const conversationalPrompt = `You are a helpful AI assistant. Have a natural conversation with the user.

${chatHistoryStr ? `Chat History:\n${chatHistoryStr}\n` : ""}
User: ${state.question}

Respond naturally and conversationally. If the user is sharing information, acknowledge it warmly.`;

    const response = await llm.invoke([
      { role: "user", content: conversationalPrompt },
    ]);

    return { answer: response.content as string };
  }

  // For retrieval queries, use RAG
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
        `[Document ${idx + 1}]\nsource: ${
          doc.metadata.source || "unknown"
        }\ncontent: ${doc.pageContent}`
    )
    .join("\n\n");


  const messages = await promptTemplate.invoke({
    question: state.standaloneQuestion || state.question,
    context: docsContent,
  });

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
