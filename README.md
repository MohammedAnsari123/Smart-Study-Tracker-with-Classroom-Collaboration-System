<br/>
<div align="center">
  <img src="https://img.icons8.com/fluency/256/000000/graduation-cap.png" alt="Logo" width="100">

  <h1 align="center">Smart Study Tracker & Classroom Collaboration System</h1>

  <p align="center">
    <strong>An AI-powered academic operating system for tracking, collaboration, analytics, and intelligent learning.</strong>
    <br />
    <br />
    <a href="#-executive-summary">Executive Summary</a>
    ·
    <a href="#-comprehensive-feature-breakdown">Features</a>
    ·
    <a href="#-system-architecture">Architecture</a>
    ·
    <a href="#-installation--setup">Installation</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Node.js-V18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License" />
  </p>
</div>

---

## 📑 Table of Contents

1. [Executive Summary](#-executive-summary)
2. [Problem & Solution Context](#-problem--solution-context)
3. [Comprehensive Feature Breakdown](#-comprehensive-feature-breakdown)
   - [Student Learning Portal](#1-student-learning-portal)
   - [Classroom & Collaboration Engine](#2-classroom--collaboration-engine)
   - [AI Intelligence Core](#3-ai-intelligence-core)
   - [Admin Management Console](#4-admin-management-console)
4. [Modular System Architecture](#-modular-system-architecture)
   - [1. Backend (Node.js API)](#1-core-api-backend-nodejsexpress)
   - [2. AI Service (Python)](#2-ai-intelligence-microservice-fastapipython)
   - [3. Frontend (Student SPA)](#3-student-study-portal-reactvite)
   - [4. Admin Frontend (Control SPA)](#4-admin-management-console-reactvite)
5. [Technical Stack & External Libraries](#-technical-stack--external-libraries)
6. [Database Schema & Entity Models](#-database-schema--entity-models)
7. [Installation & Setup Guild](#-installation--setup)
8. [Future Scope & Roadmap](#-future-scope--roadmap)
9. [Contributors & License](#-contributors--license)

---

## 🚀 Executive Summary

The **Smart Study Tracker** is an enterprise-grade, microservice-driven Learning Management System (LMS) intertwined with advanced AI mentoring and real-time academic analytics. 

Designed for schools, colleges, and self-taught developers, it bridges the gap between solitary study tracking and official classroom collaboration. The system incorporates a unified **5-layer curriculum taxonomy** (Department → Subject → Chapter → Topic → Subtopic), ensuring that all AI interactions, generated tests, and analytical heatmaps are grounded entirely in verifiable, real-world syllabi.

---

## 📌 Problem & Solution Context

### The Academic Problem
* **Fragmented Ecosystems:** Students use different apps for taking notes, tracking Pomodoro timers, and submitting official assignments.
* **Lack of Data-Driven Insights:** Students don't know *where* they are failing, resulting in burnout and inefficient study times.
* **Generic AI Hallucinations:** Using public AI models often yields off-topic responses because they do not understand the student's *specific university syllabus* or their historical test scores.

### The Engineered Solution
* **Unified Academic Hub:** A single platform handling study sessions, active recall flashcards, and classroom assignment submissions.
* **Context-Injected AI Mentor:** The AI knows your last 6 months of test scores, your current syllabus, and your exact weaknesses.
* **Real-time Recharts Analytics:** Visualizing burnout risks, peak focus hours, and subject mastery on dynamic UI dashboards.

---

## 🔥 Comprehensive Feature Breakdown

### 1. Student Learning Portal
* **Dashboard Analytics:** Live monitoring of "Productivity Score", Total Time, and a GitHub-style consistency heatmap.
* **Pomodoro Timer & Session Logger:** Integrated focus timers that push real-time study data (duration, topic, focus score) to the MongoDB backend.
* **Syllabus Mastery Radar:** Visual radar charts comparing performance across different subjects.
* **Active Recall Flashcards:** Instantly memorize topics through spaced repetition.
* **Digital Library:** Secure access carefully curated PDFs and links filtered automatically by the student's Department and Semester.

### 2. Classroom & Collaboration Engine
* **Secure Invite System:** Students join institutional classrooms using specific generated access codes.
* **Academic Kanban Board:** A personal Trello-style board dragging tasks from `Backlog` → `In Progress` → `Review` → `Done`.
* **Assignment Submission:** Securely upload assignment PDFs (via Multer/Cloudinary) with real-time deadline calculation and urgency alerts.
* **Teacher Visibility:** Educators can monitor their classroom's live statistics to determine which topics are overwhelmingly difficult for the cohort.

### 3. AI Intelligence Core
* **Streaming Chatbot UI:** A fully responsive, Markdown-supported AI chat interface utilizing organic, character-by-character typing effects.
* **PDF "Chat-with-Doc":** Upload any textbook or note PDF directly into the chat; the Python backend extracts the text and restricts the AI to answer *only* based on that document.
* **Automated Test Generation:** The system evaluates user weaknesses, pulls the relevant subtopic from the database, and forces the LLM to generate strict JSON formats of MCQs or Descriptive tests.
* **Burnout & Weakness Detection:** The AI analytically evaluates study distribution and alerts the student if they are at risk of academic fatigue.

### 4. Admin Management Console
* **Real-Time Data Polling:** The dashboard syncs every 30 seconds to provide up-to-the-minute metrics on active users and platform load.
* **5-Layer Syllabus Control:** A hierarchical tree-view editor to manipulate Departments, Subjects, Chapters, Topics, and Subtopics system-wide.
* **Role Management & Security:** Secure interfaces to oversee user roles, ban abusive accounts, and reset credentials.
* **Premium Glassmorphic UI:** Built with custom Vanilla CSS variables for a high-end, signature red/indigo aesthetic separate from the student application.

---

## 🧩 Modular System Architecture

The application is split into four distinct, highly cohesive microservices/modules.

### 1. Core API Backend (`Node.js`/`Express`)
> **Role:** The central nervous system and data orchestrator.
* **Auth**: Custom JWT-based middleware with Role-Based Access Control (`isStudent`, `isAdmin`).
* **Controllers**: Segregated logic for Users, Classrooms, Materials, Study Sessions, and Tasks.
* **Integration**: Acts as a proxy, gathering a student's history from MongoDB, formatting it, and securely piping it to the AI microservice for processing.

### 2. AI Intelligence Microservice (`FastAPI`/`Python`)
> **Role:** The heavy-lifting engine for Natural Language Processing and LLM Inference.
* **Performance**: Built on asynchronous FastAPI+Uvicorn for low-latency non-blocking AI responses.
* **Model Inference**: Connects to high-performance local or cloud LLMs (`Qwen2.5`, `DeepSeek` via Groq/HF).
* **Extraction**: Utilizes Python-based PDF processing to ingest files and apply RAG (Retrieval-Augmented Generation) so the AI can "read".

### 3. Student Study Portal (`React`/`Vite`)
> **Role:** The primary interactive hub for learners.
* **State Management**: React Context API for global state (Auth, Theme).
* **Routing**: Fully protected React-Router-DOM setup.
* **UI/UX**: Tailwind CSS powered with `lucide-react` icons and `Recharts` for interactive data visualization.

### 4. Admin Management Console (`React`/`Vite`)
> **Role:** The system oversight dashboard.
* **Architecture**: A separate SPA to prevent bloated monolithic bundles and isolate security perimeters.
* **Styling Strategy**: Stripped of Tailwind in favor of extremely polished, vanilla CSS multi-variable design systems for extreme institutional customization.

---

## 🛠️ Technical Stack & External Libraries

### Languages & Core Web
* **JavaScript (ES6+)** - Frontend logic and Node runtime.
* **Python 3.10+** - AI Microservice and text processing.
* **HTML5 / CSS3** - Semantic structuring and core aesthetics.

### Frontend Ecosystem (React)
* `react-router-dom` - Client-side page routing.
* `recharts` - SVGs and canvas-based chart visualization.
* `lucide-react` - Minimalist, highly customizable icon library.
* `react-markdown` & `remark-gfm` - To render complex AI text outputs safely into HTML.
* `axios` - Promise-based HTTP client for precise interceptor and token handling.
* `tailwindcss` - Utility-first styling (Client SPA only).

### Backend Ecosystem (Node/Express)
* `express` - API mounting and middleware mapping.
* `mongoose` - ODM mapping the JavaScript objects to MongoDB documents.
* `jsonwebtoken` (JWT) & `bcryptjs` - Cryptography for secure authentication.
* `cors` & `dotenv` - Environment security and cross-origin controls.

### AI Ecosystem (Python)
* `fastapi` - High-performance Python API framework.
* `uvicorn` - ASGI web server implementation.
* `PyPDF2` / `pdfplumber` - Advanced PDF text extraction algorithms.
* `pydantic` - Strict data parsing and validation for FastAPI routes.

---

## 🗄️ Database Schema & Entity Models

The MongoDB Atlas structure is heavily normalized to support deep syllabus relationships.

1. **User Schema (`users`)**:
   - `fullName`, `email`, `passwordHash`
   - `role` (Student | Admin | Teacher)
   - `department`, `semester` (Crucial for smart filtering)
2. **Subject Schema (`subjects`)**:
   - Array of `chapters` → Array of `topics` → Array of `subtopics`.
3. **Classroom Schema (`classrooms`)**:
   - `classCode`, `teacherId`, Array of `students`
   - Nested `assignments` array (title, deadline, URL).
4. **Study Session Schema (`studysessions`)**:
   - Linked to a `userId` and `topicId`.
   - Stores `durationMinutes`, `focusScore`, `testScore`, and `outcome`.

---

## ⚙️ Installation & Setup

This application demands 4 active terminals to run the full microservice architecture locally.

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- MongoDB connection string (Local or Atlas)
- Groq / OpenRouter API Key

### Step 1: Environment Setup
Clone the repository, then configure your `.env` files.
**Backend (`backend/.env`):**
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster...
JWT_SECRET=your_super_secret_key_123
```
**AI Service (`ai-service/.env`):**
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
PORT=8000
```

### Step 2: Bootup Sequence

**Terminal 1 (Core Backend):**
```bash
cd backend
npm install
npm start
```

**Terminal 2 (AI Service):**
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Terminal 3 (Student Frontend):**
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

**Terminal 4 (Admin Frontend):**
```bash
cd admin-frontend
npm install
npm run dev -- --port 5174
# Running on http://localhost:5174
```

---

## 🔮 Future Scope & Roadmap

1. **Institutional Multi-Tenancy:** Expanding the database schema to handle `school_id`, allowing thousands of distinct schools to operate on one server footprint securely isolated.
2. **Automated Syllabus Ingestion:** Allowing Admins to upload a university's PDF syllabus, automatically converting it into the system's strict 5-layer B-Tree JSON structure using LLMs.
3. **Voice-to-Task Agents:** Enabling students to verbally log sessions ("I just studied Physics for 30 minutes") via mobile interfaces.
4. **WebRTC Integration:** Live video classrooms natively built into the dashboard for a zoom-less collaborative experience.

---

## 📽️ Presentation (PPT) Slide Extraction Guide

If you are creating a PowerPoint presentation for this project, copy these pre-structured slide outlines to ensure a high-impact technical pitch:

### Slide 1: Title Slide
* **Title:** Smart Study Tracker & Classroom Collaboration System
* **Subtitle:** An AI-powered academic operating system for tracking, collaboration, analytics, and intelligent learning.
* **Presenter:** Mohammed Ansari (Lead Full-Stack Developer & AI Architect)
* **Tech Stack Logos:** MERN Stack, Python, FastAPI, Hugging Face, Vite

### Slide 2: The Academic Problem
* **Fragmented Tools:** Students juggle multiple apps for notes, assignments, and Pomodoro timers.
* **Lack of Analytics:** Students cannot visualize long-term consistency or pinpoint exact weak topics.
* **Generic AI Answers:** Public AI models hallucinate because they do not know the student's *actual* official curriculum.
* **Zero Teacher Visibility:** Educators have no real-time dashboard to see which syllabus topics students are struggling with.

### Slide 3: The Engineered Solution
* **Unified Ecosystem:** One platform combining a Study Logger, Kanban Assignment Board, and Active Recall engine.
* **The 5-Layer Syllabus Core:** A strict, hierarchical database structure (Department → Subject → Chapter → Topic → Subtopic) that powers *everything*.
* **Live Dashboards:** Recharts-based Visual Heatmaps for Students (consistency) and Admins (system load).
* **Intelligence First:** An AI Assistant deeply rooted in personal performance and connected directly to uploaded academic PDFs.

### Slide 4: Key Features - Student & Classroom
* **Student Hub:** GitHub-style streak visualization, Focus/Burnout Radar, and Syllabus Mastery charts.
* **Active Engagement:** Integrated Pomodoro and AI-generated Flashcards.
* **Classroom Engine:** Secure teacher invite codes, PDF submissions, and live deadline urgency alerts.

### Slide 5: Key Features - AI Intelligence
* **Contextual Mentorship:** The AI ingests the student's last 6-months of test scores before answering any question.
* **Automated Test Generation:** The system forces the LLM to generate strict MCU/Descriptive tests mapped 1-to-1 with the syllabus database.
* **"Chat with Textbook":** Advanced Python RAG (Retrieval-Augmented Generation) allows students to converse directly with uploaded PDFs to prevent hallucinated answers.

### Slide 6: Modular Microservice Architecture
* *(Visual Recommendation: Draw a flow chart here)*
* **Frontend (React/Vite):** Twin SPAs (Admin + Student) for highly isolated security and tailored UX experiences.
* **Backend (Node.js/Express):** High-speed API orchestrator managing MongoDB and JWT Role-Based Access Control.
* **AI Service (FastAPI/Python):** Asynchronous python engine dedicated purely to LLM processing and PDF text extraction.

### Slide 7: Future Scope
* **Predictive Failure Detection:** Machine Learning to alert teachers if a student's trajectory suggests an upcoming failure.
* **Automated Syllabus Ingestion:** PDF-to-Syllabus automation using AI.
* **WebRTC Video Classrooms:** Native live lectures built directly into the student dashboard.

---

## 👨‍💻 Contributors & License

**Architect & Lead Developer:** [Mohammed Ansari](https://github.com/MohammedAnsari123)

This project is licensed under the **MIT License**.
You are free to use, modify, distribute, and build upon this educational software ecosystem for non-commercial and research purposes.

<p align="center">
  <br>
  <i>"Building the ultimate operating system for modern academic workflows."</i>
</p>
