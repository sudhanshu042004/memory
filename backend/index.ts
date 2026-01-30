import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { logger } from "./utils/LogConfig.js";
import { ExtractWeb } from "./routes/ExtractWeb.route.js";
import { AskLLM } from "./routes/AskLLm.route.js";
import { verifyUser } from "./middleware/verifyToken.js";
import { pdfRouter } from "./routes/PdfHandling.route.js";
import { imageRouter } from "./routes/ImageHandle.route.js";
import { TextRoute } from "./routes/TextHandle.route.js";

dotenv.config();

const app = express();
app.use(express.json());

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.use(verifyUser);
app.use('/api/v1/webExtract',ExtractWeb);
app.use('/api/v1/ask',AskLLM);
app.use('/api/v1/fileUpload',pdfRouter);
app.use('/api/v1/imagePost',imageRouter);
app.use('/api/v1/customText',TextRoute)


app.use((req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: "Route not found",
    method: req.method,
    path: req.path,
    availableRoutes: [
    ]
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`Upload directory: ${uploadDir}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

async function gracefulShutdown(signal: string) {
  logger.warn(`${signal} received, shutting down gracefully`);
  
  server.close(async () => {
    logger.info('HTTP server closed');
    
    logger.info('Graceful shutdown completed');
    process.exit(0);
  });
  
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 30000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));