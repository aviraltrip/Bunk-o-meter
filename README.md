# Bunk-o-Meter

College attendance tracker built to help students calculate how many classes they can safely skip while maintaining their required attendance criteria.

Built during the Vibecoding 101 session tailored for 1st and 2nd year engineering students.

## Features

- Attendance Tracking: Real-time percentage tracking per subject with Safe and Shortage alerts.
- Bunk Calculator: Calculates how many classes you can bunk or need to attend to stay above your target.
- AI Excuse Generator: Generates contextual Hindi excuses for missed lectures powered by the Gemini API (with offline fallbacks).
- Local Persistence: Saves attendance data directly in browser localStorage with zero account setup.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Google Gemini API

## Setup

```bash
git clone https://github.com/aviraltrip/Bunk-o-meter.git
cd Bunk-o-meter
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` (optional, for Gemini AI excuses):

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## License

MIT
