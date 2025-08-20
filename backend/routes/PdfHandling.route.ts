import { Router, type Request, type Response } from "express";
import path from "path";
import multer from "multer";
import { fileValidation } from "../utils/ZodTypes";
import { logger } from "../utils/LogConfig";
import fs from "fs";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { splitters, vectoreStore } from "../utils/vectorStoreManager";

export const pdfRouter = Router();

const storge = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storge });

pdfRouter.post('/', upload.single('pdfFile'), async (req: Request, res: Response) => {
    if (!req.file) {
        res.json({
            message: "No file uploaded",
            "status": "error"
        })
        return;
    }

    const { data, error } = fileValidation.safeParse(req.file);
    if (error || !data) {
        logger.error(error);
        res.json({
            message: "invalid file type only pdf supported",
            "status": "error"
        })
        return;
    }

    try {
        const loader = new PDFLoader(path.join(__dirname, "../uploads", req.file.filename), { splitPages: false, parsedItemSeparator: "", });
        const docs = await loader.load();
        const splitsDocs = await splitters.splitDocuments(docs);

        const docWithMetaData = splitsDocs.map((doc, index) => ({
            ...doc,
            metadata: {
                ...doc.metadata,
                userId: req.userId,
                email: req.email,
                extractAt: new Date().toISOString(),
                chunkIndex: index,
            }
        }))

        await vectoreStore.addDocuments(docWithMetaData);

        fs.unlink(path.join(__dirname, "../uploads", req.file.filename), () => { });
        res.json({
            "message": "file recieved",
            "status": "statusOK",
        })
    } catch (error) {
        logger.fatal(error);
        res.json({
            "message": "something went off",
            "status": "error"
        })
        return;
    }
})