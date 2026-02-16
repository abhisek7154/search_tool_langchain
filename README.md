# AI Search Tool (LangChain) 🔍🤖

A robust, full-stack AI-powered search application that bridges the gap between real-time web search and Large Language Models. Built with **Next.js 16**, **Express**, and **LangChain**, this tool uses the Tavily API to fetch up-to-date information from the web and synthesizes comprehensive answers using your choice of LLM (OpenAI, Google Gemini, or Groq).

---

## ✨ Key Features

* **🧠 Multi-LLM Support:** Seamlessly toggle between industry-leading models:
    * OpenAI (`gpt-4o-mini`)
    * Groq (`llama-3.1-8b-instant`)
    * Google Gemini (`gemini-2.0-flash-lite`)
* **🌐 Real-Time Web Search:** Integrates the Tavily Search API as a tool within the LangChain agent to provide grounded, factual, and up-to-date responses.
* **⚡ Modern Frontend:** A highly responsive, animated UI built with Next.js 16 (App Router), React 19, Tailwind CSS v4, and Radix UI primitives.
* **🛡️ Type-Safe Backend:** An Express backend written in TypeScript, utilizing `zod` for strict runtime schema validation.

---

## 🏗️ Architecture

The application is structured as a monorepo containing a separate client and server:

1.  **Client (Next.js):** Handles the user interface, manages chat state, and sends queries to the backend.
2.  **Server (Express):** Receives the query and initializes a LangChain Agent.
3.  **Agent Logic (LangChain):**
    * The Agent determines if the user's query requires searching the web.
    * If yes, it calls the **Tavily API** tool to retrieve HTML content/search results.
    * The `html-to-text` utility parses any messy web data.
    * The chosen **LLM Provider** (Groq, Gemini, or OpenAI) synthesizes the retrieved data into a natural language response.
4.  **Response:** The server streams or returns the final synthesized answer back to the frontend.

---

## 📁 Project Structure

```text
search_tool_langchain/
├── backend/                  # Express server & LangChain logic
│   ├── src/
│   │   ├── routes/           # Express API route handlers
│   │   ├── search_tool/      # LangChain agents, tools & model initialization
│   │   ├── shared/           # Shared TypeScript interfaces & Zod schemas
│   │   └── utils/            # Helper functions (HTML parsing, etc.)
│   ├── .env                  # Backend environment variables
│   ├── package.json        
│   └── tsconfig.json
│
└── frontend/                 # Next.js web interface
    ├── src/
    │   ├── app/              # Next.js App Router (pages & layouts)
    │   ├── components/ui/    # Reusable UI components (Radix/Tailwind)
    │   └── lib/              # Frontend utilities and API clients
    ├── package.json        
    └── tailwind.config.ts    # Tailwind CSS v4 configuration

```

---

## 🛠️ Getting Started

### Prerequisites

* **Node.js**: v20.0.0 or higher
* **API Keys**: You will need at least one LLM API key (Groq, Gemini, or OpenAI) and a Tavily API key.

### 1. Installation

Clone the repository and install the dependencies for both environments.

```bash
# Clone the repository
git clone [https://github.com/abhisek7154/search_tool_langchain.git](https://github.com/abhisek7154/search_tool_langchain.git)
cd search_tool_langchain

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

```

### 2. Environment Configuration

Navigate to the `backend/` directory and create a `.env` file. Copy the following variables and fill in your API keys.

```env
# --- API Keys ---
# Add the keys for the models you intend to use. You do not need all three.
GOOGLE_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Required for web search capabilities
TAVILY_API_KEY=your_tavily_search_api_key_here

# --- Server Configuration ---
PORT=5000
ALLOWED_ORIGIN=http://localhost:3000

# --- Model Selection ---
# Set the specific model versions you wish to use
OPENAI_MODEL=gpt-4o-mini
GROQ_MODEL=llama-3.1-8b-instant
GEMINI_MODEL=gemini-2.0-flash-lite

# --- Active Providers ---
SEARCH_PROVIDER=tavily

# Change this to switch your active AI brain! 
# Options: openAI || gemini || groq
MODEL_PROVIDER=groq

```

### 3. Running the Development Servers

You will need to run two separate terminals to start the application.

**Terminal 1: Start the Backend**

```bash
cd backend
npm run dev

```

*(The Express server will start on `http://localhost:5000` using `tsx` for fast TypeScript execution and watch mode).*

**Terminal 2: Start the Frontend**

```bash
cd frontend
npm run dev

```

*(The Next.js application will start on `http://localhost:3000`).*

---

## 📡 API Reference (Backend)

While the Next.js frontend handles the UI, you can also interact directly with the Express backend.

### `POST /api/search` (Example Route)

Triggers the LangChain agent to process a query.

**Request Body:**

```json
{
  "query": "What were the latest announcements from Google I/O?",
  "history": [] 
}

```

**Response:**

```json
{
  "success": true,
  "answer": "Based on the recent search results, the latest announcements from Google I/O include...",
  "sources": ["[https://blog.google/](https://blog.google/)..."]
}

```

*(Note: Adjust the endpoint paths above if you named your routes differently in `backend/src/routes/`)*

---

## 💻 Tech Stack Deep Dive

### Frontend Dependencies

* **`next@16.1.1`**: React framework for SSR and routing.
* **`tailwindcss@^4`**: Utility-first CSS framework.
* **`radix-ui`**: Unstyled, accessible UI primitives for building the design system.
* **`lucide-react`**: Beautiful, consistent icon set.

### Backend Dependencies

* **`@langchain/core`**: Base abstractions for the AI agent workflow.
* **`@langchain/groq`, `@langchain/google-genai`, `@langchain/openai**`: Provider-specific LangChain integrations.
* **`express@^5.2.1`**: Fast, unopinionated web framework.
* **`zod`**: TypeScript-first schema declaration and validation.
* **`html-to-text`**: Advanced HTML parser to feed clean text to the LLMs.

---

## 👨‍💻 Author

**Abhisek Sahoo**

* GitHub: [@abhisek7154](https://github.com/abhisek7154)

## 📄 License

This project is licensed under the **ISC License**.
