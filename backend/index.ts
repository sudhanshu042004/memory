import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { embedAndStore } from "./src/pdfProcessor.js";
import { askQuestion } from "./src/questionAnswerer.js";
import { imageRouter } from "./routes/ImageHandle.route.js";
import { pdfRouter } from "./routes/PdfHandling.route.js";

dotenv.config();

const app = express();
app.use(express.json());

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

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

// ➤ File Upload Route (PDF)
app.use("/file", pdfRouter);

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

app.use("/image",imageRouter);

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