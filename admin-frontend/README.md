# 👨‍💼 Admin Management Console

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-222222?style=for-the-badge&logo=recharts&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

**A specialized React-based orchestration platform for curriculum management and system-wide academic analytics.**

</div>

---

## 🚀 Overview
The Admin Console is a premium, high-performance dashboard designed for institutional administrators to control the 5-layer curriculum, monitor student engagement, and manage educational resources. It has been recently overhauled with a focus on real-time data and a minimalist, red-signature aesthetic.

---

## ✨ Key Features

### 📊 Real-time Dashboard
- **Dynamic Analytics**: Visualizes enrollment trends and content distribution using **[Recharts](https://recharts.org/)**.
- **Live Polling**: Synchronizes with the backend every 30 seconds to provide up-to-the-minute platform health metrics.
- **Glassmorphic UI**: Premium cards showing Total Users, Classrooms, Subjects, and Active Today counts.

### 📚 Curriculum & Syllabus Control
- **5-Layer Management**: Interface to create and edit Subjects, Chapters, Topics, and Subtopics.
- **Academic Context**: Admins can add detailed descriptions to subtopics, which are directly used by the AI service to ground its responses and tests in reality.
- **Bulk Operations**: Streamlined workflows for managing department-specific syllabi.

---

## 🛠️ Technical Stack
- **Framework**: [React 18](https://react.dev/) (Vite)
- **Styling**: [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) with custom design tokens.
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

---

## 📂 Folder Structure
```text
src/
├── components/      # Shared UI elements (AdminLayout, Sidebar)
├── context/         # Admin Authentication State
├── pages/           # Module-specific views
│   ├── Dashboard.jsx            # Real-time Analytics
│   ├── CurriculumManagement.jsx # Syllabus Tree Editor
│   ├── StudyMaterials.jsx       # Resource Management
│   └── UsersManagement.jsx      # Student Directory
└── App.jsx          # Routing and Layout Entry
```

---

## ⚙️ Setup & Development
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run Dev Server**:
   ```bash
   npm run dev -- --port 5174
   ```
