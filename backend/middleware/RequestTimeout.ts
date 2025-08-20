import type { NextFunction, Request, Response } from "express";
import { logger } from "../utils/LogConfig";

function timeoutHandler(req:Request,res:Response,next:NextFunction){
    req.setTimeout(60000, () => {
        if (!res.headersSent) {
          logger.warn(`Request timeout for ${req.method} ${req.path}`);
          res.status(408).json({ error: 'Request timeout' });
        }
    });
      
    res.setTimeout(60000, () => {
        if (!res.headersSent) {
          logger.warn(`Response timeout for ${req.method} ${req.path}`);
          res.status(408).json({ error: 'Response timeout' });
        }
    });
      
      next();
}

