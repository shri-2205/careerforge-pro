# ATS-Proof Resume Generator & Job Matcher

# 🚀 CareerForge Pro 

## 📌 About
CareerForge Pro is a full-stack AI-powered resume builder that helps job seekers optimize their resumes for ATS (Applicant Tracking Systems). Upload your resume, paste a job description, and let AI rewrite it for maximum compatibility.

## ✨ Features
- 🤖 **AI Resume Optimization** — Groq AI (Llama 3.3 70B) rewrites resume bullets
- 📊 **ATS Score Analyzer** — Real compatibility score with keyword breakdown
- ✉️ **Cover Letter Generator** — AI-powered personalized cover letters (Pro)
- 🎯 **Interview Prep** — AI-generated questions tailored to resume & JD
- 📄 **4 Resume Templates** — Modern, Classic, Minimal, Executive
- 💎 **Free/Pro Plans** — Subscription model with plan-based access
- 🌙 **Dark/Light Theme** — Toggle between themes
- 📥 **PDF Export** — Download optimized resume as PDF
- 🔐 **JWT Authentication** — Secure login/register

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Bootstrap 5 |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| AI | Groq API (Llama 3.3 70B) |
| Auth | JWT |
| PDF | jsPDF + html2canvas |
| UI | Dark/Light Glassmorphism |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Groq API key 

### Installation

**Backend:**
```bash
cd backend
cp .env.example .env
# Add your keys to .env
npm install
node server.js
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:3000
NODE_TLS_REJECT_UNAUTHORIZED=0
```

## 📱 Pages
| Page | Description |
|------|-------------|
| Landing | Product intro with animated background |
| Login/Register | JWT authentication |
| Dashboard | Resume history & stats |
| Resume Builder | Upload → AI Optimize → Download |
| Templates | 4 resume designs |
| Cover Letter | AI generator (Pro) |
| Interview Prep | AI questions generator |
| Pricing | Free/Pro subscription plans |
| Profile | User settings |

## 🔑 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| PUT | `/api/auth/upgrade` | Upgrade to Pro |
| POST | `/api/resume/upload` | Upload PDF resume |
| POST | `/api/analysis/optimize/:id` | AI optimize resume |
| POST | `/api/ai/cover-letter` | Generate cover letter |
| POST | `/api/ai/interview-questions` | Generate questions |



---
⭐ Star this repo if you found it helpful!

