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

The system uses a **LangGraph-based agentic RAG pipeline** backed by **Pinecone vector store** and **Google Gemini 2.5 Flash Lite** to intelligently decide when to retrieve stored context and when to respond conversationally, all while maintaining per-session chat history.

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
- **User-Isolated Memory** — Vector search is filtered by `userId` metadata so each user only retrieves their own stored knowledge.
- **Persistent Chat History** — Sessions maintain up to 10 messages of rolling chat history.

### 🔐 Authentication
- **Email & Password** — Sign up / Sign in with email and password. Passwords are hashed with bcrypt (12 rounds). Password must be 8–16 characters.
- **Google OAuth** — Sign in with Google via `expo-auth-session` and `@react-native-google-signin/google-signin`.
- **JWT-based Auth** — Bearer tokens (7-day expiry) are verified on every protected backend request via `verifyUser` middleware. Token payload is decoded client-side using `jose`.
- **Forgot Password** — Password recovery flow available from the sign-in screen.

### 🗑️ Privacy & Data Control
- **Delete Account & Data** — Permanently deletes the user account, all Postgres Memory records (via CASCADE), and all Pinecone vector embeddings filtered by `userId`.
- **Clear AI Memory** — Wipes all Pinecone vector embeddings and Postgres Memory rows for the user while keeping the account active. Resets dashboard stats.
- **Manage AI Memory Retention** — User-configurable setting for how long AI remembers data.
- Both destructive actions require confirmation dialogs and show loading indicators while in progress.

### ⚙️ User Settings
- **AI Personalisation** — Configure AI personality (e.g., neutral, friendly, professional) stored in a `settings` JSON field on the User model.
- **Memory Retention** — Choose how long the AI retains stored data (`indefinite` by default).
- **App Lock & Two-Factor Authentication** — Security settings stored in user preferences.
- **Profile Management** — Edit display name, email, username, and profile picture (picked from device gallery).

### 📱 Mobile UI
- **Tab Navigation** — Bottom tab navigation with Home, Ask AI, and Settings screens.
- **Floating Action Menu** — A FAB (Floating Action Button) to quickly add memory from any source (PDF, Image, Link, Text).
- **Dashboard Stats** — Overview of stored memories by type, quick actions, and recent activity.
- **Notifications** — In-app notification screen.
- **Profile Page** — User profile editing with inline modal editor and account deletion.
- **Haptic Feedback** — `expo-haptics` for tactile interactions.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Mobile App (Expo)                      │
│  ┌────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Auth  │  │  Home    │  │  Ask AI  │  │ Settings │  │
│  │Email/PW│  │Dashboard │  │  Chat    │  │ Profile  │  │
│  │Google  │  │  Stats   │  │          │  │ Privacy  │  │
│  └────────┘  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS + Authorization: Bearer <JWT>
┌──────────────────────▼──────────────────────────────────┐
│               Backend (Bun + Express + TypeScript)        │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  /api/v1/auth (public)                           │    │
│  │  POST /signup   POST /login                      │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │           verifyUser Middleware (JWT)            │    │
│  └─────────────────────────────────────────────────┘    │
│                         │                               │
│  ┌──────────┐  ┌────────┐  ┌─────────┐  ┌──────────┐   │
│  │  /ask    │  │/upload │  │/image   │  │/webExtract│  │
│  │  RAG     │  │  PDF   │  │ Vision  │  │  Cheerio  │  │
│  └────┬─────┘  └───┬────┘  └────┬────┘  └────┬─────┘   │
│       └────────────┴────────────┴─────────────┘         │
│                      Pinecone + Prisma                   │
└──────────────────────────────────────────────────────────┘
         │
┌────────▼─────────────────────────────────────────────────┐
│                    LangChain / LangGraph                   │
│  ┌───────────┐  ┌───────────┐  ┌──────────────────────┐  │
│  │ Classify  │→─│  Rewrite  │→─│     Retrieve          │  │
│  │   Node    │  │   Node    │  │ (Pinecone + userId)   │  │
│  └───────────┘  └───────────┘  └──────────┬───────────┘  │
│                                            │              │
│                               ┌────────────▼────────────┐ │
│                               │       Generate           │ │
│                               │  (Gemini 2.5 Flash Lite)│ │
│                               └─────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
         │
