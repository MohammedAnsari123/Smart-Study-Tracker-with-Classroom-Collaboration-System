# 🎓 Student Study Portal

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-F03E3E?style=for-the-badge&logo=lucide&logoColor=white)

**A high-performance React-based learning environment for study tracking, AI mentorship, and classroom collaboration.**

</div>

---

## 🚀 Overview
The Student Frontend is the primary interface for learners, integrating a personal study tracker with real-time classroom features and a sophisticated AI Personal Mentor.

---

## ✨ Key Features

### 📅 AI Study Assistant & Personal Mentor
- **Context-Aware**: Mentorship based on 6 months of historical performance.
- **Syllabus Tests**: AI-generated exams using **[FastAPI](https://fastapi.tiangolo.com/)**.

### 🏫 Classroom & Collaboration
- **Smart Kanban**: Independent student progress tracking with teacher visibility.

### 📊 Personal Analytics
- **Consistency Heatmap**: GitHub-style streak visualization using **[Recharts](https://recharts.org/)**.

---

## 🛠️ Technical Stack
- **Framework**: [React 18](https://react.dev/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Analytics**: [Recharts](https://recharts.org/)

---

## 📂 Folder Structure
```text
src/
├── components/      # UI elements (Kanban, Pomodoro, AI Chat)
├── context/         # Auth states
├── pages/           # Dashboard, Classroom, Chatbot
└── App.jsx          # Entry
```

---

## ⚙️ Setup & Development
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run Dev Server**:
   ```bash
   npm run dev
   ```
