# 🇮🇳 Bharat Voter Companion

> An interactive, AI-powered education platform for understanding the Indian Election System — built for every citizen.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Cloud%20Run-4285F4?style=for-the-badge&logo=google-cloud)](https://election-assistant-196668194326.asia-south1.run.app)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5%20Flash-8E44AD?style=for-the-badge&logo=google)](https://ai.google.dev)

---

## 🌟 Overview

**Bharat Voter Companion** is a full-stack web application designed to educate Indian citizens about the election process in an engaging and interactive way. Powered by **Google Gemini AI**, the platform adapts its content to the user's knowledge level — making civic education accessible to everyone from first-time voters to political enthusiasts.

The app uses a rich, glassmorphism-inspired UI with the colors of the Indian tricolor (Saffron, White, and Green), offering a premium and patriotic experience.

---

## ✨ Features

### 🤖 AI-Powered Assistant
- Conversational chatbot powered by **Gemini 2.5 Flash**
- Adapts responses to the user's knowledge level (Beginner / Intermediate / Advanced)
- Renders structured, interactive UI components directly in the chat:
  - **📝 Quizzes** — Test your knowledge with adaptive MCQs
  - **🃏 Flashcards** — Flip-card format for quick revision
  - **📅 Timelines** — Step-by-step visual breakdowns of election processes
  - **💡 Explanations** — Clear, concise answers with follow-up suggestions

### 🛡️ Secure & Accessible
- **🔒 Security First** — Implemented **Helmet.js** for secure HTTP headers, **express-rate-limit** for DDoS protection, and a strict **Content Security Policy (CSP)**.
- **🛡️ Bot & Threat Protection** — Features **Google reCAPTCHA v2** to prevent bot spam and the **Google Cloud Web Risk API** to scan and block malicious user-submitted URLs.
- **♿ ARIA Compliance & Audio** — Full screen reader support, ARIA landmarks, and native **Web Speech API** for zero-config, lightning-fast audio responses.
- **⏱️ Real-Time Context** — Integrated a **Live Clock and Date** display directly in the navigation bar.
- **🧪 Automated Testing** — Integrated **Node.js Test Runner** and **Supertest** for high-confidence API reliability.
- **📊 Observability** — Centralized logging with **Winston** and seamless **Google Cloud Logging** integration.
- **🌐 Cloud AI Services** — Features **Gemini 2.5 Flash Lite** and **Google Cloud Translation API** for high-speed, multi-language support (Hindi, etc.).

### 🗺️ Polling Booth Locator
- **Auto-detects** your location using browser GPS
- Search by **city, PIN code, or constituency name**
- Powered by **Google Maps API** for high-fidelity, interactive mapping
- Direct link to the official **Election Commission of India (ECI)** voter portal

### 📅 Election Timeline
- Visual, interactive timeline of the complete Indian election process
- **Google Calendar Integration**: One-click "Add to Calendar" buttons for important election dates and deadlines
- From voter registration to result declaration

### ✅ Voting Steps Guide
- Step-by-step guide on how to register and cast your vote
- Simple, clear language for first-time voters

### 🎮 Gamification
- User profile tracking (Knowledge Level, Score, Quizzes Taken)
- Level progression: Beginner → Intermediate → Advanced

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **AI** | Google Gemini 2.5 Flash Lite (`@google/generative-ai`) |
| **Maps** | Google Maps Embed API |
| **Styling** | Vanilla CSS (Glassmorphism, CSS Variables) |
| **Deployment** | Google Cloud Run (`asia-south1` — Mumbai) |
| **Containerization** | Docker (multi-stage build) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v20+
- A [Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone the repository
```bash
git clone https://github.com/SIBI2841/bharat-voter-companion.git
cd bharat-voter-companion
```

### 2. Install dependencies
```bash
# Install server dependencies
npm install --prefix server

# Install client dependencies
npm install --prefix client
```

### 3. Configure environment variables
```bash
# Create the server environment file
echo "GEMINI_API_KEY=your_api_key_here" > server/.env
```

### 4. Run in development mode

**Terminal 1 — Start the backend:**
```bash
node server/server.js
```

**Terminal 2 — Start the frontend:**
```bash
cd client && npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## ☁️ Deploying to Google Cloud Run

### 1. Authenticate
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### 2. Set your Gemini API key
```bash
gcloud run services update election-assistant \
  --region asia-south1 \
  --set-env-vars GEMINI_API_KEY=your_api_key_here
```

### 3. Deploy
```bash
gcloud run deploy election-assistant \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated
```

---

## 📁 Project Structure

```
bharat-voter-companion/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AssistantChat.jsx   # AI chat with dynamic UI rendering
│   │   │   ├── PollingBoothMap.jsx # Interactive map component
│   │   │   ├── Timeline.jsx        # Election timeline
│   │   │   └── VotingSteps.jsx     # Step-by-step voting guide
│   │   ├── App.jsx            # Main app with routing
│   │   └── index.css          # Global styles (glassmorphism theme)
│   └── package.json
├── server/                    # Express backend
│   ├── routes/
│   │   └── assistantRoutes.js # Gemini AI API integration
│   ├── server.js              # Express server entry point
│   └── package.json
├── Dockerfile                 # Multi-stage Docker build
├── .dockerignore
├── .gitignore
└── README.md
```

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key from [AI Studio](https://aistudio.google.com/app/apikey) | ✅ Yes |
| `PORT` | Server port (defaults to `8080`) | ❌ Optional |
| `NODE_ENV` | Set to `production` to serve the frontend | ❌ Optional |

---

## 📸 Screenshots

### Home Page
A premium glassmorphism design with Indian tricolor accents welcoming citizens to the platform.

### AI Assistant
Adaptive chat interface that renders interactive quizzes, flashcards, and timelines based on your question.

### Polling Booth Map
GPS-enabled map that locates your nearest polling station with live search support.

---

## 🙏 Acknowledgements

- [Election Commission of India](https://eci.gov.in/) — Official election data
- [Google AI Studio](https://aistudio.google.com/) — Gemini API
- [OpenStreetMap](https://www.openstreetmap.org/) — Open-source mapping
- [Lucide React](https://lucide.dev/) — Beautiful icons

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ for every Indian voter 🇮🇳</p>
