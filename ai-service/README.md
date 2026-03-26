<br/>
<div align="center">
  <img src="https://img.icons8.com/fluency/256/000000/chatbot.png" alt="Logo" width="100">

  <h1 align="center">AI Intelligence Microservice</h1>

  <p align="center">
    <strong>High-performance Python microservice for LLM orchestration, PDF processing, and academic material generation.</strong>
    <br />
    <br />
    <a href="#-executive-summary">Overview</a>
    ·
    <a href="#-ai-capabilities">Capabilities</a>
    ·
    <a href="#-technical-stack">Tech Stack</a>
    ·
    <a href="#-setup--development">Setup</a>
  </p>
</div>

---

## 📑 Table of Contents
1. [Executive Summary](#-executive-summary)
2. [AI Capabilities & Pipelines](#-ai-capabilities--pipelines)
3. [Architecture Logic](#-architecture-logic)
4. [Folder Structure](#-folder-structure)
5. [Technical Stack](#-technical-stack)
6. [Setup & Development](#-setup--development)

---

## 🚀 Executive Summary
The AI-Service is the analytical "brain" of the Smart Study Tracker platform. Developed independently in Python via FastAPI, this microservice detaches computationally heavy machine learning and text processing tasks away from the Node.js API. It connects directly to the Node backend to process Natural Language Tasks, returning structured, JSON-verified payloads or organic markdown chat responses for the frontend.

---

## 🔥 AI Capabilities & Pipelines

### 1. 🧠 Personalized Mentorship (Context-Aware Chat)
The chatbot endpoint utilizes multi-turn memory tracking. However, its true value lies in **Academic Profile Integration**. The backend injects the student’s past 6 months of study session metrics into a hidden prompt. The AI evaluates focus scores and test performances *before* answering, resulting in localized, logically sound academic advice rather than generic support.

### 2. 📄 Advanced PDF RAG (Retrieval-Augmented Generation)
Students can drag-and-drop course textbooks directly into the chat interface. 
- **Extraction**: The FastAPI engine parses the binary PDF context using specialized Python NLP libraries.
- **Orchestration**: It dynamically restricts the LLM's "hallucination scope" ensuring answers are factually sourced entirely from the uploaded document.

### 3. 📝 Strict Test Generation
Users instantly generate MCQs and descriptive tests targeting any Subtopic.
- **Grounding Strategy**: The system fetches the exact context payload created by the Admin Console for that subtopic.
- **Schema Validation**: The AI is forced to return highly structured JSON matching the React UI components dynamically using Pydantic validation structures, preventing formatting crashes.

---

## 🧱 Architecture Logic

1. **Request Intake**: Express.js hits the `/api/chat` or `/api/generate-test` FastAPI routes.
2. **Context Compilation**: Essential user history or Admin Syllabus variables are injected into the context window.
3. **Inference**: The system connects via REST to ultra-fast inference APIs (Groq hardware running `Qwen 2.5` or `DeepSeek`). Local fallback models can also be enabled via HuggingFace transformers.
4. **Validation**: Pydantic validates the response to ensure frontends receive 100% executable strings/JSON.

---

## 📂 Folder Structure
```text
ai-service/
├── routes/              # FastAPI APIRouter endpoints 
├── services/            # Prompt engineering and LLM chain logic
├── utils/               # PDF processing algorithms & regex formatters
├── main.py              # Uvicorn entry point and CORS configuration
└── requirements.txt     # Locked production dependencies
```

---

## 🛠️ Technical Stack
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/)
- **LLM Infrastructure**: [Groq API](https://groq.com/) for lightning-speed hardware inference.
- **NLP Utilities**: `PyPDF2`, `pdfplumber`, and Regex logic.
- **Data Validation**: [Pydantic](https://docs.pydantic.dev/)

---

## ⚙️ Setup & Development
Requires Python 3.10+ and a Groq API key securely loaded into `.env`.

1. **Environment Setup**:
   ```bash
   cp .env.example .env
   # Add your GROQ_API_KEY
   ```
2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Launch the Uvicorn Server**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *(Swagger Documentation automatically generates at `http://localhost:8000/docs`)*
