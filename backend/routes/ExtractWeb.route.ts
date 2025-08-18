import  { Router, type Request, type Response } from "express";
import { URLValidation } from "../utils/ZodTypes";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { splitters } from "../utils/vectorStoreManager";
import { vectoreStore } from "../utils/vectorStoreManager";
import { logger } from "../utils/LogConfig";

export const ExtractWeb = Router();

ExtractWeb.post('/',async(req:Request,res:Response)=>{
    const {url} = req.body;
    const {error,data} = URLValidation.safeParse(url);

    if(error || !data){
        res.status(400).json({
            "message": "url is not valid",
            "status" : "error"
        })
        return;
    }
    try {
        
        const pTagSelector = 'p';
        const cheerioLoader = new CheerioWebBaseLoader(
            url,
            {
                selector : pTagSelector,
            }
        )
        const docs = await cheerioLoader.load();
        const allSplits = await splitters.splitDocuments(docs);

        const docWithMetaData = allSplits.map((doc,index)=>({
            ...doc,
            metadata : {
                ...doc.metadata,
                userId : req.userId,
                email : req.email,
                extractAt : new Date().toISOString(),
                chunkIndex : index,
            }
        }))

        await vectoreStore.addDocuments(docWithMetaData);
        res.json({
            "message" : "webData successfully extracted",
            "status" : "statusOk",
            "documentsProcessed" : docWithMetaData.length
        })
    } catch (error) {
        logger.fatal(error);
        res.json({
            "message"  : "something went off",
            "status" : "error"
        })
    }

})