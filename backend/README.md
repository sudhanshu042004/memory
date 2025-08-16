# PDF Parser with Vector Search and Q&A - Express Server

A TypeScript-based PDF parsing system with an Express server that extracts text from PDFs, embeds it using Google's Gemini AI, stores it in MongoDB Atlas with vector search capabilities, and provides a question-answering API.

## Features

- **📄 PDF Text Extraction**: Multiple fallback methods for robust text extraction
- **🧠 Vector Embeddings**: Uses Google Gemini AI for text embeddings
- **🗄️ MongoDB Atlas Vector Search**: Stores and searches embeddings efficiently
- **❓ AI-Powered Q&A**: Context-aware question answering using retrieved documents
- **🚀 Express REST API**: Full REST API for PDF upload, text embedding, and Q&A
- **📁 File Upload**: Multer-based PDF file upload with automatic cleanup
- **🔒 Type Safety**: Full TypeScript support and modern development experience

## Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_DB=your_database_name
MONGODB_COLLECTION=your_collection_name

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration (optional)
PORT=5000
NODE_ENV=development
```

### 3. Start the Server

```bash
# Development mode with hot reload
bun run --hot index.ts

# Production mode
bun run index.ts
```

The server will start on `http://localhost:5000` (or your configured PORT).

## API Endpoints

### 🔍 Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "development"
}
```

### 📄 Upload PDF
```http
POST /upload-pdf
Content-Type: multipart/form-data

file: [PDF_FILE]
userId: 21 (optional)
```
**Response:**
```json
{
  "message": "PDF embedded and stored successfully",
  "userId": 21,
  "extractedLength": 1500
}
```

### 📝 Add Text Paragraph
```http
POST /add-paragraph
Content-Type: application/json

{
  "text": "Your text content here",
  "userId": 21
}
```
**Response:**
```json
{
  "message": "Paragraph embedded & stored!",
  "userId": 21
}
```

### ❓ Ask Question
```http
POST /ask
Content-Type: application/json

{
  "question": "What is the main topic of the documents?"
}
```
**Response:**
```json
{
  "answer": "Based on the available context, the main topic is..."
}
```

### 📁 List Uploaded Files (Debug)
```http
GET /files
```
**Response:**
```json
{
  "files": ["document-1234567890.pdf"]
}
```

## Usage Examples

### Using cURL

#### Upload a PDF
```bash
curl -X POST http://localhost:5000/upload-pdf \
  -F "file=@/path/to/document.pdf" \
  -F "userId=21"
```

#### Add Text
```bash
curl -X POST http://localhost:5000/add-paragraph \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a sample paragraph to embed.", "userId": 21}'
```

#### Ask a Question
```bash
curl -X POST http://localhost:5000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the key findings?"}'
```

### Using JavaScript/Fetch

```javascript
// Upload PDF
const formData = new FormData();
formData.append('file', pdfFile);
formData.append('userId', '21');

const uploadResponse = await fetch('http://localhost:5000/upload-pdf', {
  method: 'POST',
  body: formData
});

// Add text
const textResponse = await fetch('http://localhost:5000/add-paragraph', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Sample text content',
    userId: 21
  })
});

// Ask question
const questionResponse = await fetch('http://localhost:5000/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: 'What is the main topic?'
  })
});

const answer = await questionResponse.json();
console.log(answer.answer);
```

## Error Handling

The API provides comprehensive error handling:

### Common Error Responses

#### 400 Bad Request
```json
{
  "error": "Text is required and must be a string"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Database connection failed. Please check your MongoDB configuration."
}
```

### Error Types
- **Validation Errors**: Missing or invalid input parameters
- **File Upload Errors**: Non-PDF files or upload failures
- **Database Errors**: MongoDB connection or query failures
- **AI Service Errors**: Gemini API key or quota issues
- **PDF Processing Errors**: Corrupted or unreadable PDF files

## Development

### Project Structure
```
pdf-parser/
├── src/
│   ├── pdfProcessor.ts    # PDF processing and embedding
│   └── questionAnswerer.ts # Q&A functionality
├── types/
│   └── pdf-parser.d.ts    # TypeScript declarations
├── uploads/               # Temporary PDF uploads (auto-created)
├── index.ts              # Express server
├── server-test.ts        # Server testing
├── example.ts            # Usage examples
├── test.ts               # System verification
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

### Running Tests

```bash
# Test the system setup
bun run test.ts

# Test the server
bun run server-test.ts

# Run example usage
bun run example.ts
```

### Development Commands

```bash
# Start development server with hot reload
bun run --hot index.ts

# Install dependencies
bun install

# Type checking
bun run --check index.ts
```

## MongoDB Atlas Setup

1. **Create a MongoDB Atlas cluster**
2. **Create a database and collection**
3. **Set up a vector search index** on your collection:
   - Index name: `default`
   - Field mappings: 
     - `embedding` (vector, dimensions: 768)
     - `text` (text)

### Vector Search Index Configuration
```json
{
  "mappings": {
    "dynamic": true,
    "fields": {
      "embedding": {
        "dimensions": 768,
        "similarity": "cosine",
        "type": "knnVector"
      },
      "text": {
        "type": "string"
      }
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **PDF parsing fails**
   - Check if PDF is password-protected
   - Verify PDF is not corrupted
   - Try with a different PDF file

2. **No text extracted**
   - PDF might be image-based
   - Check PDF has selectable text
   - Try OCR tools for image-based PDFs

3. **MongoDB connection errors**
   - Verify connection string
   - Check network access
   - Ensure database and collection exist

4. **Gemini API errors**
   - Check API key validity
   - Verify quota limits
   - Check API key permissions

5. **Server won't start**
   - Check PORT availability
   - Verify all environment variables
   - Check for TypeScript errors

### Debug Mode

Enable detailed logging:
```env
DEBUG=true
NODE_ENV=development
```

### Logs

The server provides detailed logging:
- 🔍 Document retrieval
- 📄 PDF processing steps
- 🤖 AI response generation
- ✅ Success confirmations
- ❌ Error details

## Security Considerations

- **File Upload**: Only PDF files are accepted
- **File Cleanup**: Uploaded files are automatically deleted after processing
- **Input Validation**: All inputs are validated and sanitized
- **Error Messages**: Generic error messages to avoid information leakage
- **Environment Variables**: Sensitive data stored in environment variables

## Performance

- **File Processing**: PDFs are processed asynchronously
- **Vector Search**: Efficient similarity search using MongoDB Atlas
- **Memory Management**: Automatic cleanup of temporary files
- **Connection Pooling**: Efficient database connection management

## License

MIT License - see LICENSE file for details.
