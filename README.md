# WhatsItToYa?

**Stop. Check. Protect.**

A calm, plain-language social engineering shield, built for the "Build the Shield" hackathon. It helps people (especially older adults) slow down, spot the warning signs of a scam, and verify before they act.

**Detect** the pressure in a message. **Interrupt** when the risk is real. **Protect** by involving someone you trust and verifying safely. **Educate** by explaining *why* it is manipulative.

## Run it

Prerequisite: Node.js.

```
npm install
npm run dev
```

Open http://localhost:3000.

The app works fully offline with built-in checks. Optionally, add a Gemini key for an AI second opinion by creating `.env.local`:

```
GEMINI_API_KEY="your-key"
```

Never commit this file. `.env*` is git-ignored.

## Pages

- **Check a Message:** paste an email or text and see what we noticed, why it matters, and what to do next
- **Pause Before You Pay:** ten simple questions for any request for money or information
- **Learn:** 14 scam guides and the 8 manipulation tactics
- **Practice:** "Would You Trust This?" realistic scenarios

## Docs

- `HACKATHON_DEMO.md`: how it answers the four hackathon questions, architecture and pitch
- `DEMO_SCRIPT.txt`: a 4-5 minute presenter script with demo input and backup plan
- `OVERNIGHT_REPORT.md`: what was built, tested, and what is still open

## Checks

```
npm run lint     # TypeScript
npm run build    # production build
```

WhatsItToYa? looks for common warning signs. It cannot promise to catch every scam and never tells you a message is "safe".
