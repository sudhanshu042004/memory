declare module 'pdf-parser' {
  interface PDFData {
    text?: string;
    pages?: Array<{
      text?: string;
      elements?: Array<{
        text?: string;
        [key: string]: any;
      }>;
      [key: string]: any;
    }>;
    [key: string]: any;
  }

  function pdf2json(buffer: Buffer): Promise<PDFData>;
  
  export = {
    pdf2json
  };
} 