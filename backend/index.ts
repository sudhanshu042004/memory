import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { logger } from "./utils/LogConfig.js";
import { extractWebLoader } from "./utils/webSearch.js";
import { ExtractWeb } from "./routes/ExtractWeb.route.js";

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

app.get('/api/v1/webExtract',ExtractWeb);
app.get('/api/v1/ask')




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