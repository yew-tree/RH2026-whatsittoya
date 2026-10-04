import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  runFullHeuristicAnalysis,
  extractLinks,
  extractEmailAddress,
  VERIFIED_BRAND_REGISTRY
} from './src/services/heuristicAnalyzer.ts';
import { OverallAnalysisResult } from './src/types/analyzer.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK according to system guidelines
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Health / Info
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// Primary Endpoint: Full Email Tone, Information & Sender Analysis
app.post('/api/analyze-email', async (req: Request, res: Response) => {
  try {
    const { sender = '', replyTo = '', subject = '', body = '' } = req.body;

    if (!body && !subject) {
      return res.status(400).json({ error: 'Email content (subject or body) is required for analysis.' });
    }

    // 1. Run local deterministic heuristic analysis (extracts links, parsed headers, known threat feeds)
    const baseAnalysis = runFullHeuristicAnalysis(sender, replyTo, subject, body);
    const extractedLinks = extractLinks(body);
    const parsedSender = extractEmailAddress(sender);

    // 2. If Gemini API key is available, enhance with deep AI reasoning
    if (ai) {
      try {
        const prompt = `You are a patient, friendly, and compassionate Email Safety Assistant helping everyday people, older adults, and community members stay safe online.

CRITICAL INSTRUCTIONS ON TONE AND EMPATHY:
- NEVER blame or shame the reader. Always be reassuring and encouraging: "You did the right thing by checking this email!" or "Scammers try very hard to trick people, so pausing to check is smart."
- Avoid intimidating cybersecurity acronyms (don't use terms like "DNS heuristics", "payload dropper", "attack vector").
- Use everyday, simple, clear analogies and plain words.

Analyze this email across the user's three key questions:

1. THE TONE (Are they rushing or scaring you?):
   - Check if the email creates a fake rush or panic (e.g. "within 12 hours", "account will be closed", "unauthorized charges").
   - CRITICAL FLAG: Check if the urgent language is directly asking them to click a link or button right now. Explain gently: "Scammers create a fake rush so people click before they have time to think or ask a friend."
   - Quote the exact rushed words found in the email.

2. THE INFORMATION & LINKS (Where do the buttons or links really go?):
   - Explain if the link text says one thing (like "paypal.com") but actually leads somewhere else.
   - Explain if the link leads to an unfamiliar website, an unverified web address, or matches known tricks on online scam watchlists.

3. WHO SENT IT (Does the sender email match the real company website?):
   - Check if the sender's domain matches the official website referenced, linked, or claimed in the email.
   - If the sender address belongs to the genuine company domain (e.g. support@github.com matching github.com, or notifications@paypal.com matching paypal.com, or orders@company.com matching company.com), confirm it as a verified match ("verified_match")!
   - ONLY flag an address mismatch if the sender is using a deceptive lookalike/typosquatted domain (e.g. @paypa1.com), a free personal webmail address pretending to be an enterprise (e.g. apple.billing@gmail.com), or an address that clearly contradicts the claimed company website.
   - NEVER state that an email doesn't match the website when the sender's domain actually matches the website!
   - When a known brand is present, provide the link to their official website and security page so users have a safe, direct path.
4. SPELLING, GRAMMAR & INFORMALITY:
   - Actively check for common phishing misspellings (e.g. 'infomation', 'costumer', 'securtiy', 'acount', 'verifaction', 'paymant', 'immediatly').
   - Actively check for poor grammar, awkward syntax, overseas phrasing (e.g. 'kindly do the needful', 'revert back'), generic impersonal greetings from banks ('Dear Customer'), and inappropriate informality.
5. WORKPLACE, IT, ADMINISTRATOR & TECH SAFETY PHISHING DETECTION (CRITICAL REQUIREMENT):
   - IMPORTANT: This alert message is vital for employee safety. The user explicitly requests high sensitivity: it is far better to include this alert on an email that might not strictly need it than to ever miss one that does!
   - If the scam appears to involve IT, an Administrator, Tech Safety, Security/Help Desk, password expiration/reset, mailbox quotas, SSO/VPN credentials, HR, payroll/direct deposit, executive/boss favors, or company operations, ALWAYS set "isEmployerRelated": true.
   - Include an encouraging "employerAlertMessage" advising the user to immediately report it to their supervisors, IT/Tech Safety administrator, and coworkers/friends in order to spread the word quickly about phishing attempts within their company.

EMAIL DATA:
Sender: "${sender}"
Reply-To: "${replyTo || 'None'}"
Subject: "${subject}"
Body:
"""
${body}
"""

Extracted Links:
${JSON.stringify(extractedLinks, null, 2)}

Provide your assessment in the following exact JSON format:
{
  "riskScore": <integer 0-100>,
  "verdict": "<CRITICAL_THREAT | HIGH_RISK | SUSPICIOUS | CAUTION | SAFE>",
  "verdictTitle": "<Friendly, plain-English summary, e.g.: 'This looks like a trick email - please do not click anything' or 'This looks like a normal, safe message'>",
  "verdictExplanation": "<Warm, reassuring explanation in 2 friendly sentences. Start by praising them for checking!>",
  "tone": {
    "urgencyLevel": "<critical | high | moderate | low | neutral>",
    "urgencyScore": <integer 0-100>,
    "urgencyWithLinksAmplifier": <boolean - true if rushing them AND links are present>,
    "emotionalTriggers": [
      {
        "trigger": "<Friendly name, e.g. Rushing you with a countdown>",
        "severity": "<high | medium | low>",
        "description": "<Gentle explanation of why scammers do this>"
      }
    ],
    "urgentPhrases": [
      {
        "phrase": "<exact phrase found>",
        "context": "<short context>",
        "category": "<deadline | threat | panic | financial | confidentiality>"
      }
    ],
    "sentiment": "<Friendly description, e.g. 'Pushy and demanding' or 'Calm and patient'>",
    "summary": "<Warm summary explaining how the email is trying to make them feel>",
    "languageAndSpelling": {
      "hasMisspellings": <boolean>,
      "misspelledWords": [
        {
          "word": "<misspelled word found>",
          "suggestion": "<correct spelling>",
          "context": "<short sentence context>"
        }
      ],
      "grammarOrInformalIssues": [
        {
          "issue": "<issue name>",
          "explanation": "<why this pattern indicates phishing>"
        }
      ],
      "summary": "<Friendly summary of spelling and language quality>"
    }
  },
  "information": {
    "informationRiskScore": <integer 0-100>,
    "knownThreatDatabaseMatches": [
      {
        "database": "<e.g. Online Scam Protection Database>",
        "matchedPattern": "<Plain name of the trick, e.g. Fake Account Freeze Trick>",
        "threatType": "<Plain explanation, e.g. Trying to get your login password>",
        "confidence": <integer 80-99>,
        "details": "<Simple, gentle explanation of how this trick works>",
        "severity": "<critical | high | medium>"
      }
    ],
    "suspiciousKeywords": ["<words detected like 'password', 'verify', 'urgent'>"],
    "summary": "<Friendly explanation of the links and what they ask for>"
  },
  "sender": {
    "displayName": "${parsedSender.displayName}",
    "senderEmail": "${parsedSender.email}",
    "senderDomain": "${parsedSender.domain}",
    "claimedOrganization": "<Company they claim to be>",
    "officialWebsite": "<real official website if known>",
    "officialContactEmails": ["<real official contact email if known>"],
    "domainMatchStatus": "<verified_match | spoofed_impersonation | suspicious_lookalike | free_webmail_forgery | unverified_domain | neutral>",
    "typosquattingDetected": <boolean>,
    "lookalikeDetails": "<Simple explanation if the spelling is slightly altered>",
    "websiteMatchAnalysis": "<Plain explanation comparing the sender's address to the real website>",
    "senderRiskScore": <integer 0-100>,
    "summary": "<Clear, kind summary of whether the sender is real>"
  },
  "recommendedActions": [
    {
      "priority": "<immediate | precaution | general>",
      "action": "<Simple, comforting step, e.g. 'Take a deep breath — you are completely safe right now'>",
      "reason": "<Reassuring reason>"
    }
  ],
  "safeOfficialChannels": {
    "brand": "<organization name>",
    "authenticUrl": "<official legitimate URL>",
    "officialContactEmails": ["<official email address posted on their website>"],
    "securityHelpUrl": "<link to their official security or contact page to confirm accounts are safe>",
    "authenticContact": "<how to safely check, e.g. Contact them via their official website or phone>",
    "safetyNote": "<Safe tip: Never use links from an unexpected email. Open your browser and type the website yourself.>"
  },
  "isEmployerRelated": <boolean true if scam impersonates employer, executive, HR, payroll, or IT>,
  "employerAlertMessage": "<encouraging message to report to supervisors and friends/coworkers to spread the word quickly>"
}`;

        // Multi-tier model fallback with graceful 429 quota handling
        const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
        let aiResult: any = null;

        for (const modelName of modelsToTry) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
              },
            });

            const textOutput = response.text;
            if (textOutput) {
              aiResult = JSON.parse(textOutput);
              break;
            }
          } catch (modelError: any) {
            const isQuotaExceeded =
              modelError?.status === 429 ||
              modelError?.message?.includes('429') ||
              modelError?.message?.includes('RESOURCE_EXHAUSTED');

            if (isQuotaExceeded) {
              console.warn(`[AI Safety Engine] Gemini model "${modelName}" quota reached (429). Attempting fallback.`);
            } else {
              console.warn(`[AI Safety Engine] Gemini model "${modelName}" invocation notice:`, modelError?.message || modelError);
            }
          }
        }

        if (aiResult) {
          // Merge AI insights with deterministic link security data
          const mergedResult: OverallAnalysisResult = {
            riskScore: typeof aiResult.riskScore === 'number' ? aiResult.riskScore : baseAnalysis.riskScore,
            verdict: aiResult.verdict || baseAnalysis.verdict,
            verdictTitle: aiResult.verdictTitle || baseAnalysis.verdictTitle,
            verdictExplanation: aiResult.verdictExplanation || baseAnalysis.verdictExplanation,
            tone: {
              ...baseAnalysis.tone,
              ...aiResult.tone,
              hasLinks: extractedLinks.length > 0,
              urgencyWithLinksAmplifier:
                (aiResult.tone?.urgencyScore >= 40 || baseAnalysis.tone.urgencyScore >= 40) && extractedLinks.length > 0,
            },
            information: {
              links: baseAnalysis.information.links,
              totalLinks: baseAnalysis.information.totalLinks,
              suspiciousLinksCount: baseAnalysis.information.suspiciousLinksCount,
              mismatchedLinksCount: baseAnalysis.information.mismatchedLinksCount,
              knownThreatDatabaseMatches:
                Array.isArray(aiResult.information?.knownThreatDatabaseMatches) && aiResult.information.knownThreatDatabaseMatches.length > 0
                  ? aiResult.information.knownThreatDatabaseMatches
                  : baseAnalysis.information.knownThreatDatabaseMatches,
              suspiciousKeywords: aiResult.information?.suspiciousKeywords || baseAnalysis.information.suspiciousKeywords,
              attachmentRisk: baseAnalysis.information.attachmentRisk,
              informationRiskScore:
                typeof aiResult.information?.informationRiskScore === 'number'
                  ? aiResult.information.informationRiskScore
                  : baseAnalysis.information.informationRiskScore,
              summary: aiResult.information?.summary || baseAnalysis.information.summary,
            },
            sender: {
              ...baseAnalysis.sender,
              ...aiResult.sender,
              displayName: parsedSender.displayName || aiResult.sender?.displayName || baseAnalysis.sender.displayName,
              senderEmail: parsedSender.email || aiResult.sender?.senderEmail || baseAnalysis.sender.senderEmail,
              senderDomain: parsedSender.domain || aiResult.sender?.senderDomain || baseAnalysis.sender.senderDomain,
              officialWebsite: aiResult.sender?.officialWebsite || baseAnalysis.sender.officialWebsite,
              officialContactEmails: aiResult.sender?.officialContactEmails || baseAnalysis.sender.officialContactEmails,
              domainMatchStatus: aiResult.sender?.domainMatchStatus || baseAnalysis.sender.domainMatchStatus,
              websiteMatchAnalysis: aiResult.sender?.websiteMatchAnalysis || baseAnalysis.sender.websiteMatchAnalysis,
              senderRiskScore:
                typeof aiResult.sender?.senderRiskScore === 'number'
                  ? aiResult.sender.senderRiskScore
                  : baseAnalysis.sender.senderRiskScore,
            },
            recommendedActions: Array.isArray(aiResult.recommendedActions) && aiResult.recommendedActions.length > 0
              ? aiResult.recommendedActions
              : baseAnalysis.recommendedActions,
            safeOfficialChannels: aiResult.safeOfficialChannels || baseAnalysis.safeOfficialChannels,
            isEmployerRelated: aiResult.isEmployerRelated ?? baseAnalysis.isEmployerRelated,
            employerAlertMessage: aiResult.employerAlertMessage || baseAnalysis.employerAlertMessage,
            keywordFlag: baseAnalysis.keywordFlag,
            analyzedAt: new Date().toISOString(),
            source: 'ai_and_heuristic',
          };

          return res.json(mergedResult);
        }
      } catch (geminiError) {
        console.warn('[AI Safety Engine] Falling back smoothly to local heuristic verification:', geminiError);
      }
    }

    // Fallback to local heuristic engine (complete, reliable, zero-latency)
    return res.json(baseAnalysis);
  } catch (error: any) {
    console.error('Analysis error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error while analyzing email.' });
  }
});