┌────────▼─────────────────────────────────────────────────┐
│                 External Services                          │
│  ┌──────────────┐         ┌──────────────────────────┐   │
│  │   Pinecone   │         │  Google Gemini AI         │   │
│  │ Vector Store │         │  gemini-2.5-flash-lite    │   │
│  │ Index: ai-   │         │  (LLM + Vision)           │   │
│  │ memory       │         │  gemini-embedding-001     │   │
│  └──────────────┘         └──────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────┐                             │
│  │   PostgreSQL (Prisma)    │                             │
│  │   User + Memory tables   │                             │
│  │   User.settings (JSON)   │                             │
│  └──────────────────────────┘                             │
└───────────────────────────────────────────────────────────┘
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
| **Pinecone** (`@pinecone-database/pinecone`) | Vector database for semantic search & deletion |
| **PostgreSQL + Prisma** | Relational database (User, Memory models with `pg` adapter) |
| **bcryptjs** | Password hashing (12 rounds) |
| **Multer** | Multipart file upload handling |
| **Cheerio** | Web scraping & content extraction |
| **pdf-parse / pdf.js-extract** | PDF text extraction |
| **jsonwebtoken** | JWT creation and verification |
| **Zod** | Request body validation |
| **Pino + pino-pretty** | Structured production logging |
| **dotenv** | Environment variable management |
| **cors** | Cross-origin resource sharing |

### Frontend
| Technology | Purpose |
|---|---|
| **React Native** | Cross-platform mobile framework |
| **Expo (SDK 54)** | Managed workflow, build tooling |
| **Expo Router** | File-based navigation routing |
| **NativeWind** | Tailwind CSS for React Native styling |
| **AsyncStorage** | JWT session token storage |
| **jose** | Client-side JWT payload decoding |
| **expo-document-picker** | PDF file selection |
| **expo-image-picker** | Image selection from gallery/camera |
| **expo-image** | Optimised image rendering |
| **expo-auth-session** | OAuth 2.0 session handling |
| **expo-web-browser** | In-app browser for OAuth flows |
| **expo-haptics** | Haptic feedback |
| **expo-blur** | Blur effects |
| **expo-linear-gradient** | Gradient UI elements |
| **@expo-google-fonts/inter** | Inter font family |
| **@react-native-google-signin/google-signin** | Google Sign-In integration |
| **react-native-app-auth** | Native OAuth/OpenID Connect |
| **React Navigation** | Bottom tabs & native stack navigation |
| **react-native-safe-area-context** | Safe area insets handling |
| **react-native-reanimated** | Animations |
| **react-native-gesture-handler** | Gesture recognition |
| **react-native-toast-message** | In-app toast notifications |
| **axios** | HTTP client for API calls |

---

## 📁 Project Structure

