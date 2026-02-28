# Smart Study Tracker with Classroom Collaboration System

A full-stack web application that integrates classroom management, assignment tracking, study analytics, and a domain-specific academic chatbot into a unified productivity platform.

---

## 📖 Table of Contents
* [Project Overview](#-project-overview)
* [Features](#-features)
* [System Architecture](#-system-architecture)
* [Tech Stack](#-tech-stack)
* [Database Design](#-database-design)
* [API Endpoints](#-api-endpoints)
* [Domain-Specific Chatbot](#-domain-specific-chatbot)
* [Installation Guide](#-installation-guide)
* [Environment Variables](#-environment-variables)
* [Folder Structure](#-folder-structure)
* [Usage Guide](#-usage-guide)
* [Security Measures](#-security-measures)
* [Performance Considerations](#-performance-considerations)
* [Future Improvements](#-future-improvements)
* [License](#-license)

---

## 🌟 Project Overview
The **Smart Study Tracker** is designed to bridge the gap between classroom administration and personal study habits. It provides a structured environment where students can manage their academic responsibilities and track their learning progress in one place.

**Key Objectives:**
- Create and join classrooms using unique, secure class codes.
- Manage assignments and subtopics with automated deadline tracking.
- Log personal study sessions and visualize performance via analytics.
- Provide 24/7 academic assistance through an integrated, domain-specific AI chatbot.

---

## 🚀 Features

### Core Features
- **Secure Authentication:** Implementation of JWT-based login and registration with password hashing.
- **Classroom Management:** Create classrooms, join via codes, and manage members.
- **Assignment System:** Upload assignments, handle PDF submissions, and detect late entries.
- **Announcement Portal:** Real-time information sharing within classrooms.
- **Study Tracker:** Personal session logging with duration and topic tracking.
- **Analytics Dashboard:** Graphical representation of study habits and classroom performance.

### Chatbot Features
- **Academic Domain Specialist:** Specifically restricted to study-related queries to ensure accuracy.
- **Context-Aware:** Remembers the immediate conversation history for relevant follow-up help.
- **NLP Powered:** Uses state-of-the-art Large Language Models (DeepSeek/Qwen) for natural responses.
- **Response Formatting:** Renders answers in Markdown (lists, bold text, code blocks) for better readability.

---

## 🏗️ System Architecture

### High-Level Flow
1. **Client Interface:** Built with React, communicating via RESTful APIs.
2. **Backend Engine:** Node.js/Express handles business logic and classroom state.
3. **AI Microservice:** A dedicated FastAPI service manages LLM interactions and prompt engineering.
4. **Data Persistence:** MongoDB for structured data; Cloudinary/Local for file storage.

**Data Flow:**
- `Client` → `REST API` → `Database` → `File Storage`
- `Client` → `FastAPI Chatbot` → `Hugging Face Router` → `AI Response`

---

## 💻 Tech Stack

- **Frontend:** React, Axios, Tailwind CSS, Lucide React, Recharts.
- **Backend:** Node.js, Express.js, Multer (File Uploads), JWT.
- **AI Service:** Python, FastAPI, Requests, Hugging Face Inference API (OpenAI Compatible).
- **Database:** MongoDB, Mongoose ORM.
- **Models:** DeepSeek-R1-Distill-Qwen (Primary), DeepSeek-R1-Distill-Llama (Fallback).

---

## 🗄️ Database Design

### Major Collections
- **Users:** Stores profiles, hashed passwords, and roles.
- **Classrooms:** Metadata for classes, including the unique `classCode`.
- **ClassMembers:** Mapping of users to classrooms (Student/Teacher roles).
- **Assignments:** Task details, deadlines, and linked classroom IDs.
- **Submissions:** Student files, timestamps, and grading status.
- **StudySessions:** Logs of individual study time and topics.
- **Announcements:** Broadcast messages for specific classrooms.

### Relationships
- **One User → Many Classes** (via ClassMembers)
- **One Class → Many Assignments**
- **One Assignment → Many Submissions**

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account.
- `POST /api/auth/login` - Authenticate and receive JWT.

### Classroom
- `POST /api/class/create` - Initialize a new classroom.
- `POST /api/class/join` - Join via `classCode`.
- `GET /api/class/:id` - Fetch classroom specific details.

### Assignment
- `POST /api/assignment/create` - Upload new task (Admin/Teacher).
- `GET /api/assignment/class/:classId` - List all assignments for a class.

### Submission
- `POST /api/submission/upload` - Submit PDF files for an assignment.

### Study Tracker
- `POST /api/study/log` - Save a study session record.
- `GET /api/study/analytics` - Retrieve data for charts.

### Chatbot (FastAPI)
- `POST /api/chat` - Query the academic assistant.

---

## 🤖 Domain-Specific Chatbot Section

**Purpose:**
The Smart Study Assistant provides instantaneous help for academic concepts, classroom policies, and study strategies. Unlike general-purpose AI, it is strictly bounded to the academic domain to prevent hallucinations and off-topic conversations.

**Implementation Details:**
- **Prompt Engineering:** Strict system instructions enforce an "Information Only" policy.
- **Dual-Model Fallback:** Uses a primary and secondary model to ensure 100% uptime even during server overloads.
- **Context Management:** Optimized memory handling keeps the conversation relevant without overflowing token limits.

**Limitations:**
- Trained for academic assistance only.
- Does not engage in political, social, or casual chit-chat.

---

## 🛠️ Installation Guide

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)
- **MongoDB** (Local or Atlas)
- **Hugging Face API Token** (For Chatbot)

### Steps
1. **Clone the Repo:**
   ```bash
   git clone <repository-url>
   cd "Smart Study Tracker"
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   npm start
   ```

3. **AI Service Setup:**
   ```bash
   cd ai-service
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

4. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url
```

### AI Service (.env)
```env
HF_API_TOKEN=your_hugging_face_token
```

---

## 📁 Folder Structure

- **/backend:** Node.js/Express server logic.
  - `/controllers`: Request handlers.
  - `/models`: Mongoose schemas.
  - `/routes`: API endpoint definitions.
- **/frontend:** React/Vite application.
  - `/src/pages`: Main view components.
  - `/src/components`: Reusable UI elements.
  - `/src/context`: Auth and Global state.
- **/ai-service:** Python/FastAPI microservice.
  - `/services`: LLM integration logic.
- **/uploads:** Local storage for temporary file processing.

---

## 📖 Usage Guide
1. **Register:** Create your student or teacher account.
2. **Classrooms:** Create a new subject class or join one using a friend's code.
3. **Assignments:** Check the dashboard for upcoming tasks and upload your work in PDF format.
4. **Study:** Use the "Tracker" to log your hours and view your productivity charts.
5. **AI Assistant:** Ask the chatbot for explanations of difficult topics or help with formatting.

---

## 🛡️ Security & Performance

- **Security:** Bcrypt hashing, JWT authorization headers, and Input sanitization.
- **Performance:** Indexed MongoDB queries for fast data retrieval and optimized React rendering with glassmorphism effects.
- **File Safety:** Restricted file uploads to PDF only with size limits.

---

## 🔮 Future Improvements
- Real-time WebSockets for group chat/notifications.
- Plagiarism detection for PDF submissions.
- Mobile application for on-the-go tracking.

---

## 📄 License
This project is licensed under the **Academic Use Only** license for educational purposes.
