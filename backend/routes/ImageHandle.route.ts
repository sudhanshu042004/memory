import expres from "express"
import multer from "multer";
import path from "path";
import fs from "fs";
import { imageLLM, splitters, vectoreStore } from "../utils/vectorStoreManager";
import { HumanMessage, SystemMessage, type BaseMessageLike } from "@langchain/core/messages";
import { logger } from "../utils/LogConfig";


export const imageRouter = expres.Router();

const uploadDir = path.join(process.cwd(), "uploads", "images");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
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
})

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(new Error("Only jpeg/jpg format allowed"));
    }
}

const upload = multer({ storage: storage, fileFilter });

imageRouter.post('/postImage', upload.single("image"), async (req: expres.Request, res: expres.Response) => {
    const buffer = req.file?.buffer;
    const base64Image = buffer?.toString("base64");

    try {

        const messages : BaseMessageLike[] = [
            new SystemMessage({ content: [{ type: "text", text: "Describe this image in detail and extract text from the image" }] }),
            new HumanMessage({ content: [{ type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }] })
        ];
        //@ts-ignore
        const result = await imageLLM.invoke([[messages]]);
        const metadata = {
            userId: req.userId,
            email: req.email,
            createdAt: new Date().toISOString(),
        };


         const docs = await splitters.createDocuments([result.content.toString()], [metadata]);

        await vectoreStore.addDocuments(docs);

        res.json({
            message: "successfully stored",
            status: "statusOK"
        })
    } catch (error) {
        logger.fatal(error);
        res.status(500).json({
            "message": "image not saved to server",
            "error": error
        })
    }
})