```
memory/
├── backend/                        # Bun + Express + TypeScript server
│   ├── index.ts                    # App entry point, route registration
│   ├── prisma.config.ts            # Prisma configuration
│   ├── package.json                # Dependencies & scripts
│   ├── tsconfig.json               # TypeScript configuration
│   ├── middleware/
│   │   ├── verifyToken.ts          # JWT Bearer auth middleware
│   │   └── RequestTimeout.ts       # Request timeout middleware
│   ├── controllers/
│   │   ├── auth.controller.ts      # signup, login
│   │   └── stats.controller.ts     # Home dashboard stats
│   ├── routes/
│   │   ├── auth.route.ts           # POST /signup, POST /login
│   │   ├── AskLLm.route.ts         # POST /api/v1/ask — RAG chat
│   │   ├── PdfHandling.route.ts    # POST /api/v1/fileUpload — PDF ingestion
│   │   ├── ImageHandle.route.ts    # POST /api/v1/imagePost — Image vision + embed
│   │   ├── ExtractWeb.route.ts     # POST /api/v1/webExtract — URL scraping
│   │   ├── TextHandle.route.ts     # POST /api/v1/customText — Plain text
│   │   └── stats.route.ts          # GET /api/v1/stats/home
│   ├── prisma/
│   │   ├── schema.prisma           # User (with settings JSON) & Memory models
│   │   └── client.ts               # Prisma client singleton (pg adapter)
│   ├── generated/
│   │   └── prisma/                 # Auto-generated Prisma client output
│   ├── utils/
│   │   ├── vectorStoreManager.ts   # LangGraph RAG pipeline + Pinecone setup
│   │   ├── Prompts.ts              # Classification, rewrite, conversational prompts
│   │   ├── ZodTypes.ts             # Zod validation schemas
│   │   └── LogConfig.ts            # Pino logger configuration
│   ├── uploads/                    # Temporary file upload storage
│   └── types/
│       ├── express.d.ts            # Express Request type augmentation
│       ├── pdf-parser.d.ts         # pdf-parse type declarations
│       └── pdf.js-extract.d.ts     # pdf.js-extract type declarations
│
└── frontend/                       # React Native + Expo mobile app
    ├── app/                        # Expo Router file-based routes
    │   ├── App.tsx                 # App wrapper
    │   ├── index.tsx               # Root redirect (auth check)
    │   ├── _layout.tsx             # Root layout with UserProvider
    │   ├── (auth)/                 # Unauthenticated screens
    │   │   ├── Signin/             # Sign In screen (email + Google)
    │   │   ├── Signup/             # Sign Up screen
    │   │   └── ForgotPassword/     # Password recovery screen
    │   └── (dashboard)/            # Authenticated screens
    │       ├── (tabs)/             # Bottom tab screens
    │       │   ├── Home/           # Home dashboard with stats
    │       │   ├── ask/            # AI chat screen
    │       │   └── Settings/       # Settings screen
    │       ├── profile/            # User profile + Delete Account
    │       ├── form/               # Add memory forms
    │       │   ├── AddText/        # Plain text input
    │       │   ├── AddImages/      # Image upload
    │       │   ├── AddLink/        # Web URL extraction
    │       │   └── AddPdf/         # PDF upload
    │       └── Notification/       # Notifications screen
    ├── components/
    │   ├── Settings/
    │   │   ├── AccountComponent.tsx       # Account info & navigate to profile
    │   │   ├── PrivacyComponent.tsx       # Delete Account, Clear AI Memory & Memory Retention
    │   │   ├── AiPersonalisationComponent.tsx  # AI personality settings
    │   │   └── SecurityComponent.tsx      # App Lock & Two-FA settings
    │   ├── FloatingAddMenu.tsx     # FAB with source options
    │   ├── Footer.tsx              # App footer
    │   ├── GoogleButton.tsx        # Google Sign-In button component
    │   ├── GreetingSection.tsx     # Home greeting header
    │   ├── HeaderButtons.tsx       # Reusable header button components
    │   ├── MemoryCategories.tsx    # Memory type categories
    │   ├── QuickActions.tsx        # Quick action buttons
    │   ├── RecentActivity.tsx      # Recent memory activity list
    │   ├── StatsOverview.tsx       # Memory statistics cards
    │   └── index.ts                # Barrel exports for components
    ├── context/
    │   └── UserContext.tsx         # Global user state (decoded from JWT) + logout helper
    ├── utils/
    │   └── contants.ts             # API URL from EXPO_PUBLIC_API_BASE
    ├── constant.ts                 # GOOGLE_CLIENT_ID, AUTH_URL, BASE_URL, cookie config
    ├── types/                      # Shared TypeScript type definitions
    ├── global.css                  # Global NativeWind/Tailwind styles
    ├── tailwind.config.js          # Tailwind configuration
    ├── babel.config.js             # Babel/Metro configuration
    ├── eas.json                    # EAS Build configuration
    └── package.json                # Dependencies & Expo scripts
```

---

## 🌐 API Endpoints

### Auth (Public)
| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/api/v1/auth/signup` | Create a new account | `{ name, email, password }` |
| `POST` | `/api/v1/auth/login` | Log in and receive a JWT | `{ email, password }` |

### Memory (Protected — `Authorization: Bearer <token>`)
| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/api/v1/ask` | Chat with your AI memory using RAG | `{ query: string, sessionId?: string }` |
| `POST` | `/api/v1/fileUpload` | Upload and ingest a PDF file | `multipart/form-data` with `pdfFile` |
| `POST` | `/api/v1/imagePost` | Upload an image for AI analysis & storage | `multipart/form-data` with `image` |
| `POST` | `/api/v1/webExtract` | Scrape a URL and store its content | `{ url: string }` |
| `POST` | `/api/v1/customText` | Store plain text in your memory | `{ text: string }` |
| `GET`  | `/api/v1/stats/home` | Home dashboard stats (counts per type) | — |

