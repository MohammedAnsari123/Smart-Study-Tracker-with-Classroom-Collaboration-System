# 🤖 AI Intelligence Microservice

<div align="center">

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![HuggingFace](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)
![Uvicorn](https://img.shields.io/badge/Uvicorn-222222?style=for-the-badge&logo=uvicorn&logoColor=white)

**High-performance Python microservice for LLM orchestration, PDF processing, and academic material generation.**

</div>

---

## 🚀 Overview
The AI-Service is the "brain" of the platform. Built with **[FastAPI](https://fastapi.tiangolo.com/)**, it orchestrates complex intelligence tasks such as syllabus-grounded test generation, PDF text extraction, and personalized mentorship chat.

---

## ✨ Key Capabilities

### 🧠 Personalized Mentorship (Context-Aware Chat)
- **Academic Profile Integration**: Processes a 6-month performance snapshot to provide evidence-based study advice.
- **Persistent Memory**: Handles multi-turn conversations with history tracking.

### 📄 Intelligent PDF Processing
- **RAG-Ready Extraction**: Extracts clean text from academic PDFs for the "Chat with PDF" feature.

### 📝 Automated Test Generation
- **Hallucination Prevention**: Uses a strict 5-layer curriculum injection system based on [Qwen 2.5](https://qwenlm.github.io/blog/qwen2.5/) or [DeepSeek](https://huggingface.co/deepseek-ai).

---

## 🛠️ Technical Stack
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **LLM Connectivity**: [Groq](https://groq.com/) / [HuggingFace](https://huggingface.co/)
- **NLP Libraries**: [Transformers](https://huggingface.co/docs/transformers/index)
- **Server**: [Uvicorn](https://www.uvicorn.org/)

---

## 📂 Folder Structure
```text
ai-service/
├── routes/           # FastAPI router endpoints
├── services/         # Core LLM prompt logic
├── utils/            # PDF and formatting helpers
├── main.py           # Entry point
└── requirements.txt  # Project dependencies
```

---

## ⚙️ Setup & Development
1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
2. **Run Service**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
