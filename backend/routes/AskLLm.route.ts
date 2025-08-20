import { Router, type Request, type Response } from "express";
import { QueryValidation } from "../utils/ZodTypes";
import { graph } from "../utils/vectorStoreManager";
import { logger } from "../utils/LogConfig";

export const AskLLM = Router();

AskLLM.post('/',async (req:Request,res:Response)=>{
    const {query} = req.body;
    const {data,error}  = QueryValidation.safeParse(query);
    if(!data || error){
        res.json({
            message : "invalid query",
            status : "error"
        })
        return;
    }
    try {
        
        const result = await graph.invoke({question : data});
        res.json({
            status : "statusOK",
            message : "data successfully retireved",
            result : result.answer
        });
    } catch (error) {
        logger.fatal(error),
        res.status(500).json({
            message : "something went off",
            status : "error"
        })
    }
})