# Overnight report: WhatsItToYa?

Branch: `claude-overnight` (nothing pushed, nothing merged, `main` untouched).

## Summary

The existing Gmail-style "Friendly Web Safety" email checker was rebuilt into **WhatsItToYa?**, a calm, plain-language social engineering shield organized around **Detect -> Interrupt -> Protect -> Educate**. The old analyzer, server and Gemini integration were kept and extended; the old inbox UI was replaced by five focused pages (Home, Check a Message, Pause Before You Pay, Learn, Practice).

Final state: `npx tsc --noEmit` passes, `vite build` passes, and every demo flow below was exercised in a real browser (Chrome) against the running app.

## UI/UX redesign (second pass)

The first pass delivered the functionality with a colorful, emoji-heavy "card" interface. This pass redesigned how everything looks and is laid out, without removing any feature.

**Direction:** a restrained application, in the spirit of a bank security center or account-settings page: white surface on a light gray canvas, one deep security-blue brand color plus success / warning / danger semantic colors, thin borders instead of shadows, 6-8 px corners, left-aligned content, sections separated by spacing, typography and hairline rules rather than by colored boxes.

**Design system (`src/index.css`, `src/components/ui.tsx`):**
- Color, radius and border tokens defined once (`@theme` + CSS variables). High contrast mode swaps the palette and thickens borders through the same variables.
- A real type scale (page 1.6 rem, section 1.2 rem, sub 1.02 rem, body 1 rem, small 0.9 rem on an 18 px base) and shared component classes: `.btn` (primary / secondary / danger / link), `.field`, `.callout` (info / ok / warn / danger), `.surface`, `.section`, `.bullets`, `.steps`, `.risk-label`.
- Shared React primitives: `Button`, `ButtonLink`, `PageHeader`, `Section`, `Callout`, `Bullets`, `Steps`, `BackLink`, `RiskLabel`.
- Icons come from `lucide-react`, which was already a project dependency (nothing new was added). Emoji were removed from the interface; icons appear only next to words.

**Application shell:** a slim header with the brand on the left and one **Accessibility** button on the right that opens a compact settings panel (text size, high contrast, increased spacing, reduced motion, reset). Navigation is a quiet tab row with an underline on the current page; below the large breakpoint it becomes a **Menu** button. Footer is one short line plus the FTC link.

**Pages redesigned (all of them):**
- **Check a Message:** a form view (large textarea, optional sender details, one primary button, examples as a divided list) and a separate **Message assessment** view. The assessment is ordered: verdict banner, what we noticed, what to do next, ask someone you trust, check it safely, how the message tries to influence you, the message itself, optional details.
- **Interruption:** a restrained dialog titled "Before you continue" with a warning icon, the top three signals, three stop rules, and three actions. No oversized red screen.
- **Ask someone you trust:** a plain section with a clear note that nothing is sent, an editable message, Copy / Open in email app / Open in text app.
- **Pause Before You Pay:** now a guided questionnaire (nine questions, one at a time, Yes / No / I'm not sure, progress bar, Back / Next), ending in a clear assessment.
- **Learn:** search, a divided list of scams, tabs for "Common scams" and "How scammers manipulate you", and a detail view with the five required sections.
- **Would You Trust This?:** one scenario at a time with a quoted message, plain answer options, and a concise explanation after the choice.
- **Home:** a short application-style start page (title, tagline, two actions, four-line "how it protects you", where to start, about the name).

**Copy:** removed cheerful filler and most reassurance banners ("You are completely safe", "Let's take a closer look" and similar); the tone is calm and specific.

**Accessibility kept and improved:** same 18 px base and the three text sizes (now 18 / 20.5 / 24 px), high contrast, spacing, reduced motion, focus rings, skip link, focus moved to headings on navigation, trapped-focus dialogs, labeled radios and fieldsets, live regions. The accessibility settings are now one findable button instead of a permanent bar.

**Verified in the browser (Chrome, dev server):** Home, Check a Message, the demo message through to the interruption and assessment, trusted-message generation, Pause Before You Pay start to result, Learn list and a detail page, Would You Trust This?, the Accessibility panel, and Extra large text with High contrast on the high-risk assessment. **Responsive:** rendered at 1024, 820 and 390 px widths (in iframes, because the browser tool could not resize the window), including with Extra large text and High contrast: no horizontal overflow, tab row wraps at 1024 with large text, Menu appears below 1024, header buttons stack when space runs out, dialog fits at 390 px.

**Bugs found by this pass and fixed:** header controls overflowed horizontally at 390 px; the same evidence quote could appear twice when two rules matched one line (now one quote per source line); unselected options in Practice were faded with opacity, weakening contrast (now a muted style); duplicated "assessment" headings.

**Not done / still open after the redesign:**
- Real phone and real screen-reader testing. Layouts were checked at phone width in the browser, not on a device.
- `icon` fields (emoji) remain in `src/data/*.ts`, unused by the interface. Harmless; a cleanup candidate.
- The mobile and tablet checks used an iframe and DOM measurements for overflow; I looked at screenshots for desktop and phone width but not for every page at every size.

## Features completed

| # | Feature | Status |
| --- | --- | --- |
| 1 | Message shield: LOW CONCERN / BE CAREFUL / HIGH RISK, "what we noticed / why it matters / what to do next" | Done |
| 2 | Smart interruption ("Before you continue..."), HIGH RISK only, plus a second pause on links in flagged messages | Done |
| 3 | Trusted verification ("Ask Someone I Trust") | Done as a **prototype**: writes/copies a message, can open the user's own email/text app. Sends nothing, stores nothing. Labeled in the UI |
| 4 | Learn to Spot a Scam (14 scam guides, 8 manipulation tactics) | Done |
| 5 | Would You Trust This? (6 scenarios, shuffled answers, non-shaming feedback) | Done |
| 6 | Teach manipulation techniques, tied to real analysis results | Done (named tactics with plain explanations appear on every result and in Learn) |
| 7 | Pause Before You Pay (9 guided questions) | Done |
| 8 | Safe verification guidance (10 claim types) | Done |
| - | WhatsItToYa? branding on all user-facing text and `<title>` / metadata | Done |
| - | Accessibility panel and large-by-default design | Done |
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

- 18 px base text (larger than the browser default), with Standard / Large / Extra large options (18 / 20.5 / 24 px); every size uses rem units.
- High contrast mode, "more spacing" mode, "less motion" mode (also honors the OS `prefers-reduced-motion`). Choices persist on the device.
- Buttons at least 2.75 rem (about 50 px) tall, with words rather than icons alone. Risk level is shown as text plus an icon, never color alone.
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
- **Phone layouts were checked in the browser but not on a real device.** The browser window could not be resized in my tooling, so 390 / 820 / 1024 px layouts were rendered in iframes and measured for overflow (none found, including Extra large text and High contrast).
- **No real screen-reader testing** (NVDA/VoiceOver). Semantics, labels, live regions and keyboard behavior were implemented and partially checked through the DOM, not through assistive technology.
- **The successful "Copy message" path was not confirmed.** In my automated browser run the clipboard was blocked (scripted clicks are not real user gestures); the app correctly showed its "Your browser blocked copying" fallback message. Test the copy button once by hand in the browser you will present with.
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
- `986425c` Add demo script, hackathon brief, overnight report, README
- A final commit for the UI/UX redesign and the updated docs (see `git log`)
