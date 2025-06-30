# Fed Simulator

**Fed Simulator** is a macroeconomic simulation game where you play as the Federal Reserve. Your objective is to maintain economic stability by managing interest rates, deploying monetary policy tools like QE/QT, and reacting to evolving market conditions. Gameplay is driven by real-time economic metrics, market microstructure, and behavioral agent responses.

Successful players are rewarded with the **$FED** token on Solana.

![Fed Simulator gameplay](./public/screenshot.png)

---

## 📄 Whitepaper

For an in-depth technical and policy-oriented overview of the simulator's architecture, scenarios, and design goals, read the full whitepaper:

**➡️ [Fed Simulator Whitepaper (PDF)](https://drive.google.com/file/d/1wzDnJX8LOgdlV30sYnh4GsXlQOwQcdn2/view?usp=sharing)**
**▶️ [Try the Live Demo](https://www.thefedsimulator.com/)**


---

## 🎮 Features

- Simulates core macroeconomic indicators: inflation, unemployment, GDP, interest rate, and credibility
- Interactive policy tools: raise/cut rates, QE (Quantitative Easing), QT (Quantitative Tightening)
- Scenario builder with historical templates (e.g., 2008 GFC, 1980 Volcker shock)
- Shock events like oil embargo, debt ceiling crisis, and pandemics
- Token rewards based on policy effectiveness and market stability

---

## 💻 Tech Stack

- **Framework**: Next.js (App Router)
- **UI**: React + Tailwind CSS
- **Charting**: `lightweight-charts` for macro + market visualization
- **Blockchain**: Solana integration via `@solana/web3.js`, SPL Token, Wallet Adapter
- **Deployment**: Vercel or custom infrastructure

---

## 🔗 Solana Integration

- Live $FED token integration  
  Mint: `5s4gk4Y4PC9FdRz1y54hs4Qod5J8mSbHoW2FmrVapump`
- Claim system via `getOrCreateAssociatedTokenAccount` and `transfer`
- Treasury-funded token distribution for active participants

---

## 🧠 Use Cases

- Open-source monetary policy lab for students and researchers
- Training simulator for economics or central banking courses
- Visual tool to explain macroeconomic cause-effect to the public
- Experimental sandbox for AI-driven FOMC governance simulations

---

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤝 Contributing

We welcome contributions — feel free to fork, build, and submit PRs related to game mechanics, simulation logic, tokenomics, or UI improvements.

---

## 🏁 Goal

> Build a simulator so real that even **Jerome Powell** might test a rate hike in it.

Developed for the **Solana Hackathon**.
