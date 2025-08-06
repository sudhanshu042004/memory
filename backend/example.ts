import { embedAndStorePDF, askQuestion } from './index';

async function main() {
  try {
    console.log('🚀 Starting PDF Parser Example...\n');

    // Example 1: Process a PDF file
    console.log('📄 Processing PDF file...');
    const pdfPath = './example.pdf'; // Replace with your PDF path
    
    try {
      const extractedText = await embedAndStorePDF(pdfPath, 21);
      if (extractedText && typeof extractedText === 'string') {
        console.log('✅ PDF processed successfully!');
        console.log(`📝 Extracted ${extractedText.length} characters\n`);
      } else {
        console.log('⚠️  No text extracted from PDF\n');
      }
    } catch (error) {
      console.log('❌ PDF processing failed:', (error as Error).message);
      console.log('💡 Make sure the PDF file exists and is accessible\n');
    }

    // Example 2: Ask questions about the processed documents
    console.log('❓ Asking questions about the documents...\n');
    
    const questions = [
      'What is the main topic of the document?',
      'What are the key points discussed?',
      'Who are the authors mentioned?'
    ];

    for (const question of questions) {
      try {
        console.log(`Q: ${question}`);
        const answer = await askQuestion(question);
        console.log(`A: ${answer}\n`);
      } catch (error) {
        console.log(`❌ Failed to answer: ${(error as Error).message}\n`);
      }
    }

    console.log('🎉 Example completed!');

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the example if this file is executed directly
if (import.meta.main) {
  main();
}

export { main }; 