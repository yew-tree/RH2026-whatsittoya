# Overnight report: WhatsItToYa?

Branch: `claude-overnight` (nothing pushed, nothing merged, `main` untouched).

## Summary

The existing Gmail-style "Friendly Web Safety" email checker was rebuilt into **WhatsItToYa?**, a calm, plain-language social engineering shield organized around **Detect -> Interrupt -> Protect -> Educate**. The old analyzer, server and Gemini integration were kept and extended; the old inbox UI was replaced by five focused pages (Home, Check a Message, Pause Before You Pay, Learn, Practice).

Final state: `npx tsc --noEmit` passes, `vite build` passes, and every demo flow below was exercised in a real browser (Chrome) against the running app.

## Features completed

| # | Feature | Status |
| --- | --- | --- |
| 1 | Message shield: LOW CONCERN / BE CAREFUL / HIGH RISK, "what we noticed / why it matters / what to do next" | Done |
| 2 | Smart interruption ("Before you continue..."), HIGH RISK only, plus a second pause on links in flagged messages | Done |
| 3 | Trusted verification ("Ask Someone I Trust") | Done as a **prototype**: writes/copies a message, can open the user's own email/text app. Sends nothing, stores nothing. Labeled in the UI |
| 4 | Learn to Spot a Scam (14 scam guides, 8 manipulation tactics) | Done |
| 5 | Would You Trust This? (6 scenarios, shuffled answers, non-shaming feedback) | Done |
| 6 | Teach manipulation techniques, tied to real analysis results | Done (named tactics with plain explanations appear on every result and in Learn) |
| 7 | Pause Before You Pay (10 questions) | Done |
| 8 | Safe verification guidance (10 claim types) | Done |
| - | WhatsItToYa? branding on all user-facing text and `<title>` / metadata | Done |
| - | Accessibility bar and large-by-default design | Done |
| - | `HACKATHON_DEMO.md`, `OVERNIGHT_REPORT.md`, `DEMO_SCRIPT.txt` | Done |

## Files added

- `src/services/shieldSignals.ts`: the signal engine and risk levels (runs in the browser, works offline)
- `src/services/trustedContact.ts`: trusted-message builder, mailto/sms helpers, copy helper, `TrustedContactNotifier` interface for future real notifications
- `src/services/accessibility.ts`: persistent display settings
- `src/hooks/useMessageChecker.ts`: paste -> analyze (server with 12 s timeout, local fallback) -> assess
- `src/data/`: `techniques.ts`, `verification.ts`, `scams.ts`, `scenarios.ts`, `examples.ts`, `demoMessage.ts`
- `src/components/`: `SiteHeader`, `HomePage`, `CheckPage`, `ResultPanel`, `InterruptModal`, `Dialog`, `MessageViewer`, `TrustedVerification`, `VerificationGuide`, `PausePage`, `LearnPage`, `PracticePage`, `ui`
- `HACKATHON_DEMO.md`, `OVERNIGHT_REPORT.md`, `DEMO_SCRIPT.txt`

## Important files modified

- `src/App.tsx`: rewritten as a five-page shell with hash navigation, focus management and a skip link
- `src/index.css`: design tokens, large default text, high-contrast and reduced-motion modes, focus rings
- `server.ts`: startup log rebranded; AI prompts now forbid calling a message "safe" or telling people to use contact details from the message; "completely safe / 100% safe" wording removed from fallback replies
- `src/services/heuristicAnalyzer.ts`: "Looks Safe" / "100% safe" verdict wording replaced with non-guarantee language (analysis logic unchanged)
- `src/data/sampleEmails.ts`: GitHub sample retitled ("An ordinary notice from GitHub") so it no longer claims to be "safe"
- `index.html`, `metadata.json`, `README.md`: branding

## Removed

17 components from the old UI (`Header`, `InboxView`, `AgentCopilotBar`, `SettingsPage`, `WebsiteLookupModal`, `EmailInputForm`, `SamplePicker`, `EmailViewerWithHighlights`, `AdaToolbar` and eight analysis-card components that were already unused). They contained "verified safe email" banners and a different visual identity. They remain in git history. I deliberately kept `heuristicAnalyzer.ts`, `types/analyzer.ts`, `server.ts` and all API routes.

## Bugs fixed (found during browser testing)

- **Modal clipped / mispositioned.** The interruption dialog sat inside an animated container whose CSS transform became the containing block for `position: fixed`, pushing it off-screen. The dialog now renders through a React portal.
- **Duplicated evidence quotes** when two rules matched the same sentence.
- **Stale settings closure** in the accessibility bar (two rapid clicks could overwrite each other).
- **Stale sender field** when loading an example after typing a sender.
- **Predictable practice answers** (the safe option was never first); answers are now shuffled.
- **Misclassified scam types** (for example a boss wire request treated as a bank scam); claim-type detection reordered.
- A Python `\b` escaping slip briefly corrupted 22 regexes during development (caught immediately by the test probe; fixed).

## Accessibility improvements

