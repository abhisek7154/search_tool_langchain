# AI Search Tool (LangChain) 🔍🤖

AI Search Tool is a full-stack web application that combines real-time web search with Large Language Models to deliver accurate, source-backed answers. Built with Next.js, Express, and LangChain, it intelligently decides when to search the web or answer from the LLM's knowledge base, supporting OpenAI, Google Gemini, and Groq.

---

## 🖼️ Screenshots & UI Walkthrough
![Home Screen - Light Mode](https://github.com/user-attachments/assets/84ea9d64-fad5-4c4b-b037-b60879651770)

*The landing page presents a minimalist, inviting interface with example queries to guide users. Simply type your question and let the AI handle the rest.*

**Features:**
- Clean prompt input with contextual examples
- Dark/Light mode toggle in the top-right corner
- Smooth animations and intuitive layout

---

### 2. AI-Generated Answers with Sources

![Search Result - Light Mode](https://github.com/user-attachments/assets/60032787-018b-4291-87ae-739b2553a905)

*Query: "Top 10 highest-grossing movies of all time"*

The app instantly returns comprehensive, AI-synthesized answers grounded in real web data. Each response includes:
- **AI-Generated Summary:** Coherent, natural language explanation (answered in 4.3s)
- **Cited Sources:** Clickable links to the original sources (editorial.rottentomatoes.com, reddit.com, manofmany.com)
- **Transparency:** Full traceability of where the information comes from

---

### 3. Multi-Turn Conversational Q&A

![Conversation - New Query](https://github.com/user-attachments/assets/bafac009-d054-4a26-a15e-1e503ca9de18
)

*Query: "What is space?"*

The system supports follow-up questions and multi-turn conversations:
- **Intelligent Context:** The agent understands your query and decides whether web search is needed
- **Fast Responses:** Some queries are answered from the LLM's knowledge base in **0.5 seconds**
- **Educational Content:** Answers are tailored for clarity and accessibility
- **No hallucination:** Web search ensures factual accuracy

---

### 4. Dark Mode for Night-Time Browsing

![Dark Mode - Multiple Interactions](https://github.com/user-attachments/assets/247a13ee-8973-453a-8a19-c59ec2ecd9f1
)

*The same powerful search experience in dark mode.*

All features remain intact:
- **Consistent Functionality:** Dark mode doesn't compromise performance
- **Eye-Friendly:** Perfectly suited for low-light environments
- **Professional Appearance:** Sleek, modern design aesthetic

---

## 📊 How It Works (Quick Flow)

```
User Query
    ↓
[LangChain Agent - Express Backend]
    ↓
Decision: Web Search Needed?
    ├─→ Yes: Query Tavily API → Parse HTML → Feed to LLM
    └─→ No: Direct LLM Response
    ↓
[LLM Processing] (OpenAI/Groq/Gemini)
    ↓
Synthesized Answer + Source Links
    ↓
Stream to Frontend (Next.js)
    ↓
User sees response with citations & sources
```

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
