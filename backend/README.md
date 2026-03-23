# ⚙️ Core API Backend

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

**The robust Node.js/Express orchestration engine for the Smart Study Tracker ecosystem.**

</div>

---

## 🚀 Overview
The Backend is the central nervous system of the platform, managing data persistence, security, and service orchestration. It coordinates between the SPAs and the AI microservice.

---

## ✨ Key Features

### 🔐 Multi-Role Authentication
- **Role Isolation**: Secure **[JWT](https://jwt.io/)** based access control for Admins and Students.

### 🧠 AI Context Aggregator
- **Academic Profiler**: Compiles a 6-month performance snapshot for refined AI mentorship.

### 🛡️ Secure Resource Architecture
- **Authenticated Proxy**: Securely serves teacher materials using custom middleware.

---

## 🛠️ Technical Stack
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Assets**: [Cloudinary](https://cloudinary.com/) (Optional) / Multer

---

## 📂 Folder Structure
```text
backend/
├── controllers/      # Business logic
├── models/           # Mongoose schemas
├── routes/           # Endpoint definitions
├── middleware/       # Auth guards
└── index.js          # Entry point
```

---

## ⚙️ Setup & Development
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run Server**:
   ```bash
   npm start
   ```
