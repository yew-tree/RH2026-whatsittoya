# WhatsItToYa? - "Build the Shield" hackathon brief

**Stop. Check. Protect.**

> Scammers want you to act before you think. WhatsItToYa? helps you slow down, spot the warning signs, and verify before you act.

Everything in this document describes functionality that exists in the finished app and was exercised in a browser. Where something is a prototype or untested, it says so.

## The problem

Socially engineered payment scams do not break computers. They break *decisions*. A scammer creates a short window of pressure (urgency, fear, fake authority, secrecy, emotional manipulation) and needs the victim to act inside it, before they stop and verify. Links and attachments are only the delivery method. The real attack is on the person's state of mind, and it works on intelligent, careful people.

## Target users

- Older adults and people less comfortable with technology, who are often targeted with bank, grandchild, government and tech-support scams.
- Anyone who has been caught off guard on a bad day.

The product is framed around making sophisticated manipulation **easier for anyone to recognize**, not around people being incapable.

## Key differentiator

Most tools answer *"is this email malicious?"* WhatsItToYa? answers *"is someone trying to rush you into handing something over, and what should you do in the next 60 seconds?"* It:

1. looks for **pressure and payment/credential requests**, not only bad links,
2. **interrupts only when risk is real** (smart friction),
3. gets a **trusted person involved** to break the scammer's isolation,
4. **explains the manipulation** in plain words so the user learns the trick.

It never says a message is "safe". The lowest level is **LOW CONCERN**, always with a reminder to verify.

## The four hackathon questions

### 1. What does our shield notice?

The shield (`src/services/shieldSignals.ts`) looks for these signals in pasted emails and texts:

| Group | Signals |
| --- | --- |
| Pressure | urgency ("right now", "within 30 minutes"), running out of time, threats (suspension, arrest, penalties, "virus"), claims of authority (fraud team, IRS, tech support, CEO), secrecy ("do not tell..."), making it hard to double-check ("cannot take calls") |
| Money | gift cards, cryptocurrency, wire / "safe account" transfers, payment apps, fees and fines |
| Credentials | verification codes, passwords / PINs, personal or financial details (SSN, card numbers, etc.) |
| Access | remote-access software, installing apps |
| Emotion / trust | family-emergency stories, love and sympathy language, prize / refund lures |
| Sender and links | sender that does not match the claimed organization, made-up lookalike sender addresses (e.g. `lakeshore-secure-verify.com`), mismatched reply-to address, risky or deceptive links (IP addresses, shorteners, lookalike domains), unexpected attachments, phone numbers to call, unusual spelling |

It builds on the existing analyzer (`src/services/heuristicAnalyzer.ts`) for links, sender matching and tone.

