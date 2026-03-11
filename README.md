# 🎮 AI Super Quest

A **gamified AI-powered learning platform** with a retro arcade theme. Learn programming topics through AI-generated explanations, YouTube videos, and interactive quizzes — all while earning XP, leveling up, and tracking your progress.

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)

---

## ✨ Features

- **AI-Powered Explanations** — Get beginner-friendly topic breakdowns powered by Claude AI (with rich fallbacks)
- **Interactive Quizzes** — AI-generated multiple-choice quizzes with detailed result reports
- **XP & Leveling System** — Earn XP for completing quizzes, level up from Rookie → Legend
- **Topic Dashboard** — Jump to any topic instantly, see recommended topics, daily challenges
- **YouTube Integration** — Curated video tutorials embedded alongside explanations
- **AI Chatbot** — Ask questions anytime with the floating AI tutor
- **Retro Pixel UI** — Full arcade-style theme with animations, scanlines, and pixel fonts
- **Progress Tracking** — Track completed topics, quiz scores, and learning streaks

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, Tailwind CSS, Framer Motion |
| **Backend** | Python, FastAPI, Uvicorn |
| **Database** | MongoDB (Atlas for production) |
| **AI** | Anthropic Claude API (with offline fallbacks) |
| **Auth** | JWT (python-jose) + bcrypt |

## 📁 Project Structure

```
├── frontend/               # React SPA
│   ├── src/
│   │   ├── pages/           # Landing, Login, Signup, Dashboard, Study, Learn, Interests
│   │   ├── components/      # Navbar, Chatbot, QuizPanel, ExplanationPanel, XPBar
│   │   ├── context/         # Theme context
│   │   └── utils/           # Sound effects
│   └── vite.config.js
├── backend/                 # FastAPI server
│   ├── app/
│   │   ├── main.py          # App entry + static file serving
│   │   ├── config.py        # Environment config
│   │   ├── database.py      # MongoDB connection
│   │   ├── routes/          # auth, ai, user endpoints
│   │   ├── services/        # AI service, auth utilities
│   │   └── models/          # Pydantic schemas
│   ├── static/              # Built frontend (production)
│   └── requirements.txt
├── build.sh                 # Production build script
└── render.yaml              # Render deployment config
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **MongoDB** (local or Atlas)

### 1. Clone the repo

```bash
git clone https://github.com/Vansh2802/AiQuest.git
cd AiQuest
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```env
MONGODB_URL=mongodb://localhost:27017/Ai-Super-quest
DATABASE_NAME=Ai-Super-quest
JWT_SECRET=your-secret-key-here
ANTHROPIC_API_KEY=sk-ant-...       # Optional — fallbacks work without it
```

Start the backend:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload
```

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000` with API proxy to `http://localhost:8003`.

## 🌐 Deployment (Render)

This project is configured for one-click deployment on [Render](https://render.com):

1. Push to GitHub
2. On Render: **New → Blueprint → Select this repo**
3. Set environment variables:
   - `MONGODB_URL` — Your MongoDB Atlas connection string
   - `ANTHROPIC_API_KEY` — Your Claude API key (optional)
4. Deploy — the `render.yaml` handles everything automatically

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Create account |
| `POST` | `/api/auth/login` | Login & get JWT |
| `GET` | `/api/user/profile` | Get user profile |
| `GET` | `/api/user/topics` | Get recommended topics |
| `POST` | `/api/user/submit-quiz` | Submit quiz & earn XP |
| `POST` | `/api/user/interests` | Update learning interests |
| `POST` | `/api/ai/explain` | AI topic explanation |
| `POST` | `/api/ai/quiz` | AI quiz generation |
| `POST` | `/api/ai/chat` | AI tutor chat |
| `GET` | `/api/health` | Health check |

## 🎮 How It Works

1. **Sign up** and pick your learning interests
2. **Dashboard** shows your XP, level, recommended topics, and daily challenges
3. **Study a topic** — get an AI explanation + YouTube video
4. **Take a quiz** — AI generates 5 questions, see a detailed result report
5. **Earn XP** — 10 XP per correct answer, level up through 4 tiers
6. **Track progress** — completed topics, scores, and streaks on your dashboard

## 📄 License

MIT

---

Built with ❤️ by [Vansh](https://github.com/Vansh2802)
