# 🎓 Campus Copilot — AI

> **Campus Intelligence & Equity**
> One AI for money, legal rights, financial aid, and campus life — built for first-gen, low-income, and non-traditional and international students.

---
## Contributed By

- Simran Mohapatra
- Sukriti Srivastava
- Dhairya Parikh

## Project Impact

Campus Copilot helps students find and use support that is often hidden across disconnected campus systems. It gives first-gen, low-income, and non-traditional students one AI-powered place for budgeting, financial aid guidance, legal rights, transportation, events, and emergency resources. By turning scattered information into clear next steps, it helps students get the support they need faster and more fairly.

## What It Does

Campus Copilot is a single React app powered by Claude Sonnet that gives students five tools in one interface:

| Tab | What it does |
|-----|-------------|
| 💰 **Budget** | Live expense tracker with spending breakdown + Survive Mode |
| 🆘 **Survive Mode** | AI survival plan, cheap recipe cards, food map finder |
| 🚌 **Get Around** | Bus/shuttle/bike finder with live GPS + Google Maps integration |
| 🎓 **Financial Aid** | FAFSA, scholarships, emergency funds, appeals — plain English |
| ⚖️ **Legal Aid** | Know your rights (housing, Title IX, immigration, workplace, police) |
| 📅 **Events** | 24 campus events across all departments, filterable, with RSVP |

Claude has **10 live tools** — it routes automatically between budget tracking, financial aid, legal guidance, and events based on what you type.

---

## Prerequisites

Before running locally, make sure you have:

- **Node.js** v18 or higher — check with `node -v`
- **npm** v9 or higher — check with `npm -v`
- An **Anthropic API key** — get one free at [console.anthropic.com](https://console.anthropic.com)

---

## Local Setup (5 minutes)

### 1. Create a new Vite + React project

```bash
npm create vite@latest campus-copilot -- --template react
cd campus-copilot
npm install
```

### 2. Add the component

Copy `CampusCopilot.jsx` into the `src/` folder.

Then open `src/main.jsx` and replace its contents with:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import CampusCopilot from './CampusCopilot'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CampusCopilot />
  </React.StrictMode>
)
```

### 3. Add your API key

Create a `.env` file in the project root (same level as `package.json`):

```
VITE_ANTHROPIC_KEY=sk-ant-your-key-here
```

Then open `src/CampusCopilot.jsx` and find every `fetch("https://api.anthropic.com/v1/messages"` call. Add your key to the headers object:

```js
headers: {
  "Content-Type": "application/json",
  "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-ipc": "true"
}
```

> **Note:** The `anthropic-dangerous-direct-browser-ipc` header is required when calling the Anthropic API directly from a browser. This is fine for hackathon demos. In production, always call through a backend proxy to keep your key safe.

### 4. Add `.env` to `.gitignore`

Open `.gitignore` and confirm this line exists (Vite adds it by default):

```
.env
```

Never commit your API key to GitHub.

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. You should see Campus Copilot load immediately.

---

## Project Structure

```
campus-copilot/
├── src/
│   ├── CampusCopilot.jsx   ← entire app lives here (single component)
│   └── main.jsx            ← mounts the component
├── public/
│   └── vite.svg
├── .env                    ← your API key (never commit this)
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## Features Deep Dive

### 💰 Budget Tab
- Add expenses by typing naturally ("I spent $12 at McDonald's")
- Live spending breakdown by category with animated bars
- Real-time budget progress bar with color alerts
- Transaction history with category badges
- **Survive Mode sub-tab**: AI-generated survival plan, recipe cards ($0.60–$1.80/meal), restaurant + grocery map buttons

### 🚌 Get Around Tab
- One-tap GPS location detection
- Map buttons for: Bus Stops, Campus Shuttles, Bike Share, E-Scooters
- Opens Google Maps centered on your current location
- Direct links to Citymapper and Transit App
- Transport cost comparison cards (Bus vs Uber savings calculator)
- Live alert when transport spend exceeds 8% of monthly budget

### 🎓 Financial Aid Tab
- 6 topic areas: Overview, FAFSA, Scholarships, Emergency Funds, Work-Study, Appeals
- Each card is tappable — sends a targeted question to Claude
- Plain-English explanations, no jargon
- Cross-links to relevant campus events

### ⚖️ Legal Aid Tab
- 6 situation types: Housing, Academic, Workplace, Immigration, Title IX, Police
- Your Rights section (numbered, color-coded)
- Interactive action checklist with checkboxes
- Campus resource cards with urgency tags
- "Draft a letter for my situation" — Claude writes a formal letter you can bring to Student Legal Services
- Persistent disclaimer banner (not legal advice)

### 📅 Events Tab
- 24 events across 6 categories: Financial Aid, Legal Aid, Academic, Career, Wellness, Community
- Filter by: All / Equity-focused / My RSVPs
- Full-text search across titles, descriptions, departments, and tags
- Expand any event card for full details + RSVP button
- "Ask AI to recommend events for me" — Claude cross-references your financial situation with what's available
- Live stat cards: upcoming count, equity count, free today, your RSVPs

---

## Claude Tool Calls

The app uses 10 Claude tools that trigger automatically based on conversation:

| Tool | Triggers when... |
|------|-----------------|
| `add_expense` | You mention spending money on anything |
| `get_spending_summary` | You ask about your budget or finances |
| `get_all_transactions` | You ask Claude to roast your spending |
| `set_monthly_budget` | You tell Claude your budget |
| `delete_transaction` | You ask to remove an expense |
| `get_survival_context` | You ask about saving money or surviving the month |
| `open_financial_aid_guide` | You ask about FAFSA, scholarships, emergency funds |
| `open_legal_aid_guide` | You mention landlord, Title IX, immigration, police, wages |
| `open_events` | You ask about events, what's on campus, free food |
| `rsvp_event` | You say you want to attend a specific event |

---

## Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder. Deploy that folder to Vercel, Netlify, or any static host.


## Customizing for Your Campus

To adapt this for a real university, update these sections in `CampusCopilot.jsx`:

**Events data** (`ALL_EVENTS` array, line ~6): Replace with your school's actual events, departments, and locations.

**Legal resources** (`LEGAL_SITUATIONS` object): Update resource names and contacts to match your campus (e.g., your school's actual Title IX coordinator office name).

**Financial aid topics** (`AID_TOPICS` object): Add school-specific scholarships, emergency fund names, and deadlines.

**System prompt** (`SYSTEM` constant): Add your university name so Claude can reference it directly in responses.

---

## Tech Stack

- **React** + **Vite** — frontend framework and build tool
- **Claude Sonnet (claude-sonnet-4-20250514)** — AI backbone via Anthropic API
- **Claude Tool Use** — 10 structured tools for live budget + UI control
- No other dependencies — zero extra packages beyond React itself

---

## License

Built for the Campus Equity Hackathon. Free to use, fork, and adapt for your school.

---

*A student's zip code, income, or background shouldn't determine their future. Campus Copilot is one small step toward making campus resources actually reachable.*
