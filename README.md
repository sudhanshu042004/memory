# 🧠 AI Memory — Your Personal AI-Powered Second Brain

> A full-stack mobile application that lets you store, retrieve, and chat with your personal knowledge base using Retrieval-Augmented Generation (RAG), powered by Google Gemini AI and Pinecone vector search.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [How It Works](#how-it-works)
- [Contributing](#contributing)

---

## Overview

**AI Memory** is a cross-platform mobile application (Android & iOS) that acts as your personal AI-powered memory. You can feed it knowledge from multiple sources — PDFs, images, web URLs, or plain text — and then have an intelligent conversation with that knowledge using natural language.

The system uses a **LangGraph-based agentic RAG pipeline** backed by **Pinecone vector store** and **Google Gemini 2.5 Flash** to intelligently decide when to retrieve stored context and when to respond conversationally, all while maintaining per-session chat history.

---

## ✨ Features

### 📥 Knowledge Ingestion
- **PDF Upload** — Upload PDF files; they are parsed, chunked, and stored in your personal vector store.
- **Image Upload** — Upload images; Gemini AI analyzes and extracts text/descriptions, which are then embedded and stored.
- **Web URL Extraction** — Provide any URL; the page content is scraped using Cheerio and added to your knowledge base.
- **Custom Text** — Paste or type any text directly to add it to your memory.

### 🤖 Intelligent RAG Chat
- **Query Classification** — The AI first classifies whether your question needs knowledge retrieval or can be answered conversationally.
- **Query Rewriting** — Ambiguous follow-up questions are rewritten into standalone questions using the chat history.
- **Semantic Search** — Top-5 most relevant document chunks are retrieved from Pinecone using vector similarity.
- **User-Isolated Memory** — Vector search is filtered by `userId` so each user only retrieves their own stored knowledge.
- **Persistent Chat History** — Sessions maintain up to 10 messages of rolling chat history.

### 🔐 Authentication
- **Google OAuth 2.0** — Sign in with Google using `expo-auth-session`.
- **JWT-based Auth** — Cookies containing JWT tokens are verified on every backend request via middleware.
- **Token Refresh** — Automatic token refresh handling in the frontend `fetchWithAuth` utility.

### 📱 Mobile UI
- **Tab Navigation** — Bottom tab navigation with Home, Ask AI, and Settings screens.
- **Floating Action Menu** — A FAB (Floating Action Button) to quickly add memory from any source.
- **Dashboard Stats** — Overview of stored memories, quick actions, and recent activity.
- **Notifications** — In-app notification screen.
- **Profile Management** — User profile and settings screen.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Mobile App (Expo)                      │
│  ┌────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Auth  │  │  Home    │  │  Ask AI  │  │ Settings │  │
│  │ Google │  │Dashboard │  │  Chat    │  │ Profile  │  │
│  └────────┘  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS + Cookie (JWT)
┌──────────────────────▼──────────────────────────────────┐
│               Backend (Bun + Express + TypeScript)        │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │           verifyUser Middleware (JWT)            │    │
│  └─────────────────────────────────────────────────┘    │
│                         │                               │
│  ┌──────────┐  ┌────────┐  ┌─────────┐  ┌──────────┐   │
│  │  /ask    │  │/upload │  │/image   │  │/webExtract│  │
│  │  RAG     │  │  PDF   │  │ Vision  │  │  Cheerio  │  │
│  └────┬─────┘  └───┬────┘  └────┬────┘  └────┬─────┘   │
└───────┼────────────┼────────────┼─────────────┼─────────┘
        │            │            │             │
┌───────▼────────────▼────────────▼─────────────▼─────────┐
│                    LangChain / LangGraph                  │
│  ┌───────────┐  ┌───────────┐  ┌───────────────────────┐│
│  │ Classify  │→─│  Rewrite  │→─│     Retrieve          ││
│  │   Node    │  │   Node    │  │  (Pinecone + Filter)  ││
│  └───────────┘  └───────────┘  └──────────┬────────────┘│
│                                            │             │
│                               ┌────────────▼────────────┐│
│                               │       Generate           ││
│                               │  (Gemini 2.5 Flash)     ││
│                               └─────────────────────────┘│
└──────────────────────────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                 External Services                         │
│  ┌──────────────┐         ┌──────────────────────────┐   │
│  │   Pinecone   │         │  Google Gemini AI         │   │
│  │ Vector Store │         │  gemini-2.5-flash (LLM)  │   │
│  │              │         │  gemini-2.0-flash (Vision)│  │
│  │              │         │  gemini-embedding-001    │   │
│  └──────────────┘         └──────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Bun** | JavaScript runtime & package manager |
| **Express.js** | HTTP server & routing |
| **TypeScript** | Type-safe development |
| **LangChain** | Document loaders, text splitters, prompt templates |
| **LangGraph** | Agentic RAG workflow (StateGraph) |
| **@langchain/google-genai** | Google Gemini LLM & embeddings |
| **Pinecone** | Vector database for semantic search |
| **Multer** | Multipart file upload handling |
| **Cheerio** | Web scraping & content extraction |
| **pdf-parse / PDFLoader** | PDF text extraction |
| **jsonwebtoken** | JWT creation and verification |
| **Zod** | Request body validation |
| **Pino** | Structured production logging |
| **dotenv** | Environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| **React Native** | Cross-platform mobile framework |
| **Expo (SDK 54)** | Managed workflow, build tooling |
| **Expo Router** | File-based navigation routing |
| **NativeWind** | Tailwind CSS for React Native |
| **expo-auth-session** | Google OAuth 2.0 flow |
| **expo-secure-store** | Secure token storage |
| **expo-document-picker** | PDF file selection |
| **expo-image-picker** | Image selection from gallery/camera |
| **expo-linear-gradient** | Gradient UI components |
| **expo-blur** | Blur effects |
| **axios** | HTTP client for API calls |
| **jose** | JWT decoding on the client |
| **React Navigation** | Bottom tabs & native stack navigation |
| **react-native-reanimated** | Smooth animations |

---

## 📁 Project Structure

```
memory/
├── backend/                        # Bun + Express + TypeScript server
│   ├── index.ts                    # App entry point, route registration
│   ├── package.json                # Dependencies & scripts
│   ├── tsconfig.json               # TypeScript configuration
│   ├── middleware/
│   │   ├── verifyToken.ts          # JWT auth middleware
│   │   └── RequestTimeout.ts       # Request timeout middleware
│   ├── routes/
│   │   ├── AskLLm.route.ts         # POST /api/v1/ask — RAG chat endpoint
│   │   ├── PdfHandling.route.ts    # POST /api/v1/fileUpload — PDF ingestion
│   │   ├── ImageHandle.route.ts    # POST /api/v1/imagePost — Image vision + embed
│   │   ├── ExtractWeb.route.ts     # POST /api/v1/webExtract — URL scraping
│   │   └── TextHandle.route.ts     # POST /api/v1/customText — Plain text ingestion
│   ├── utils/
│   │   ├── vectorStoreManager.ts   # LangGraph RAG pipeline + Pinecone setup
│   │   ├── Prompts.ts              # Classification, rewrite, conversational prompts
│   │   ├── ZodTypes.ts             # Zod validation schemas
│   │   └── LogConfig.ts            # Pino logger configuration
│   └── types/
│       ├── express.d.ts            # Express Request type augmentation
│       ├── pdf-parser.d.ts         # pdf-parse type declarations
│       └── pdf.js-extract.d.ts     # pdf.js-extract type declarations
│
└── frontend/                       # React Native + Expo mobile app
    ├── app/                        # Expo Router file-based routes
    │   ├── index.tsx               # Root redirect (auth check)
    │   ├── _layout.tsx             # Root layout with AuthProvider
    │   ├── (auth)/                 # Unauthenticated screens
    │   │   ├── Signin/             # Sign In screen
    │   │   ├── Signup/             # Sign Up screen
    │   │   └── ForgotPassword/     # Password recovery screen
    │   └── (dashboard)/            # Authenticated screens
    │       ├── (tabs)/             # Bottom tab screens
    │       │   ├── Home/           # Home dashboard
    │       │   ├── ask/            # AI chat screen
    │       │   └── Settings/       # Settings screen
    │       ├── profile/            # User profile screen
    │       ├── form/               # Add memory forms
    │       └── Notification/       # Notifications screen
    ├── components/
    │   ├── AddImageComponent.tsx   # Image upload UI + API call
    │   ├── AddLinkComponent.tsx    # URL input UI + API call
    │   ├── AddPDFComponent.tsx     # PDF picker UI + API call
    │   ├── AddTextComponent.tsx    # Text input UI + API call
    │   ├── FloatingAddMenu.tsx     # FAB with source options
    │   ├── Footer.tsx              # App footer component
    │   ├── GoogleButton.tsx        # Google Sign In button
    │   ├── GreetingSection.tsx     # Home greeting header
    │   ├── HeaderButtons.tsx       # Header action buttons
    │   ├── MemoryCategories.tsx    # Memory type categories display
    │   ├── QuickActions.tsx        # Quick action buttons
    │   ├── RecentActivity.tsx      # Recent memory activity list
    │   ├── StatsOverview.tsx       # Memory statistics cards
    │   └── Settings/               # Settings sub-components
    ├── context/
    │   ├── auth.tsx                # AuthContext + Google OAuth provider
    │   └── UserContext.tsx         # Global user state context
    ├── constant.ts                 # API base URL, Google Client ID
    ├── tailwind.config.js          # NativeWind / Tailwind configuration
    └── package.json                # Dependencies & Expo scripts
```

---

## 🌐 API Endpoints

All endpoints require a valid JWT cookie (`Cookie: token=<jwt>`).

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/api/v1/ask` | Chat with your AI memory using RAG | `{ query: string, sessionId?: string }` |
| `POST` | `/api/v1/fileUpload` | Upload and ingest a PDF file | `multipart/form-data` with `pdfFile` |
| `POST` | `/api/v1/imagePost` | Upload an image for AI analysis & storage | `multipart/form-data` with `image` |
| `POST` | `/api/v1/webExtract` | Scrape a URL and store its content | `{ url: string }` |
| `POST` | `/api/v1/customText` | Store plain text in your memory | `{ text: string }` |

### Example: Ask the AI

```bash
curl -X POST http://localhost:5000/api/v1/ask \
  -H "Content-Type: application/json" \
  -H "Cookie: token=<your_jwt>" \
  -d '{"query": "What did I save about machine learning?", "sessionId": "session-123"}'
```

**Response:**
```json
{
  "message": "Based on your stored notes, machine learning is...",
  "sessionId": "session-123"
}
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) `>= 1.0` (backend runtime)
- [Node.js](https://nodejs.org/) `>= 18` (frontend/Expo)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A [Pinecone](https://www.pinecone.io/) account with an index named `ai-memory-with`
- A [Google AI Studio](https://aistudio.google.com/) API key (for Gemini)
- A Google OAuth 2.0 Client ID (for sign-in)

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
bun install

# 3. Copy the example environment file and fill in your keys
cp .env.example .env

# 4. Start the development server (with hot reload)
bun dev

# The server will start at http://localhost:5000
```

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Copy the example environment file and fill in your values
cp .env.example .env

# 4. Start the Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run in browser (web)
npm run web
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Google Gemini AI
GOOGLE_API_KEY=your_google_gemini_api_key

# Pinecone Vector Database
PINECONE_KEY=your_pinecone_api_key
```

### Frontend (`frontend/.env`)

```env
# Backend API base URL
EXPO_PUBLIC_BASE_URL=http://localhost:5000

# Google OAuth Client ID
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

---

## ⚙️ How It Works

### RAG Pipeline (LangGraph StateGraph)

The `/api/v1/ask` endpoint runs a 4-node LangGraph workflow:

```
User Question
      │
      ▼
┌─────────────┐
│  Classify   │  ← Decides: does this need knowledge retrieval or not?
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Rewrite   │  ← Rewrites follow-up questions into standalone queries
└──────┬──────┘       using the last 6 messages of chat history
       │
       ▼
┌─────────────┐
│  Retrieve   │  ← Fetches top-5 semantically similar chunks from Pinecone
└──────┬──────┘       filtered by userId for private memory
       │
       ▼
┌─────────────┐
│  Generate   │  ← Produces the final answer using Gemini 2.5 Flash
└─────────────┘       with retrieved context or conversational fallback
```

### Document Ingestion Flow

1. Content arrives via one of: PDF, Image, URL, or Text endpoint.
2. **For images** — Gemini Vision (`gemini-2.0-flash`) generates a text description.
3. Content is **split** into chunks (size: 1000 chars, overlap: 200 chars) using `RecursiveCharacterTextSplitter`.
4. Each chunk is **embedded** using `gemini-embedding-001` and stored in **Pinecone** with metadata (`userId`, `email`, `extractedAt`, `chunkIndex`).

### Authentication Flow

1. User taps **Sign in with Google** in the mobile app.
2. `expo-auth-session` initiates OAuth 2.0 authorization code flow.
3. The authorization code is exchanged with the backend for a JWT.
4. The JWT is stored in an HTTP-only cookie and verified by `verifyUser` middleware on every request.
5. `userId` and `email` from the JWT payload are attached to `req` and used to namespace vector store data.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request.

---

## 📄 License

This project is private and not licensed for public distribution.

---

<div align="center">
  <p>Built with ❤️ using Google Gemini, LangChain, Pinecone, and Expo</p>
</div>
