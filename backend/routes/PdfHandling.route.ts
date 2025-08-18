import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { embedAndStorePDF } from "../utils/pdfProcessor";

export const pdfRouter = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
	destination: (_req: Express.Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
		cb(null, uploadDir);
	},
	filename: (_req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
		const ext = path.extname(file.originalname);
		const name = path.basename(file.originalname, ext);
		cb(null, `${name}-${Date.now()}${ext}`);
	},
});

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
	if (file.mimetype === "application/pdf") {
		cb(null, true);
	} else {
		cb(new Error("Only PDF files are allowed"));
	}
};

const upload = multer({ storage, fileFilter });

pdfRouter.post("/", upload.single("file"), async (req: express.Request, res: express.Response) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		const userId = req.body.userId ? parseInt(req.body.userId) : 21;
		const extractedText = await embedAndStorePDF(req.file.path, userId);

		if (req.file && fs.existsSync(req.file.path)) {
			fs.unlinkSync(req.file.path);
		}

		if (extractedText) {
			return res.status(200).json({
				message: "PDF embedded and stored successfully",
				userId,
				extractedLength: typeof extractedText === "string" ? extractedText.length : 0,
			});
		}

		return res.status(200).json({
			message: "PDF processed but no text was extracted",
			userId,
		});
	} catch (err: any) {
		if (req.file && fs.existsSync(req.file.path)) {
			fs.unlinkSync(req.file.path);
		}
		return res.status(500).json({ error: err.message || "Failed to process PDF" });
	}
});
