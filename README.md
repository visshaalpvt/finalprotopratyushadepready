# 🎓 Inclusive Classroom AI

An AI-powered inclusive classroom platform designed for accessible, real-time learning. Features live captioning, tribal dialect translation, Indian Sign Language recognition, AI lecture summaries, Braille PDF generation, and gamified student engagement.

## ✨ Features

- **🎙️ Live Speech-to-Text** — Real-time transcription using Web Speech API
- **🌐 Tribal Dialect Translation** — Multi-dialect support (Santhali, Gondi, Tamil) via Ollama
- **🖐️ Indian Sign Language (ISL)** — MediaPipe-powered gesture recognition
- **🤖 AI Lecture Assistant** — Llama3-powered summarization, simplification, and Q&A
- **📄 Braille PDF Generator** — Export transcripts/summaries as Braille-encoded PDFs
- **🎥 Live Video Classroom** — WebRTC video conferencing with waiting room
- **🎮 Gamification** — XP system and engagement tracking

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS, Socket.io-client |
| Backend | Node.js, Express, Socket.io |
| AI | Ollama (Llama3), MediaPipe Hands, Web Speech API |
| Video | Native WebRTC (P2P) |

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
# Install all dependencies
npm run install:all

# Run both servers concurrently
npm run dev
```

- **Frontend** → http://localhost:5173
- **Backend** → http://localhost:3001

## ☁️ Deployment

### Frontend → Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import the repo, set **Root Directory** to `frontend`
4. Framework Preset: **Vite**
5. Add Environment Variable:
   - `VITE_BACKEND_URL` = `https://your-render-backend.onrender.com`
6. Deploy

### Backend → Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect the repo, set **Root Directory** to `backend`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Add Environment Variables:
   - `FRONTEND_URL` = `https://your-vercel-frontend.vercel.app`
   - `NODE_ENV` = `production`
6. Deploy

> **Important:** After both are deployed, update the env vars to point to each other's live URLs.

## 📁 Project Structure

```
visshaal/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # All UI components
│   │   ├── hooks/          # Custom hooks (useWebRTC)
│   │   ├── utils/          # Utilities
│   │   ├── App.jsx         # Root component with routing
│   │   └── index.css       # Global styles
│   ├── vercel.json         # Vercel deployment config
│   └── package.json
├── backend/                # Node.js + Express backend
│   ├── server.js           # Main server (Express + Socket.io)
│   ├── aiService.js        # Ollama AI integration
│   ├── sessionController.js # Session management
│   ├── translationController.js # Translation API
│   ├── render.yaml         # Render deployment config
│   └── package.json
└── package.json            # Root workspace scripts
```

## 📜 License

MIT