// Standalone Website & Sender Cross-Reference Verification
app.post('/api/verify-sender-website', async (req: Request, res: Response) => {
  try {
    const { sender, claimedBrand } = req.body;
    const parsed = extractEmailAddress(sender || '');
    const brandLower = (claimedBrand || '').toLowerCase().trim();

    let registryMatch = VERIFIED_BRAND_REGISTRY[brandLower];
    if (!registryMatch) {
      for (const [key, b] of Object.entries(VERIFIED_BRAND_REGISTRY)) {
        if (b.name.toLowerCase() === brandLower || key === brandLower) {
          registryMatch = b;
          break;
        }
      }
    }

    if (registryMatch) {
      const isOfficial = registryMatch.allowedDomains.some(
        d => parsed.domain === d || parsed.domain.endsWith('.' + d)
      );
      return res.json({
        found: true,
        brandName: registryMatch.name,
        officialDomain: registryMatch.officialDomain,
        officialWebsite: registryMatch.officialWebsite,
        officialContactEmails: registryMatch.verifiedContactEmails,
        senderDomain: parsed.domain,
        isOfficialMatch: isOfficial,
        verdict: isOfficial
          ? `Verified: @${parsed.domain} is an official authorized domain for ${registryMatch.name}.`
          : `Spoofed: ${registryMatch.name} publishes @${registryMatch.officialDomain} on their official website, not @${parsed.domain}.`,
      });
    }

    return res.json({
      found: false,
      senderDomain: parsed.domain,
      verdict: `No standardized corporate registry found for "${claimedBrand}". Verify independently via DNS WHOIS and official domain contact info.`,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// In-Email Autonomous Guardian Agent Chat Endpoint
app.post('/api/agent-chat', async (req: Request, res: Response) => {
  try {
    const { message, emailContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (ai) {
      const prompt = `You are the user's personal in-email Autonomous Guardian Agent (Email Safety Helper).
You are built directly into their email client to protect them from phishing, scams, and deceptive tactics before they click anything.

CRITICAL TONE & ACCESSIBILITY GUIDELINES:
1. Speak in a warm, patient, calming, and completely blame-free voice.
2. The user may be an older adult or underserved community member. Use simple, everyday analogies (e.g. comparing links to street signs or fake caller ID).
3. If they ask about clicking a link, reassure them: "You don't need to click anything right now. You are safe."
4. If they ask you to draft a message to a family member or friend, provide a short, ready-to-copy text message.
5. Keep your answer concise (2-4 short sentences or bullet points) so it is easy to read.

CURRENT EMAIL CONTEXT:
Sender: "${emailContext?.sender || 'Unknown'}"
Subject: "${emailContext?.subject || 'Unknown'}"
Email snippet: """${(emailContext?.body || '').slice(0, 800)}"""
Analysis Verdict: "${emailContext?.verdict || 'Unknown'}"

User Question: "${message}"

Your response as their protective in-email agent:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({
        reply: response.text || 'I am right here with you! You are completely safe. When in doubt, do not click any links, and feel free to delete this email.'
      });
    }

    // Heuristic fallback response
    let fallbackReply = "I am your Email Guardian Agent. You are completely safe right now. If this email claims your account is in danger or asks for money/passwords, do not click any links. It is 100% safe to simply delete this email.";
    const lower = (message || '').toLowerCase();
    if (lower.includes('click') || lower.includes('link')) {
      fallbackReply = "Please do not click any links in this email! Scammers use buttons that look real but secretly steal passwords. If you want to check your account, type the real company website directly in your browser.";
    } else if (lower.includes('family') || lower.includes('friend') || lower.includes('draft') || lower.includes('text')) {
      fallbackReply = `Here is a message you can text to family: "Hi! I received an email from ${emailContext?.sender || 'someone'} and my Guardian Agent flagged it as tricky. Could you take a look with me when you have a minute?"`;
    }

    return res.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error('Agent chat error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Vite Middleware for Development / Static file serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PhishGuard Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
