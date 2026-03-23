# 🎓 Smart Study Tracker with Classroom Collaboration System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-V18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

**AI-powered academic operating system for tracking, collaboration, analytics, and intelligent learning.**

</div>

---

## 2. 📌 Problem Statement
Students face significant friction in maintaining academic consistency due to fragmented tools:
* **Inconsistent Tracking:** Students struggle to log and visualize study patterns over long periods.
* **Fragmented Ecosystems:** No single platform bridges personal study notes with official classroom assignments.
* **Lack of Data-Driven Insights:** Students don't know *where* they are failing or *how* to optimize their study time.
* **Zero Admin/Teacher Visibility:** Educators lack real-time data on student engagement and syllabus coverage.

---

## 3. 💡 Solution Overview
This system is an all-in-one **LMS + Productivity + AI Mentor** platform:
* **Unified Academic Hub:** One interface for study sessions, tasks, and classroom collaboration.
* **Intelligence-First Design:** An AI Assistant deeply rooted in your personal performance and the official curriculum.
* **Real-time Analytics:** Advanced Recharts-driven dashboards for both students (Personal) and Admins (System-wide).
* **Ground-Truth Curriculum:** A standardized 5-layer syllabus that powers everything from testing to AI responses.

---

## 4. 🧠 Key Features

### 👨‍🎓 Student Features
* **Study Session Tracking:** Log durations, focus scores, and specific subtopics with a GitHub-style consistency heatmap.
* **Academic Kanban:** Personal Trello-style board for tracking assignments and tasks independently.
* **AI Personal Mentor:** A context-aware chatbot that knows your last 6 months of test scores and study habits.
* **Intelligent Testing:** Generate MCQ/Descriptive tests instantly based on any syllabus topic.
* **Active Recall:** AI-generated flashcards and Pomodoro timers with gamified focus tracking.

### 🏫 Classroom Features
* **Collaborative Hubs:** Create or join classrooms using secure invite codes.
* **Assignment Management:** PDF submission portal with real-time status tracking and grade summaries.
* **Resource Sharing:** Teacher-curated study materials accessible via an authenticated PDF proxy.
* **Peer/Teacher Visibility:** Teachers can monitor student Kanban boards for proactive intervention.

### 🤖 AI Features (The Differentiator)
* **Context-Injection Engine:** The AI is pre-loaded with the user's academic performance profile for evidence-based advice.
* **Syllabus-Grounded Testing:** Prevents hallucinations by forcing the AI to generate questions using the 5-layer database curriculum.
* **PDF-to-Conversations:** Chat directly with uploaded textbooks and notes using Python-based NLP extraction.
* **Models:** Powered by local or inference-based LLMs (Qwen2.5 / DeepSeek-R1 via Groq/OpenRouter).

### 👨‍💼 Admin Features
* **Real-time Stats Dashboard:** Live interactive graphs for enrollment trends and content distribution.
* **Curriculum Control:** Bulk import and manage the global 5-layer syllabus tree.
* **System Monitoring:** High-level visibility into user activity and classroom health.

---

## 5. 🏗️ System Architecture
The system follows a modern, decoupled microservices-oriented architecture:

* **Frontend ([React.js](https://react.dev/)):** Twin SPAs (Admin & Student) providing premium, responsive user experiences.
* **Backend ([Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)):** Core business logic, JWT authentication, and MongoDB orchestration.
* **AI Microservice ([FastAPI](https://fastapi.tiangolo.com/)):** Python-based service handling LLM orchestration, PDF processing, and test generation.
* **Database ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas)):** Multi-collection schema optimized for nested curriculum and study log tracking.

**Data Flow:**
1. **Frontend** requests data via axios with JWT.
2. **Backend** authenticates and fetches core data from **MongoDB**.
3. For intelligence tasks, Backend calls the **AI Microservice**.
4. **AI Microservice** applies RAG (Curriculum/PDF) and returns structured JSON to the UI.

---

## 6. 🔄 Workflow
1. **Onboarding:** User registers, selects their Department/Semester, and gains access to the relevant global syllabus.
2. **Collaboration:** User joins a Classroom code to see assignments, announcements, and teacher resources.
3. **Engagement:** User logs study sessions, completes Pomodoro blocks, and manages their personal Kanban.
4. **Assessment:** User takes an AI-generated topic test. The system scores and identifies knowledge gaps.
5. **Analytics:** The System aggregates this data into a visual Heatmap and Progress dashboard.
6. **Intelligence:** The AI Assistant analyzes the last 15-30 days of data to provide personalized study tips.
7. **Refinement:** Dashboard insights guide the user to focus on identified "Weakness Topics."

---

## 7. 📊 Database Design
Built on [MongoDB](https://www.mongodb.com/) for flexibility and depth.

* **Users:** Credentials, Role (Student/Admin/Teacher), Dept, Semester.
* **Curriculum (Subjects):** 5-Level nesting (Dept -> Subject -> Chapter -> Topic -> Subtopic).
* **Classrooms:** ClassMetadata, Owners, and Member lists.
* **StudySessions:** Duration, Focus Score, Subtopic ref, and Test Results.
* **Kanban/Assignments:** Status tracking, Submissions (Cloudinary URLs), and Deadlines.

**Relationships:**
* **One-to-Many:** User → StudySessions, Classroom → Assignments.
* **Many-to-Many:** Students ↔ Classrooms (via ClassMember join table logic).

---

## 8. 🤖 AI/ML Modules
Our AI layer moves beyond "generic GPT" into specific academic functions:

* **Inference Platform:** [FastAPI](https://fastapi.tiangolo.com/) microservice connecting to High-Performance LLMs ([Qwen2.5](https://qwenlm.github.io/blog/qwen2.5/)).
* **Context Aggregator:** Custom Node.js logic that compiles a 6-month performance snapshot for AI injection.
* **NLP Pipeline:** `pdf-parse` (JS) and Python [Transformers](https://huggingface.co/docs/transformers/index) for document understanding.
* **Test Generator:** Rule-based prompt engineering ensures 100% syllabus alignment.

---

## 9. 🛠️ Tech Stack

### Frontend
- [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
- [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
- [![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

### Backend
- [![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
- [![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
- [![JSON Web Tokens](https://img.shields.io/badge/JWT-000000?style=flat&logo=json-web-tokens&logoColor=white)](https://jwt.io/)

### AI / ML
- [![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
- [![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
- [![Hugging Face](https://img.shields.io/badge/Hugging_Face-FFD21E?style=flat&logo=hugging-face&logoColor=black)](https://huggingface.co/)

### Databases
- [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

---

## 10. 📸 Screenshots / UI Section
*(Replace with your actual hosted image links)*
* **Dashboard:** [Real-time Progress & Heatmap](https://via.placeholder.com/800x450?text=Dashboard)
* **Classroom:** [Collaborative Kanban & Assignments](https://via.placeholder.com/800x450?text=Classroom)
* **Admin Console:** [Live System Stats & Syllabus Control](https://via.placeholder.com/800x450?text=Admin+Console)
* **AI Tutor:** [Persistent Chat with Academic Profile](https://via.placeholder.com/800x450?text=AI+Tutor)

---

## 11. ⚙️ Installation & Setup

### 1. Backend (API)
```bash
cd backend
npm install
cp .env.example .env # Add MONGO_URI and JWT_SECRET
npm start
```

### 2. AI Service (Python)
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Student Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Admin Frontend
```bash
cd admin-frontend
npm install
npm run dev -- --port 5174
```

---

## 12. 🔐 Environment Variables
Must be configured in `.env` files for production.
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for authentication.
- `GROQ_API_KEY`: For high-speed LLM inference.
- `CLOUDINARY_URL`: For assignment/image storage.

---

## 13. 📈 Future Scope
* **Predictive Failure Detection:** Machine learning to alert teachers if a student's trajectory suggests they will fail an upcoming exam.
* **Automated Syllabus Import:** Voice-to-curriculum or PDF-to-syllabus automation.
* **Institutional Multi-Tenancy:** Support for multiple colleges within one system.
* **Real-time Attendance:** Geofencing/QR-based classroom attendance.

---

## 14. ⚠️ Challenges Faced
* **AI Latency:** Optimizing prompt delivery and switching to Groq/FastAPI reduced response times from 12s to <2s.
* **Data Mapping:** Normalizing the 5-layer curriculum across the entire stack required significant Refactoring.
* **Secure PDF Serving:** Implemented an authenticated proxy to ensure only authorized students can view teacher materials.

---

## 15. 🧪 Testing
* **API Testing:** Coverage of all 40+ endpoints using Postman.
* **Load Handling:** Verified and optimized MongoDB indexes for large curriculum queries.
* **UI/UX:** Evaluated and fixed DOM nesting errors and hydration issues for a cleaner browser console.

---

## 16. 📂 Project Structure
```text
├── admin-frontend   # Vite + React (Management Console)
├── ai-service       # Python FastAPI (Intelligence Microservice)
├── backend          # Node.js + Express (API Core)
├── frontend         # Vite + React (Student Platform)
└── documentation    # Schemas and Design Docs
```

---

## 17. 📜 License
Licensed under the **MIT License**. Use freely for academic and research purposes.

---

## 18. 👨‍💻 Contributors
- **Mohammed Ansari** - *Lead Full-Stack Developer & AI Architect*

---

## 19. 📬 Contact
- **GitHub:** [MohammedAnsari123](https://github.com/MohammedAnsari123)
- **LinkedIn:** [ansari-mohammed](https://linkedin.com/in/yourprofile)
- **Email:** your.email@example.com
