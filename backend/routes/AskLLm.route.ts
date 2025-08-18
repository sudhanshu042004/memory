import { Router, type Request, type Response } from "express";
import { QueryValidation } from "../utils/ZodTypes";

export const AskLLM = Router();

AskLLM.post('/',(req:Request,res:Response)=>{
    const {query} = req.body;
    const {data,error}  = QueryValidation.safeParse(query);
    if(!data || error){
        res.json({
            message : "invalid query",
            status : "error"
        })
        return;
    }
    
})