### Example: Ask the AI

```bash
curl -X POST http://localhost:5000/api/v1/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt>" \
  -d '{"query": "What did I save about machine learning?", "sessionId": "session-123"}'
```

**Response:**
```json
{
  "message": "Based on your stored notes, machine learning is...",
  "sessionId": "session-123"
}
```

### Example: Upload a PDF

```bash
curl -X POST http://localhost:5000/api/v1/fileUpload \
  -H "Authorization: Bearer <your_jwt>" \
  -F "pdfFile=@/path/to/document.pdf"
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) `>= 1.0` (backend runtime)
- [Node.js](https://nodejs.org/) `>= 18` (frontend/Expo)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A [Pinecone](https://www.pinecone.io/) account with an index named **`ai-memory`**
- A [Google AI Studio](https://aistudio.google.com/) API key (for Gemini LLM + embeddings)
- A [Google Cloud Console](https://console.cloud.google.com/) OAuth 2.0 Client ID (for Google Sign-In)
- A PostgreSQL database (connection string for Prisma)

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
bun install

# 3. Copy the example environment file and fill in your keys
cp .env.example .env

# 4. Run Prisma migrations to create the database tables
bunx prisma migrate dev

# 5. Start the development server (with hot reload)
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

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Google Gemini AI
GOOGLE_API_KEY=your_google_gemini_api_key

# Pinecone Vector Database
PINECONE_KEY=your_pinecone_api_key
```

### Frontend (`frontend/.env`)

```env
# Backend API base URL (include /api/v1)
EXPO_PUBLIC_API_BASE=http://192.168.x.x:5000/api/v1

# Google OAuth Client ID (from Google Cloud Console)
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
│  Classify   │  ← Does this need knowledge retrieval or can be answered conversationally?
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
└──────┬──────┘       filtered by { userId } for private, isolated memory
       │
       ▼
┌─────────────┐
│  Generate   │  ← Produces the final answer using Gemini 2.5 Flash Lite
└─────────────┘       with retrieved context or conversational fallback
```

### Document Ingestion Flow

1. Content arrives via one of: PDF, Image, URL, or Text endpoint.
2. **For images** — Gemini Vision (`gemini-2.5-flash-lite`) generates a text description.
3. Content is **split** into chunks (size: 1000 chars, overlap: 200 chars) using `RecursiveCharacterTextSplitter`.
4. Each chunk is **embedded** using `gemini-embedding-001` and stored in **Pinecone** (`ai-memory` index) with metadata `{ userId, email, createdAt }`.
5. A summary record is also written to the **Postgres `Memory` table** for dashboard stats and activity feeds.

### Data Deletion Flow

When a user triggers **Delete Account** or **Clear AI Memory**:

1. Backend calls `pineconeIndex.deleteMany({ filter: { userId: { $eq: userId } } })` to remove all vectors belonging to that user from Pinecone.
2. For **Delete Account**: `prisma.user.delete()` is called — the `onDelete: Cascade` relation automatically removes all `Memory` rows.
3. For **Clear Memory**: `prisma.memory.deleteMany({ where: { userId } })` removes Memory rows while the User row is kept.
4. Frontend clears the local JWT session and redirects to the Sign-in screen (Delete Account only).

### Authentication Flow

1. **Email/Password**: User enters credentials → backend verifies, bcrypt compares hashes → JWT (7-day expiry) returned and stored in `AsyncStorage` as `"session"`.
2. **Google OAuth**: User taps Google Sign-In → `expo-auth-session` initiates the OAuth flow via `expo-web-browser` → Google token exchanged for app JWT.
3. Every subsequent API request sends `Authorization: Bearer <token>`.
4. `verifyUser` middleware decodes the token and attaches `req.userId` and `req.email` to the request.
5. On the client, `jose` decodes the JWT payload to hydrate `UserContext` without a network call.

### User Settings

User preferences are stored as a `Json` field on the `User` model with the following shape:

```json
{
  "personality": "neutral",
  "retention": "indefinite",
  "appLock": false,
  "twoFA": false
}
```

These are configurable from the **Settings → AI Personalisation** and **Settings → Security** screens.

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
  <p>Built with ❤️ using Google Gemini, LangChain, Pinecone, PostgreSQL, and Expo</p>
</div>
