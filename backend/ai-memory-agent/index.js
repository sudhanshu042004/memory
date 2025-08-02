import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { embedAndStore, embedAndStorePDF } from "./util/embedAndStore.js";
import { askQuestion } from "./util/askQuestion.js";

dotenv.config();

const app = express();
app.use(express.json());

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Storage config
const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

// Multer file filter to accept only PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({ storage: Storage, fileFilter });

// Routes

// ➤ Embed Paragraph Route
app.post("/add-paragraph", async (req, res) => {
  const { text } = req.body;
  try {
    await embedAndStore(text);
    res.json({ message: "Paragraph embedded & stored!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ➤ Ask Question Route
app.post("/ask", async (req, res) => {
  const { question } = req.body;
  try {
    const answer = await askQuestion(question);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ➤ Upload PDF Route
app.post("/upload-pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded.");
    await embedAndStorePDF(req.file.path);
    res.status(200).json({ message: "PDF embedded and stored." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Something went wrong." });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
