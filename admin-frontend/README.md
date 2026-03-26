<br/>
<div align="center">
  <img src="https://img.icons8.com/fluency/256/000000/administrator-male.png" alt="Logo" width="100">

  <h1 align="center">Admin Management Console</h1>

  <p align="center">
    <strong>A specialized React-based orchestration platform for curriculum management and system-wide academic analytics.</strong>
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
The Admin Console is a premium, high-performance dashboard designed for institutional administrators. Operating as an entirely separate Single Page Application (SPA) from the student portal, it guarantees strict security perimeters. It enables administrators to control the global 5-layer curriculum, monitor systemic engagement, manage educational resources, and police user activity across the entire ecosystem.

---

## 🎨 UI/UX Philosophy
The Admin console has been completely overhauled with a minimalist, red-signature aesthetic designed to feel like a high-end enterprise control center.
- **Glassmorphism:** Premium frosted-glass cards mapping live data.
- **Zero-Tailwind Approach:** Built using pure Vanilla CSS variables for ultimate, conflict-free theming capabilities.
- **Typography:** Uses `Plus Jakarta Sans` for headers and `Space Grotesk` for data metrics to ensure high scannability.

---

## 🔥 Core Modules

### 1. 📊 Real-Time Analytics Dashboard
- **Dynamic Polling**: Synchronizes with the Core Backend every 30 seconds to provide up-to-the-minute platform health metrics visually.
- **Recharts Integration**: Beautiful, animated SVG charts demonstrating User Enrollment Trends, Active Daily Traffic, and Syllabus Content distribution.
- **KPI Metrics**: Instant numerical readouts for Total Users, Subjects, Classrooms, and Active Today metrics.

### 2. 📚 5-Layer Curriculum Engine
- **Hierarchical Control**: A deep, nested editor allowing Admins to manipulate Departments → Subjects → Chapters → Topics → Subtopics seamlessly.
- **AI Context Injection**: Admins attach specific textual contexts mapped directly to subtopics. The Python AI Microservice uses these exact context payloads to format test generation and anchor chat responses safely against hallucinations.

### 3. 👥 System & User Management
- **Role Enforcement**: Interactive ledgers mapping out every registered user, allowing for instant Role adjustments (Student/Teacher/Admin), soft-bans, and data oversight.
- **Tenant Management**: Expandable architecture allowing the system to view segregated institutional data across distinct departments.

### 4. 🗄️ Resource & Library Hub
- **Database Curation**: Admins upload global study resources securely.
- **Department Tagging**: Materials are immediately tagged to specific tags (e.g., "Computer Engineering - Semester 5") ensuring resources auto-distribute exclusively to the correct student dashboard.

---

## 🧱 Component Architecture
```text
src/
├── components/          # Reusable Pure Components
│   ├── AdminLayout.jsx  # Frame logic (Sidebar + Canvas)
│   ├── Sidebar.jsx      # Icon-driven navigation matrix
│   └── TopBar.jsx       # Header with user controls
├── context/             # Global Application State
│   └── AdminAuth.jsx    # Hardened admin-only JWT interceptors
├── pages/               # Functional Module Views
│   ├── Dashboard.jsx    
│   ├── CurriculumManagement.jsx 
│   ├── StudyMaterials.jsx       
│   └── UsersManagement.jsx      
└── App.jsx              # Secured SPA Routing
```

---

## 🛠️ Technical Stack
- **Framework**: [React 18](https://react.dev/) (Vite Build Tools)
- **Styling**: Vanilla CSS3 + Advanced Custom Parameters
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Network**: [Axios](https://axios-http.com/) with automated 401 interceptors.

---

## ⚙️ Setup & Development
The Admin Console operates concurrently with the backend API. Ensure the Node backend is active on PORT 5000.

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Launch the Development Server**:
   ```bash
   # We use port 5174 specifically to avoid colliding with the Student SPA
   npm run dev -- --port 5174
   ```
