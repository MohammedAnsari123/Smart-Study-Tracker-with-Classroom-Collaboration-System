# Smart Study Tracker with Classroom Collaboration System

A mission-critical academic operating system that integrates classroom management, assignment tracking, AI-powered study analytics, a global curriculum system, and dynamic AI-generated testing into a unified premium platform.

---

## 📖 Table of Contents
* [Project Overview](#-project-overview)
* [Key Features](#-key-features)
* [Workflow Diagram](#-workflow-diagram)
* [Tech Stack & Technologies](#-tech-stack--technologies)
* [Database Design & ER Diagram](#-database-design--er-diagram)
* [API Endpoints](#-api-endpoints)
* [AI Intelligent Layer](#-ai-intelligent-layer)
* [Installation Guide](#-installation-guide)
* [Environment Variables](#-environment-variables)
* [Folder Structure](#-folder-structure)
* [Usage Guide](#-usage-guide)
* [Security & Performance](#-security--performance)
* [Future Improvements](#-future-improvements)
* [License](#-license)

---

## 🌟 Project Overview
The **Smart Study Tracker** bridges the gap between classroom administration and personal study habits. It provides a high-performance environment where students manage academic responsibilities and track learning progress through advanced AI insights and a standardized curriculum system.

**Core Objectives:**
- **5-Level Global Curriculum:** Deeply nested subjects, chapters, topics, and subtopics with detailed academic descriptions.
- **AI Academic Discovery:** Personalized assistant aware of the last 6 months of user study data and performance.
- **Classroom Collaboration:** Secure environments with real-time assignment and progress tracking.
- **AI-Generated Testing & Flashcards:** Strict syllabus-based material generation to prevent hallucinations.
- **Academic Assistant:** 24/7 AI Tutor with persistent history, PDF support, and full curriculum awareness.

---

## 🚀 Key Features

### 🎓 Global 5-Level Curriculum Management
- **5-Layer Architecture:** Standardized data structure: Department -> Subject -> Chapter -> Topic -> Subtopic.
- **Detailed Syllabus:** Subtopics include specialized descriptions/details used by the AI for precise material generation.
- **Auto-Filtering:** Students automatically see subjects relevant to their registered Department and Semester.
- **Admin Dashboard:** Bulk-import interface for standardized Computer Engineering curriculum (Sem 1-6).

### 📅 Smart Notifications & Classroom Collaboration
- **Deadline Alerts:** Targeted Red Alert Banner on the dashboard for unsubmitted assignments due within 48 hours.
- **Multi-User Kanban System:** Revolutionary Trello-style workflow where students track individual progress (To-Do, In-Progress, Done) independently.
- **Teacher Monitoring Hub:** Owners can view a "People" dashboard showing aggregated progress and detailed read-only views of any student's individual Kanban board.
- **Assignment System:** Teachers post tasks with deadlines; students upload PDF submissions with status tracking.
- **Grade Summary Dashboard:** Automated calculated grade summary using performance-based UI indicators.

### 📊 AI-Powered Analytics & Testing
- **AI Test Engine:** Generates multiple-choice or descriptive questions instantly based on specific curriculum topics.
- **Detailed Test Results:** Interactive results page breaking down performance and identifying specific knowledge gaps.
- **Weakness Detection:** AI identifies tough topics based on session data, test results, and flashcard performance.
- **Consistency Heatmap:** GitHub-style visualization of academic commitment over time.

### 🤖 AI Tutor 2.0 (Context-Aware)
- **Academic Profile Integration:** The AI Assistant is aware of your last 6 months of study sessions, quiz scores, and flashcard progress.
- **Full Curriculum Access:** Assistant answers are rooted in the official 5-level curriculum structure.
- **Persistent Chat History:** Seamlessly resume past conversations with a dedicated history sidebar.
- **Conversation Management:** Create, rename, and delete chat threads for organized learning.
- **PDF Context Support:** Upload academic PDFs to chat specifically about their contents.
- **Domain Restricted:** Locked to academic queries to ensure professional guidance.

### ⏱️ Productivity Tools
- **Gamified Pomodoro:** Customizable focus/break durations with visual progress tracking.
- **Flashcard System:** Integrated active recall modules with AI-powered generator using the global curriculum.
- **Study Tracker:** Granular logging of duration, focus score, and specific topics studied.

---

## 🔄 Workflow Diagram

```mermaid
graph TD
    A[User Auth / Dept Select] --> B[Dashboard]
    B --> C[Classroom Management]
    B --> D[Personal Study Tracker]
    B --> E[AI Academic Assistant]
    B --> F[Curriculum & Tests]
    
    C --> C1[Announcements]
    C --> C2[Assignments & Submissions]
    C --> C3[Multi-User Kanban Board]
    
    D --> D1[Pomodoro Timer]
    D --> D2[Flashcards]
    D --> D3[AI analytics]
    
    E --> E1[Persistent History]
    E --> E2[PDF Chat]
    
    F --> F1[AI Topic Tests]
    F --> F2[Test Results]
```

---

## 💻 Tech Stack & Technologies

### Frontend
- **React 18 & Vite:** High-speed SPA framework.
- **Tailwind CSS:** Modern utility-first styling with Glassmorphism.
- **Lucide React:** Premium iconography.
- **Recharts:** Interactive data visualisations.
- **React Markdown:** Renders AI responses with high-fidelity code highlighting.

### Backend
- **Node.js & Express:** Enterprise-grade server environment.
- **Mongoose:** Object Data Modeling (ODM) for MongoDB.
- **JWT & BcryptJS:** Secure authentication.
- **Multer & Cloudinary:** Centralized cloud storage for assignments and PDFs.

### AI Service
- **Python 3.10+ & FastAPI:** High-performance microservice for AI orchestration.
- **Hugging Face Hub:** Connects to DeepSeek-R1-Distill-Qwen/Llama models.

---

## 🗄️ Database Design & ER Diagram

```mermaid
erDiagram
    USER ||--o{ CLASSROOM_MEMBER : joins
    USER ||--o{ STUDY_SESSION : logs
    USER ||--o{ CHAT_CONVERSATION : has
    USER ||--o{ SUBMISSION : makes
    
    CLASSROOM ||--o{ ASSIGNMENT : posts
    ASSIGNMENT ||--o{ SUBMISSION : receives
    
    DEPARTMENT ||--o{ SUBJECT : categorizes
    SUBJECT ||--o{ TOPIC : contains
    TOPIC ||--o{ FLASHCARD : contains
```

### Major Collections:
- **Users:** Records identity, department, semester, and credentials.
- **Departments:** Dynamic storage of department codes and available semesters.
- **Subjects:** Global curriculum data with course codes and nested topics/subtopics.
- **ChatConversations:** Persistent AI interaction history per user.
- **Classrooms:** Class codes, metadata, and member management.

---

## 📡 API Endpoints

### 🔑 Authentication (`/api/auth`)
- `POST /register` - Includes department and semester selection.
- `PATCH /profile` - Update registered department/semester.

### 🏫 Curriculum (`/api/admin/subject` & `/departments`)
- `GET /departments` - Public route to fetch available departments.
- `GET /subject` - Auto-filters subjects by student's dept/semester.
- `POST /bulk-import` - (Admin) Import curriculum JSON data.

### 🤖 AI & Discovery (`/api/ai`)
- `GET /user-context` - Aggregates curriculum and 6-month user study profile for AI injection.
- `POST /test/generate` - Strict syllabus-based test generation.
- `POST /generate-flashcards` - Context-aware flashcard generation using curriculum details.
- `POST /chat` - Interactive AI tutoring with persistent history and PDF support.

---

## 🛠️ Installation & Seeding

1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Seed the curriculum data
   node data/seed.js
   npm run dev
   ```

2. **AI Service:**
   ```bash
   cd ai-service
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 🛡️ Security & Performance
- **Role Isolation:** Private routes prevent unauthorized access to Admin/Teacher zones.
- **Database Seeding:** Automated script imports standardized Computer Engineering curriculum (Sem 5 & 6) instantly.
- **Field Normalization:** Switched from ad-hoc naming to structured `subjectName`, `topicName`, and `courseCode` across the entire stack.

---

## 📄 License
This project is licensed under the academic **Education First License** for development and research.