- 18 px base text (larger than the browser default), with A / A+ / A++ buttons (18 / 21 / 25 px); every size uses rem units.
- High contrast mode, "more spacing" mode, "less motion" mode (also honors the OS `prefers-reduced-motion`). Choices persist on the device.
- Large buttons (at least 3.5 rem tall) with words, not just icons. Risk level is shown as text plus an icon, never color alone.
- Visible 4 px focus ring everywhere; skip link; focus moves to the page heading on navigation; browser Back/Forward work.
- Dialogs: focus moves in, Tab is trapped, Escape closes, focus returns to the opener.
- Radio inputs for Pause Before You Pay, labeled fieldsets/legends, `aria-live` regions for loading, copy status and scenario feedback.
- Plain-language rewrite of every explanation; no scores or technical terms in the main flow.

## Checks performed

- `npx tsc --noEmit`: passes.
- `npx vite build`: passes.
- Signal-engine probe over all 6 original sample emails, the demo message, an SMS, a grandchild text, a friendly note and a real 2FA message: all 8 scam-like inputs (11 inputs in total) came out HIGH RISK; the 3 ordinary inputs (GitHub notice, friendly note, 2FA code email) came out LOW CONCERN with no interruption.
- Browser (Chrome, via the dev server) flows exercised: Home; pasting the demo message and submitting; "See an example scam" from Home; HIGH RISK interruption and its three buttons; trusted-message generation; link-pause dialog; LOW CONCERN wording (contains no "safe" claim); Pause Before You Pay (HIGH RISK result and trusted message); all 6 Practice scenarios through to the summary; Learn detail view and tactics tab; A++ and high contrast toggles (persisted to localStorage); zero console errors.
- **Offline fallback:** with the server process stopped, the same demo produced the full HIGH RISK result and interruption in about 1 second.
- API: `/api/analyze-email` returns a result with no key; returns HTTP 400 for an empty body.
- No secrets: no `.env` file exists in the repo, `.env*` is git-ignored, and only `.env.example` (placeholder values) is tracked.

## Build status

`npm run lint` (TypeScript) and `npm run build` pass. The pre-existing Vite warning about `__dirname` in `vite.config.ts` is unchanged.

## Known issues and limitations

- **Gemini/AI path was NOT tested** (no API key available). The code path is the original one with stricter prompts. Model names in `server.ts` (`gemini-3.8-flash`, `gemini-3.1-flash-lite`) come from the original project and were not verified. The app falls back to built-in checks if the call fails. Test it with your own key before showing any AI feature.
- **Phone-width layout was not verified.** The browser window could not be resized below ~1700 px in my tooling, so mobile relies on the responsive Tailwind classes only. No horizontal scrolling was seen at desktop widths with A++ text and high contrast.
- **No real screen-reader testing** (NVDA/VoiceOver). Semantics, labels, live regions and keyboard behavior were implemented and partially checked through the DOM, not through assistive technology.
- **No automated test suite exists** in the project, and I did not add one. Verification was the probe script (not committed) and manual browser runs.
- The signal engine is **rule-based and English-only**. Expect false negatives (a polished scam with no trigger phrases can come out LOW CONCERN) and occasional false positives. This is why the lowest level never says "safe".
- The original analyzer treats "sender domain equals link domain" as a verified match. For a made-up lookalike domain that matches its own link (like the demo's `lakeshore-secure-verify.com`), the original analyzer scores low. The new shield compensates with a "made-up sending address" rule, but the legacy analyzer logic itself was not changed.
- The legacy analyzer's "known threat database" entries (PhishTank, APWG, FBI IC3, etc.) are hard-coded patterns with those names, not live feeds. They are not shown in the new UI.
- `/api/agent-chat` and `/api/verify-sender-website` still exist in `server.ts` but the new UI does not use them.
- Trusted verification is a prototype: no saved contacts, no sending.
- "Open it anyway" in the link pause dialog opens the real address in a new tab for the built-in sample emails (for example the PayPal example's `paypal.com` link). Do not use it in a live demo.
- The Google Fonts stylesheet is the only external resource; without internet the system font is used.
- `README-friend.md` (a leftover duplicate AI Studio README) was left untouched.

## Unfinished / not started

- Saved trusted contacts and real SMS/email notification (designed for, not built).
- Automated tests and CI.
- Translations.
- A polished mobile pass and real assistive-technology testing.

## Blockers

None blocked the work. Linear (MCP) was reachable but contained no relevant issues, so the prompt was the only source of requirements.

## Recommended next steps

1. Run the demo once on the actual presentation laptop, offline, using `DEMO_SCRIPT.txt`.
2. If you want the AI second opinion, add `GEMINI_API_KEY` to `.env.local`, confirm the model names, and test one HIGH RISK and one ordinary message.
3. Check the layout on a real phone and with a screen reader.
4. Add saved trusted contacts plus a real notifier behind the `TrustedContactNotifier` interface.
5. Add unit tests for `assessMessage` using the examples in `src/data/examples.ts`.

## How to run

```
npm install
npm run dev          # http://localhost:3000
```

Optional: put `GEMINI_API_KEY="..."` in `.env.local` for the AI second opinion. The app works fully without it.

```
npm run lint         # TypeScript check
npm run build        # production build to dist/
```

## Git commits created

- `fc09871` Rebuild app as WhatsItToYa? social engineering shield
- A final commit adding `HACKATHON_DEMO.md`, `OVERNIGHT_REPORT.md`, `DEMO_SCRIPT.txt` and the README update (see `git log`)
