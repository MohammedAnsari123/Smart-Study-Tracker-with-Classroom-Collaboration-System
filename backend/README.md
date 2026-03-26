<br/>
<div align="center">
  <img src="https://img.icons8.com/fluency/256/000000/server.png" alt="Logo" width="100">

  <h1 align="center">Core Node.js API Backend</h1>

  <p align="center">
    <strong>The robust Express orchestration engine for the Smart Study Tracker ecosystem.</strong>
    <br />
    <br />
    <a href="#-executive-summary">Overview</a>
    ·
    <a href="#-core-modules">Modules</a>
    ·
    <a href="#-technical-stack">Tech Stack</a>
    ·
    <a href="#-setup--development">Setup</a>
  </p>
</div>

---

## 📑 Table of Contents
1. [Executive Summary](#-executive-summary)
2. [Data & Intelligence Pipelines](#-data--intelligence-pipelines)
3. [Core Capabilities](#-core-capabilities)
4. [Folder Structure](#-folder-structure)
5. [Technical Stack](#-technical-stack)
6. [Setup & Development](#-setup--development)

---

## 🚀 Executive Summary
The Backend is the central nervous system of the platform, managing data persistence, multi-role security, and service orchestration. It acts as the gatekeeper between the frontend SPAs and the database, while simultaneously acting as an intelligence aggregator—piping formatted historical contexts to the Python AI Microservice.

---

## ⚙️ Data & Intelligence Pipelines

### 🧠 The Context Aggregator
When a student requests an AI chat or generates an exam, the LLM needs to know *who* they are. This Node.js backend handles the aggregation:
- It queries the last 6 months of a student's `StudySessions`.
- It calculates their average `focusScore` and `testScore`.
- It identifies their most frequently studied (or avoided) `subtopics`.
- This JSON object is sent as a hidden system payload to the FastAPI service to inject realistic context into the LLM.

### 🛡️ Secure Resource Architecture
The backend handles sensitive PDF assignments and global library materials.
- **Authenticated Proxy**: Materials mapped to specific Departments are shielded behind custom middleware (`isStudent`, `isAdmin`). Only legally authenticated tokens can access or download specific resources, preventing URL-guessing data leaks.

---

## 🔥 Core Capabilities

### 1. 🔐 Multi-Role JWT Authentication
- **Role Isolation**: Strictly enforces boundary lines between `Admin`, `Teacher`, and `Student` accounts.
- **Stateless Tokens**: Employs industry-standard JSON Web Tokens (JWT) mapped to bcrypt-hashed passwords for scalable, session-less security across endpoints.

### 2. 🏫 Classroom Engine
- Generates secure alphanumeric invite codes for new institutional classrooms.
- Handles the relational mapping in MongoDB connecting thousands of students to specific teacher-owned Classroom objects.

### 3. 🤔 5-Layer Syllabus Mapping
- Serves the nested (Department → Subject → Chapter → Topic → Subtopic) curriculum JSON seamlessly to the frontend React components via accelerated Mongoose `$lookup` pipelines over complex data joins.

---

## 📂 Folder Structure
```text
backend/
├── controllers/      # Heavy business logic and pipeline execution
├── models/           # Mongoose object schemas (Users, Classrooms, Subjects)
├── routes/           # RESTful Endpoint mapping
├── middleware/       # Custom Auth guards (authMiddleware.js)
├── index.js          # Express server mounting and DB connection payload
└── .env              # Secrets and configuration definitions
```

---

## 🛠️ Technical Stack
- **JavaScript Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **API Framework**: [Express.js](https://expressjs.com/)
- **Database Architecture**: [MongoDB Atlas](https://www.mongodb.com/)
- **Object Modeling**: [Mongoose](https://mongoosejs.com/)
- **Security & Cryptography**: `bcryptjs`, `jsonwebtoken`, `cors`
- **File Parsing**: `multer`

---

## ⚙️ Setup & Development
Requires Node.js and a valid MongoDB URI string.

1. **Environment Setup**:
   ```bash
   cp .env.example .env
   # Ensure MONGO_URI and JWT_SECRET are correctly populated
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Launch the Development Server**:
   ```bash
   npm run dev
   # Or npm start for production
   ```
   *(The server runs natively on `http://localhost:5000`)*
