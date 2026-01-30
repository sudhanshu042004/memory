import { Router, type Request, type Response } from "express";
import { textValidDation } from "../utils/ZodTypes";
import { splitters, vectoreStore } from "../utils/vectorStoreManager";
import { logger } from "../utils/LogConfig";

export const TextRoute = Router();

TextRoute.post('/', async (req: Request, res: Response) => {
    const { text } = req.body;
    const { data, error } = textValidDation.safeParse(text);
    if (error || !data) {
        res.json({
            message: "invalid text",
            status: "error"
        })
        return;
    }
    try {

        const metadata = {
            userId: req.userId,
            email: req.email,
            createdAt: new Date().toISOString(),
        };

        const docs = await splitters.createDocuments([text], [metadata]);

        await vectoreStore.addDocuments(docs);

        res.json({
            message: "successfully stored",
            status: "statusOK"
        })
    } catch (error) {
        logger.fatal(error);
        res.json({
            "message": "something went off",
            "status": "error"
        })
    }
})