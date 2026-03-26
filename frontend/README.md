<br/>
<div align="center">
  <img src="https://img.icons8.com/fluency/256/000000/student-center.png" alt="Logo" width="100">

  <h1 align="center">Student Study Portal</h1>

  <p align="center">
    <strong>A high-performance React learning environment for study tracking, AI mentorship, and classroom collaboration.</strong>
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
2. [UI/UX Philosophy](#-uiux-philosophy)
3. [Core Modules](#-core-modules)
4. [Component Architecture](#-component-architecture)
5. [Technical Stack](#-technical-stack)
6. [Setup & Development](#-setup--development)

---

## 🚀 Executive Summary
The Student Frontend represents the primary user interface for learners. It integrates personal productivity tools—like study timers and active-recall flashcards—with real-time institutional classroom features and a highly sophisticated generative AI Personal Mentor.

---

## 🎨 UI/UX Philosophy
Designed to maximize focus and minimize cognitive load.
- **Glassmorphic Panes & Blur UI:** Deep, frosted aesthetics to make academic tracking feel like a premium, modern software experience rather than a sterile learning portal.
- **Micro-interactions:** Extensive use of smooth transitions, hover-states, and animated chat typing effects.
- **Responsive Architecture:** Fully scalable grids utilizing Tailwind CSS, ensuring pixel-perfect operation across desktops, tablets, and mobile phones.

---

## 🔥 Core Modules

### 1. 📅 Personal Dashboard & Analytics
- **Consistency Heatmap**: A GitHub-inspired contribution graph dynamically colored based on daily focus scores and time invested.
- **Radar Charts**: Advanced Recharts SVGs plotting performance visually across various subjects.

### 2. 🧠 AI Study Assistant & Personal Mentor
- **Character-by-character Streaming UI**: Extremely natural, ChatGPT-like interface delivering markdown-styled advice organically.
- **Context-Aware Interactions**: The system invisibly feeds the chat with your specific historical failures to guarantee highly personalized remediation.

### 3. 🏫 Classroom Collaboration & Kanban
- **Smart Progress Tracking**: Students manage their assignments via a Drag-and-Drop Kanban Board.
- **Deadlines & Uploads**: PDF submission gateways mapping to teacher modules.

### 4. 📚 Digital Library (Department Scoped)
- **Automatic Resource Curation**: Admins upload global study materials; the Student portal automatically filters them out based on the student's logged `Department` and `Semester`.
- **Integrated PDF Viewing**: Secure, zero-download preview modals to prevent unauthorized syllabus extraction.

---

## 🧱 Component Architecture
```text
src/
├── components/          # Reusable Pure Components
│   ├── TopBar.jsx       # Responsive Navigation Frame
│   ├── StudySession.jsx # Pomodoro Logic and DB saving
│   ├── Kanban.jsx       # Real-time task drag algorithms
│   └── PDFPreviewModal  # Secure document viewing
├── context/             # React Global Provider Wrappers
│   └── AuthContext.jsx  # JWT state management
├── pages/               # High-level Routes
│   ├── Dashboard.jsx    
│   ├── ChatbotView.jsx 
│   ├── Classrooms.jsx       
│   └── StudyMaterials.jsx      
└── App.jsx              # Protected Routes mounting
```

---

## 🛠️ Technical Stack
- **Framework**: [React 18](https://react.dev/) (Vite Build Tools)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown Handling**: `react-markdown` and `remark-gfm`
- **Network**: [Axios](https://axios-http.com/) with integrated Token handling.

---

## ⚙️ Setup & Development
The Student Portal operations require the backend Node.js API to be active on PORT 5000.

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Launch the Development Server**:
   ```bash
   # Uses the default Vite port 5173
   npm run dev
   ```
