import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { embedAndStore, embedAndStorePDF } from "./src/pdfProcessor.js";
import { askQuestion } from "./src/questionAnswerer.js";

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
  destination: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadDir);
  },
  filename: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

// Multer file filter to accept only PDF files
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

const upload = multer({ storage: Storage, fileFilter });

// Routes

// ➤ Embed Paragraph Route
app.post("/add-paragraph", async (req, res) => {
  const { text, userId = 21 } = req.body;
  
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: "Text is required and must be a string" });
  }
  
  try {
    await embedAndStore(text, { userId });
    res.json({ message: "Paragraph embedded & stored!", userId });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to embed and store text" });
  }
});

// ➤ Ask Question Route
app.post("/ask", async (req, res) => {
  const { question } = req.body;
  
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: "Question is required and must be a string" });
  }
  
  try {
    const answer = await askQuestion(question);
    res.json({ answer });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to process question" });
  }
});

// ➤ Upload PDF Route
app.post("/upload-pdf", upload.single("file"), async (req, res) => {
  try {
    console.log("📁 File upload request received");
    console.log("📋 Request body:", req.body);
    console.log("📄 Request file:", req.file);
    
    if (!req.file) {
      console.log("❌ No file in request");
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    console.log("✅ File uploaded successfully:", req.file.originalname);
    console.log("📂 File saved to:", req.file.path);
    console.log("📏 File size:", req.file.size, "bytes");
    
    const userId = req.body.userId ? parseInt(req.body.userId) : 21;
    console.log("👤 User ID:", userId);
    
    const extractedText = await embedAndStorePDF(req.file.path, userId);
    
    // Clean up the uploaded file
    console.log("🧹 Cleaning up uploaded file:", req.file.path);
    fs.unlinkSync(req.file.path);
    
    if (extractedText) {
      console.log("✅ PDF processing completed successfully");
      res.status(200).json({ 
        message: "PDF embedded and stored successfully", 
        userId,
        extractedLength: typeof extractedText === 'string' ? extractedText.length : 0 
      });
    } else {
      console.log("⚠️ PDF processed but no text extracted");
      res.status(200).json({ 
        message: "PDF processed but no text was extracted", 
        userId 
      });
    }
  } catch (err: any) {
    console.error("❌ Error in upload-pdf route:", err);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      console.log("🧹 Cleaning up file after error:", req.file.path);
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: err.message || "Failed to process PDF" 
    });
  }
});

// ➤ Health Check Route
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// ➤ Get Uploaded Files Route (for debugging)
app.get("/files", (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir);
    res.json({ files });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Something went wrong!",
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${uploadDir}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

export { app };