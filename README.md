# 🎓 Bunk-o-Meter

> **College Attendance Tracker** — Know exactly how many classes you can bunk and still pass.

![Bunk-o-Meter](src/assets/hero.png)

## ✨ Features

- 📊 **Live Attendance %** — Real-time percentage per subject
- 🟢 / 🔴 **Safe / Critical status** — Color-coded attendance health
- 🧮 **Bunk Calculator** — Tells you exactly how many classes you can skip
- ⚡ **Quick Actions** — +1 Attended / +1 Missed with one tap
- 🤖 **AI Bunk Excuse Generator** — Powered by Gemini AI, generates funny Hindi excuses
- 🔍 **Search & Filter** — Find subjects instantly, filter by Safe / Shortage
- 💾 **Persistent Storage** — All data saved to localStorage, no account needed
- 📱 **Mobile-First UI** — Designed as a phone-sized app viewport

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone the repo
git clone https://github.com/aviraltrip/Bunk-o-meter.git
cd Bunk-o-meter

# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at `http://localhost:5173`

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com/app/apikey).

> Without an API key, the AI Excuse Generator uses a built-in Hindi fallback database.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| AI | Google Gemini 1.5 Flash |
| Persistence | localStorage |
| Animations | canvas-confetti |

---

## 📁 Project Structure

```
src/
├── components/         # UI components
│   ├── Header.tsx
│   ├── SubjectCard.tsx
│   ├── OverallSummaryCard.tsx
│   ├── AddEditSubjectModal.tsx
│   ├── ConfirmDeleteModal.tsx
│   ├── AIExcuseModal.tsx
│   └── EmptyState.tsx
├── hooks/
│   └── useLocalStorage.ts
├── services/
│   └── aiExcuseService.ts
├── types/
│   └── attendance.ts
└── utils/
    ├── attendance.ts
    └── constants.ts
```

---

## 🤖 AI Excuse Generator

The AI Excuse feature generates **100% Hindi bunk excuses** for your professor. Choose from 4 personas:

| Persona | Theme |
|---|---|
| अलार्म धोखा | Alarm glitch / phone boot loop |
| हॉस्टल ड्रामा | Warden raid / geyser drama |
| टेक लोचा | Git conflict / infinite loop |
| गंभीर दर्शन | Quantum physics / existential crisis |

---

## 📄 License

MIT © [aviraltrip](https://github.com/aviraltrip)
