import { Router, type Request, type Response } from "express";
import { QueryValidation } from "../utils/ZodTypes";
import { logger } from "../utils/LogConfig";
import { ragAgent } from "../utils/vectorStoreManager";
import { AIMessage, HumanMessage, type BaseMessage } from "langchain";

export const AskLLM = Router();

const chatSession = new Map<string,BaseMessage[]>();

AskLLM.post("/", async (req: Request, res: Response) => {
  const { query,sessionId } = req.body;
  const userId = req.userId;
  const { data, error } = QueryValidation.safeParse(query);
  if (!data || error) {
    logger.error("invalid query");
    res.json({
      message: "invalid query",
      status: "error",
    });
    return;
  }
  try {
    
    const session = sessionId || "default";
    const chatHistory = chatSession.get(session) || [];

    const result = await ragAgent.invoke({
      question : data,
      chatHistory,
      userId : userId || undefined,
    })

     // Update chat history
    chatHistory.push(new HumanMessage(data));
    chatHistory.push(new AIMessage(result.answer));
    
    // Keep only last 10 messages to avoid context overflow
    if (chatHistory.length > 10) {
      chatHistory.splice(0, chatHistory.length - 10);
    }

    chatSession.set(session, chatHistory);
    logger.info("response generated")
    res.json({ 
      message: result.answer,
      sessionId: session 
    });
  } catch (error) {
    logger.fatal(error),
      res.status(500).json({
        message: "something went off",
        status: "error",
      });
  }
});
