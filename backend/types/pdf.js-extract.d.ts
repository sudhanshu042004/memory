declare module 'pdf.js-extract' {
  interface PDFExtractOptions {
    normalizeWhitespace?: boolean;
    disableCombineTextItems?: boolean;
  }

  interface PDFExtractContentItem {
    str: string;
    dir?: string;
    transform?: number[];
    width?: number;
    height?: number;
    x?: number;
    y?: number;
  }

  interface PDFExtractPage {
    pageInfo: {
      num: number;
      scale: number;
      rotation: number;
      offsetX: number;
      offsetY: number;
      width: number;
      height: number;
    };
    content: PDFExtractContentItem[];
  }

  interface PDFExtractData {
    pages: PDFExtractPage[];
    meta?: {
      info?: any;
      metadata?: any;
    };
  }

  export class PDFExtract {
    constructor();
    extract(filePath: string, options?: PDFExtractOptions): Promise<PDFExtractData>;
  }
} 