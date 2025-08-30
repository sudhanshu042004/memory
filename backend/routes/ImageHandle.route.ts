import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { imageLLM, splitters, vectoreStore } from "../utils/vectorStoreManager";
import { HumanMessage, SystemMessage, type BaseMessageLike } from "@langchain/core/messages";
import { logger } from "../utils/LogConfig";

export const imageRouter = express.Router();

const uploadDir = path.join(process.cwd(), "uploads", "images");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req: Express.Request, _file: Express.Multer.File, cb: (err: Error | null, destination: string) => void) => {
        cb(null, uploadDir);
    },
    filename: (_req: Express.Request, file: Express.Multer.File, cb: (err: Error | null, filename: string) => void) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${Date.now()}${ext}`);
    }
});

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow common image formats
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"));
    }
};

const upload = multer({ storage: storage, fileFilter });

imageRouter.post('/', upload.single("image"), async (req: express.Request, res: express.Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No image file uploaded",
                status: "error"
            });
        }

        // Read the file from disk since we're using disk storage
        const filePath = req.file.path;
        const buffer = fs.readFileSync(filePath);
        const base64Image = buffer.toString("base64");
        
        // Get the correct mime type from the uploaded file
        const mimeType = req.file.mimetype;

        const messages: BaseMessageLike[] = [
            new HumanMessage({ 
                content: [
                    { type: "text", text: "Describe this image in detail and extract text from the image" },
                    { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } }
                ] 
            })
        ];

        // Remove the extra array wrapper - this was the main issue
        //@ts-ignore
        const result = await imageLLM.invoke(messages);
        
        const metadata = {
            userId: req.userId,
            email: req.email,
            createdAt: new Date().toISOString(),
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype
        };

        const docs = await splitters.createDocuments([result.content.toString()], [metadata]);
        await vectoreStore.addDocuments(docs);

        // Clean up the uploaded file if you don't need to keep it
        fs.unlinkSync(filePath);

        res.json({
            message: "Successfully processed and stored image",
            status: "success",
            filename: req.file.filename
        });

    } catch (error) {
        logger.fatal(error);
        res.status(500).json({
            message: "Failed to process image",
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});