A separate tool, **Pause Before You Pay**, is a short, guided questionnaire (nine questions, one at a time, with Yes / No / I'm not sure) for situations with no message to paste, such as a phone call: unexpected contact, urgency, threats, secrecy, gift cards, crypto, wire transfers, being told not to contact your bank or family, passwords or codes.

### 2. When does it intervene?

| Level | When | What the user sees |
| --- | --- | --- |
| **LOW CONCERN** | No meaningful signals | Calm result. No interruption. Reminder to verify unexpected requests about money or information |
| **BE CAREFUL** | Some signals, or a request for money/credentials/links without strong pressure | Inline "until you have checked" rules, what we noticed, next steps. **No pop-up** |
| **HIGH RISK** | A money / code / password / access request **combined with pressure**, or enough signals overall, or a high analyzer score | The **"Before you continue"** interruption, then the full result |

The interruption is deliberately rare. Ordinary email never triggers it. Separately, **links inside any message with warning signs** are "disarmed": clicking one shows a second, smaller pause ("Hold on, this link is part of a message with warning signs") before anything can open.

Principle: *too early creates frustration, too late means money is lost.*

### 3. What happens next?

1. **Interrupt.** "Before you continue" lists the top warning signs and three rules: do not send money yet, do not share codes or passwords, do not use the phone number or link in the message.
2. **Protect.** Three actions in the dialog:
   - **Ask someone I trust:** writes a calm, editable message ("I got a message that claims to be from a bank... Can you help me check?") with Copy, "Open in my email app" and "Open in my text app".
   - **How to check this safely:** step-by-step guidance for the claimed sender (bank, family member, government, tech support, boss, delivery, store, online friend, prize), always telling the user to find official contact details themselves.
   - **See what we noticed:** the full explanation.
3. **Educate.** "What we noticed" quotes the message, says *why it matters*, and names the manipulation tactic.
4. **Learn and practice.** Links to the Learn center and the practice scenarios.

### 4. Why would the user listen?

- **Calm and blame-free:** "You have done nothing wrong. Checking first was a smart move."
- **Plain language and no jargon:** *what we noticed*, *why it matters*, *what to do next*.
- **Explains why**, quoting the actual message and naming the trick (urgency, fear, secrecy...).
- **Rare, so it is taken seriously:** no alarm fatigue.
- **Gives a next step, not just a warning:** a ready-to-send message to a trusted person and exact verification steps.
- **Honest:** never says "safe"; never tells people to verify using details from the suspicious message; labels the prototype clearly.
- **Accessible by design:** large text by default, one-click larger text, high contrast, clearly labeled buttons with words rather than icons, keyboard and screen-reader support.

## Major features

| Feature | Where | Notes |
| --- | --- | --- |
| Home with the brand and the four-step idea | Home | |
| **Check a Message** | `#/check` | Paste an email (with headers) or a text. Optional sender and reply-to fields. 9 example messages (fake bank alert, locked-account text, grandchild text, plus six emails including one ordinary email) |
| Risk level: LOW CONCERN / BE CAREFUL / HIGH RISK | Result | Shown with words and icons, not only color |
| **Smart interruption** | Dialog | HIGH RISK only; focus-trapped, Escape to close |
| Disarmed links with a second pause | Message viewer | |
| **Ask Someone I Trust** | Result and Pause pages | **Prototype.** Writes and copies a message. Opens the user's own email/text app. Sends nothing itself |
| **Check It Safely** | Result and Pause pages | 10 claim types, "who do they say they are?" selector |
| **Pause Before You Pay** | `#/pause` | 9 guided questions (one at a time), then "Pause. Do not pay yet." with reasons and next steps |
| **Learn to Spot a Scam** | `#/learn` | 14 scam guides (what it looks like, what they want, warning signs, what to do, how to verify safely) and 8 manipulation tactics |
| **Would You Trust This?** | `#/practice` | 6 realistic scenarios, shuffled answers, non-shaming feedback |
| Accessibility panel | Header, all pages | Text size (Standard / Large / Extra large), high contrast, increased spacing, reduced motion. Remembered on the device |

## Technical architecture

- **Front end:** React 19 + TypeScript, Vite, Tailwind CSS (v4). Hash-based navigation so the browser Back button works.
- **The shield runs in the browser** (`shieldSignals.ts`, `heuristicAnalyzer.ts`): rule-based pattern matching for pressure, payment and credential requests, plus link and sender checks. This is what makes the app work **offline and with no AI**.
- **Server (`server.ts`):** a small Express server that serves the app and exposes `/api/analyze-email`. If a `GEMINI_API_KEY` is configured, it asks Google Gemini for a second opinion and merges it in. If there is no key, or the call fails or takes longer than 12 seconds, the app silently falls back to the built-in checks.
- **Trusted verification:** `src/services/trustedContact.ts` builds the message and exposes a `TrustedContactNotifier` interface so a real SMS or email notifier can be added later without changing the UI.
- **Data-driven content:** scam guides, scenarios, tactics and verification guides are plain TypeScript data files in `src/data/`.

## Recommended 2-3 minute live demo

(The full 4-5 minute presenter script is in `DEMO_SCRIPT.txt`.)

1. **Hook (20s):** a 74-year-old gets a "fraud team" message: read the code, move your money, tell no one. "The danger is the pressure, not the link."
2. **Detect (20s):** Check a Message -> paste the demo message (in `DEMO_SCRIPT.txt`) -> **Check message**.
3. **Interrupt (30s):** the "Before you continue" dialog appears. Explain why it only appears for real risk.
4. **Protect (30s):** **Ask someone I trust** -> show the generated message -> Copy. Scroll to **Check It Safely**.
5. **Educate (30s):** **What we noticed** -> "Why it matters" and the named tactics (urgency, fear, secrecy).
6. **Pause Before You Pay (15s, optional):** answer yes to three questions -> PAUSE. DO NOT PAY YET.
7. **Close (10s):** open **Accessibility**, choose **Extra large** and **High contrast**. "Stop. Check. Protect."

## Short pitch

> Every year, people lose billions to scams that never hack a computer. They hack a *feeling*: urgency, fear, trust, secrecy. By the time a normal warning shows up, the victim has usually already acted.
>
> **WhatsItToYa?** is a calm, plain-language social engineering shield. It **detects** the pressure in a message, **interrupts** at the moment that matters (and only then), helps people **protect** themselves by pulling in someone they trust and verifying through official channels, and **educates** by explaining exactly *why* a message is manipulative.
>
> It is built for older adults but useful for everyone, it works offline, and it never claims a message is "safe". The goal is not to catch one more phishing email. It is to interrupt manipulation **before** someone loses money, credentials, or trust.
>
> **Stop. Check. Protect.**

## Honest limits

- The shield looks for *common warning signs* using rules and patterns, in English. It will miss some scams and may flag some legitimate messages. It is a pause button, not a guarantee.
- Trusted verification is a **prototype**: it does not send, store contacts, or notify anyone on its own.
- The optional Gemini AI path depends on a configured key. The demo and all checks described above run without it.
