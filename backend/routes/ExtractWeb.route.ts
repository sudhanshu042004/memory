import { Router, type Request, type Response } from "express";
import { URLValidation } from "../utils/ZodTypes";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { splitters } from "../utils/vectorStoreManager";
import { vectoreStore } from "../utils/vectorStoreManager";
import { logger } from "../utils/LogConfig";
import type { SelectorType } from "cheerio";

export const ExtractWeb = Router();

ExtractWeb.post("/", async (req: Request, res: Response) => {
  const { url } = req.body;
  const { error, data } = URLValidation.safeParse(url);

  if (error || !data) {
    res.status(400).json({
      message: "url is not valid",
      status: "error",
    });
    return;
  }
  try {
    const contentSelector: SelectorType =
      'article, main, [role="main"], .post-content, .entry-content, .article-content, .content, p, h1, h2, h3, h4, h5, h6, pre, code, li, blockquote, section';
    const cheerioLoader = new CheerioWebBaseLoader(url, {
      selector: contentSelector,
    });
    const docs = await cheerioLoader.load();

    // Check if content was actually extracted
    if (!docs || docs.length === 0) {
      logger.warn(`No content extracted from ${url}`);
      res.status(400).json({
        message: "No content could be extracted from the URL",
        status: "error",
      });
      return;
    }
    const totalContentLength = docs.reduce(
      (sum, doc) => sum + doc.pageContent.length,
      0
    );
    logger.info(`Extracted ${totalContentLength} characters from ${url}`);
    if (totalContentLength < 100) {
      logger.warn(
        `Very little content extracted from ${url}: ${totalContentLength} chars`
      );
    }

    const allSplits = await splitters.splitDocuments(docs);

    const docWithMetaData = allSplits.map((doc, index) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        userId: req.userId,
        email: req.email,
        extractAt: new Date().toISOString(),
        chunkIndex: index,
      },
    }));

    await vectoreStore.addDocuments(docWithMetaData);
    res.json({
      message: "webData successfully extracted",
      status: "statusOk",
      documentsProcessed: docWithMetaData.length,
    });
  } catch (error) {
    logger.fatal(error);
    res.json({
      message: "something went off",
      status: "error",
    });
  }
});
