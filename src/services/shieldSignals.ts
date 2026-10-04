/**
 * The "shield": looks for social-engineering signals in a message and turns them
 * into one of three plain risk levels. Runs entirely in the browser, so it keeps
 * working with no internet and no AI service.
 *
 * It layers on top of the existing heuristic analyzer (links, sender, tone) and
 * never claims a message is "safe": the lowest level is LOW CONCERN.
 */
import { OverallAnalysisResult } from '../types/analyzer';
import { TechniqueId } from '../data/techniques';
import { ClaimType } from '../data/verification';

export type RiskLevel = 'LOW' | 'CAREFUL' | 'HIGH';

export const RISK_LABEL: Record<RiskLevel, string> = {
  LOW: 'LOW CONCERN',
  CAREFUL: 'BE CAREFUL',
  HIGH: 'HIGH RISK',
};

export type SignalGroup =
  | 'pressure'
  | 'money'
  | 'credentials'
  | 'access'
  | 'link'
  | 'sender'
  | 'emotion'
  | 'contact'
  | 'attachment'
  | 'style';

export interface Signal {
  id: string;
  title: string;
  group: SignalGroup;
  technique?: TechniqueId;
  weight: number;
  /** Something the person is being asked to hand over (money, codes, access). */
  isAsk: boolean;
  /** Short quotes from the message that triggered this signal. */
  evidence: string[];
  /** Plain-language "why it matters". */
  why: string;
  /** Short phrase used when describing what the message asks for. */
  askPhrase?: string;
}

export interface ShieldInput {
  sender: string;
  replyTo: string;
  subject: string;
  body: string;
}

export interface ShieldAssessment {
  level: RiskLevel;
  points: number;
  signals: Signal[];
  techniques: TechniqueId[];
  headline: string;
  summary: string;
  /** Whether the smart-friction "Before you continue..." interruption should appear. */
  interrupt: boolean;
  claimType: ClaimType;
  /** Plain description of who the message claims to be from. */
  claimedFrom: string;
  /** Plain descriptions of what the message asks the person to do. */
  asks: string[];
}

interface Rule {
  id: string;
  title: string;
  group: SignalGroup;
  technique?: TechniqueId;
  weight: number;
  isAsk?: boolean;
  askPhrase?: string;
  patterns: RegExp[];
  why: string;
}

const RULES: Rule[] = [
  {
    id: 'urgency',
    title: 'Pushing you to act right now',
    group: 'pressure',
    technique: 'urgency',
    weight: 15,
    patterns: [
      /\b(?:immediately|right away|right now|at once|asap|as soon as possible|without delay|do not delay|don'?t wait|act now|time[- ]sensitive|today only|urgent(?:ly)?)\b/gi,
      /\bwithin (?:the next )?\d+\s*(?:hours?|hrs?|minutes?|mins?)\b/gi,
      /\b(?:expires?|expiring) (?:today|tonight|soon)\b/gi,
      /\bbefore \d{1,2}(?::\d{2})?\s*(?:am|pm)\b/gi,
      /\bby (?:end of day|tonight)\b/gi,
    ],
    why: 'Scammers rush you because slowing down gives you time to notice that something is wrong.',
  },
  {
    id: 'scarcity',
    title: 'Saying you are running out of time',
    group: 'pressure',
    technique: 'scarcity',
    weight: 8,
    patterns: [
      /\bonly \d+\s*(?:minutes?|hours?)\s*(?:left|remaining)\b/gi,
      /\b(?:last chance|final (?:notice|warning)|limited time|running out of time)\b/gi,
      /\bwill be (?:returned|cancell?ed|deleted|closed) after\b/gi,
    ],
    why: 'A ticking clock is a classic way to keep you from checking with someone first.',
  },
  {
    id: 'threat',
    title: 'Threatening you with a bad outcome',
    group: 'pressure',
    technique: 'fear',
    weight: 15,
    patterns: [
      /\baccount (?:has been|will be|is|was) (?:suspended|locked|frozen|closed|terminated|disabled|compromised|limited)\b/gi,
      /\b(?:arrest(?:ed)?|warrant for|jail|prison|lawsuit|legal action|criminal charges?|deported|sued)\b/gi,
      /\bunauthori[sz]ed (?:activity|access|charges?|transactions?|transfers?|sign-?ins?|logins?)\b/gi,
      /\bsuspicious (?:activity|sign-?in|login|transaction)\b/gi,
      /\b(?:late fees?|penalt(?:y|ies)|collections?)\b/gi,
      /\bpermanently (?:closed|frozen|deleted|suspended)\b/gi,
      /\b(?:lose|loss of) access\b/gi,
      /\byour computer (?:has|is) (?:a )?(?:virus|infected|hacked)\b/gi,
    ],
    why: 'Fear makes it hard to think clearly. Real organizations can wait while you check.',
  },
  {
    id: 'authority',
    title: 'Claiming to be an official or trusted source',
    group: 'pressure',
    technique: 'authority',
    weight: 8,
    patterns: [
      /\b(?:fraud (?:department|team|prevention|alert)|security (?:team|department|officer)|customer (?:support|protection)|your bank|bank (?:security|representative))\b/gi,
      /\b(?:social security administration|irs|internal revenue|medicare|fbi|sheriff|police department|government agency)\b/gi,
      /\b(?:microsoft|apple) (?:support|technician|security)\b|\bgeek squad\b|\btech(?:nical)? support\b/gi,
      /\b(?:ceo|chief executive|human resources|payroll department)\b/gi,
    ],
    why: 'Scammers borrow official-sounding names because we are used to cooperating with banks, agencies, and bosses.',
  },
  {
    id: 'secrecy',
    title: 'Asking you to keep this secret',
    group: 'pressure',
    technique: 'secrecy',
    weight: 22,
    patterns: [
      /\b(?:do not|don'?t) tell (?:anyone|anybody|your \w+|the \w+)\b/gi,
      /\bkeep (?:this|it) (?:a )?(?:secret|between us|confidential|private|quiet)\b/gi,
      /\bstrictly confidential\b/gi,
      /\b(?:do not|don'?t) (?:discuss|share this) with\b/gi,
      /\b(?:do not|don'?t) (?:contact|call|speak to|talk to|tell|involve) (?:your |the )?(?:bank|banks|tellers?|family|children|son|daughter|spouse|husband|wife|friends?|anyone|police)\b/gi,
      /\bmonitoring (?:them|your)\b/gi,
    ],
    why: 'Secrecy cuts you off from the people most likely to spot the trick. Real organizations never ask you to hide a request from your family or your bank.',
  },
  {
    id: 'bypass',
    title: 'Making it hard to double-check',
    group: 'pressure',
    technique: 'secrecy',
    weight: 14,
    patterns: [
      /\b(?:cannot|can'?t) (?:take|answer) (?:phone )?calls\b/gi,
      /\b(?:skip|bypass) (?:the )?(?:normal|usual|regular|standard)\b/gi,
      /\b(?:no need to|don'?t) (?:verify|confirm|double-check)\b/gi,
      /\ball-day (?:confidential )?meeting\b/gi,
      /\bwithout (?:telling|informing|alerting) (?:anyone|the bank|your)\b/gi,
      /\bif (?:the bank|a teller|anyone) asks\b/gi,
    ],
    why: 'Scammers remove your easy ways to verify. A real request can survive a phone call.',
  },
  {
    id: 'gift-cards',
    title: 'Asking for gift cards',
    group: 'money',
    technique: 'payment',
    weight: 32,
    isAsk: true,
    askPhrase: 'buy gift cards',
    patterns: [
      /\b(?:gift ?cards?|itunes cards?|google play cards?|steam cards?|prepaid (?:debit )?cards?)\b/gi,
      /\b(?:scratch|photo of) the (?:back|card)\b/gi,
    ],
    why: 'Gift cards are not a real payment method for bills, fines, or bosses. Once the codes are shared, the money is almost impossible to get back.',
  },
  {
    id: 'crypto',
    title: 'Asking for cryptocurrency',
    group: 'money',
    technique: 'payment',
    weight: 32,
    isAsk: true,
    askPhrase: 'send cryptocurrency',
    patterns: [
      /\b(?:bitcoin|btc|crypto(?:currency)?|ethereum|usdt|tether|wallet address|coinbase|binance)\b/gi,
      /\b(?:bitcoin|crypto) atm\b/gi,
    ],
    why: 'Crypto payments are hard to trace and cannot be reversed. Scammers love them for that reason.',
  },
  {
    id: 'wire',
    title: 'Asking you to send or move money',
    group: 'money',
    technique: 'payment',
    weight: 28,
    isAsk: true,
    askPhrase: 'send or move money',
    patterns: [
      /\b(?:wire (?:transfer|the money|money|funds|your)|western union|moneygram|money order|cashier'?s check|domestic wire)\b/gi,
      /\b(?:safe|protected|secure|temporary) account\b/gi,
      /\b(?:move|transfer|send) (?:your |the )?(?:balance|money|funds|savings)\b/gi,
      /\b(?:send|wire|transfer|deposit) (?:a |an |the )?(?:payment|deposit|amount)? ?(?:of )?\$\s?\d/gi,
      /\b(?:zelle|cash ?app|venmo)\b/gi,
    ],
    why: 'Real banks never ask you to move your money to a “safe account”. That is a well-known scam, and wire transfers are very hard to undo.',
  },
  {
    id: 'pay-fee',
    title: 'Asking you to pay a fee or fine',
    group: 'money',
    technique: 'payment',
    weight: 12,
    isAsk: true,
    askPhrase: 'pay a fee',
    patterns: [/\bpay(?:ment)? (?:of )?(?:the |a |this )?(?:small )?(?:fee|fine|balance|invoice|deposit|charge)\b/gi, /\bredelivery fee\b/gi],
    why: 'Small “fees” are a common way to trick you into typing in your card number.',
  },
  {
    id: 'codes',
    title: 'Asking for a verification code',
    group: 'credentials',
    technique: 'authority',
    weight: 34,
    isAsk: true,
    askPhrase: 'share a verification code',
    patterns: [
      /\b(?:read|send|share|give|tell|provide|forward|reply with|enter|confirm)\b[^.\n!?]{0,50}\b(?:verification|security|one[- ]time|authentication|sms|2fa|6[- ]digit)\s*(?:pass)?codes?\b/gi,
      /\b(?:verification|security|authentication) code (?:we|that was) (?:just )?(?:sent|texted)\b/gi,
      /\b(?:otp|one[- ]time passcode)\b/gi,
    ],
    why: 'A verification code is the key to your account. Nobody legitimate will ever ask you to read one out to them.',
  },
  {
    id: 'password',
    title: 'Asking for a password or PIN',
    group: 'credentials',
    technique: 'authority',
    weight: 30,
    isAsk: true,
    askPhrase: 'share a password or PIN',
    patterns: [
      /\b(?:enter|confirm|verify|update|renew|reset|provide|send|share|give|type|submit|reply with|tell|keep)\b[^.\n!?]{0,50}\b(?:password|passcode|pin(?: number)?|log-?in (?:details|credentials)|sign-?in (?:details|credentials)|credentials)\b/gi,
      /\b(?:your|current) password (?:will )?(?:expires?|has expired)\b/gi,
    ],
    why: 'Real companies never ask you to confirm or send a password. If you give it away, the scammer can sign in as you.',
  },
  {
    id: 'personal-info',
    title: 'Asking for personal or financial details',
    group: 'credentials',
    technique: 'authority',
    weight: 26,
    isAsk: true,
    askPhrase: 'share personal or financial details',
    patterns: [
      /\b(?:confirm|verify|provide|send|share|give|enter|update|reply with)\b[^.\n!?]{0,60}\b(?:social security(?: number)?|ssn|date of birth|mother'?s maiden name|routing number|account number|card number|credit card (?:number|details|information)|cvv|cvc|driver'?s license|passport|banking details|bank (?:account )?(?:details|information)|billing (?:information|details)|identity)\b/gi,
    ],
    why: 'This information can be used to steal your money or your identity. Legitimate organizations do not ask for it in an unexpected message.',
  },
  {
    id: 'remote-access',
    title: 'Asking for control of your device',
    group: 'access',
    technique: 'authority',
    weight: 32,
    isAsk: true,
    askPhrase: 'give them remote access to my computer',
    patterns: [
      /\b(?:remote access|teamviewer|anydesk|ultraviewer|logmein|screen[- ]shar(?:e|ing))\b/gi,
      /\b(?:install|download) (?:the |this )?(?:app|software|program|tool)\b/gi,
      /\blet me (?:connect|access) (?:to )?your (?:computer|pc|device)\b/gi,
    ],
    why: 'With remote access, a stranger can see your screen, your bank, and your passwords.',
  },
  {
    id: 'family-emergency',
    title: 'Pretending a loved one is in trouble',
    group: 'emotion',
    technique: 'trust',
    weight: 24,
    patterns: [
      /\b(?:grandma|grandpa|grandmother|grandfather|nana)\b/gi,
      /\b(?:your (?:grandson|granddaughter|nephew|niece))\b/gi,
      /\bi'?m (?:in|at) (?:jail|the hospital|trouble)\b/gi,
      /\b(?:bail|car accident|had an accident|public defender)\b/gi,
      /\b(?:new (?:phone|number)|lost my phone)\b/gi,
    ],
    why: 'Scammers use panic about someone you love so you will act before you call that person.',
  },
  {
    id: 'emotional',
    title: 'Pulling on your feelings',
    group: 'emotion',
    technique: 'emotion',
    weight: 14,
    patterns: [
      /\b(?:sweetheart|my love|darling|i love you|stuck (?:overseas|abroad)|stranded|medical emergency|hospital bills?|customs fee)\b/gi,
      /\b(?:i need your help|please help me|you'?re the only one|only person i can (?:ask|turn to)|i'?m scared|trust me)\b/gi,
    ],
    why: 'Love, sympathy, and panic make it harder to question a request. A strong feeling is a good reason to pause.',
  },
  {
    id: 'too-good',
    title: 'Offering a prize or surprise refund',
    group: 'emotion',
    technique: 'emotion',
    weight: 14,
    patterns: [
      /\byou(?:'ve| have)? (?:won|been selected)\b/gi,
      /\b(?:congratulations|sweepstakes|lottery|claim your (?:reward|prize|gift)|free (?:gift|iphone)|unclaimed (?:funds|money)|inheritance)\b/gi,
      /\brefund (?:is )?(?:waiting|pending|ready)\b/gi,
    ],
    why: 'Excitement can be used against you just like fear. You cannot win a contest you never entered.',
  },
  {
    id: 'phone-number',
    title: 'Giving you a phone number to call',
    group: 'contact',
    weight: 10,
    patterns: [
      /\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g,
      /\b1[- ]?8\d\d[- ]?\d{3}[- ]?\d{4}\b/g,
    ],
    why: 'A number inside a suspicious message may connect you straight to the scammer. Find the real number yourself.',
  },
  {
    id: 'attachment',
    title: 'Pushing you to open an attachment',
    group: 'attachment',
    weight: 12,
    patterns: [
      /\b(?:see|open|view|download) (?:the )?attach(?:ed|ment)\b/gi,
      /\battached (?:invoice|file|document)\b/gi,
      /\b[\w-]+\.(?:zip|exe|scr|iso|docm|xlsm)\b/gi,
    ],
    why: 'Unexpected attachments can install harmful software or lead to a fake sign-in page.',
  },
];

const URL_KEYWORDS = /(?:secure|verify|verification|alerts?|support|service|update|login|account|auth|portal|billing|fraud|help-?desk)/i;

function uniqueSnippets(text: string, patterns: RegExp[], max = 3): string[] {
  const found: string[] = [];
  const seen = new Set<string>();
  for (const pattern of patterns) {
    const re = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g');
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m[0].length === 0) {
        re.lastIndex++;
        continue;
      }
      // Take the whole sentence-ish line around the match so the quote makes sense.
      const start = Math.max(text.lastIndexOf('\n', m.index) + 1, m.index - 60);
      const lineEnd = text.indexOf('\n', m.index + m[0].length);
      const end = Math.min(lineEnd === -1 ? text.length : lineEnd, m.index + m[0].length + 60);
      const snippet = text.slice(start, end).replace(/\s+/g, ' ').trim();
      const key = snippet.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        found.push(snippet.length > 140 ? m[0] : snippet);
      }
      if (found.length >= max) return found;
    }
  }
  return found;
}

function detectClaimType(text: string, sender: string): { type: ClaimType; label: string } {
  const t = `${sender} ${text}`.toLowerCase();
  const has = (re: RegExp) => re.test(t);
  if (has(/\b(?:grandma|grandpa|grandson|granddaughter|nana|bail|public defender|i'?m in jail)\b/)) {
    return { type: 'family', label: 'a family member or friend' };
  }
  if (has(/\b(?:irs|internal revenue|social security administration|medicare|fbi|sheriff|warrant|government agency|court)\b/)) {
    return { type: 'government', label: 'a government agency' };
  }
  if (
    has(/\b(?:geek squad|norton|mcafee|tech(?:nical)? support|remote access|technician|your computer (?:has|is)|virus)\b/) ||
    has(/\b(?:microsoft|apple) (?:support|technician|security)\b/)
  ) {
    return { type: 'techsupport', label: 'tech support' };
  }
  if (has(/\b(?:ceo|chief executive|boss|payroll|human resources|my manager|executive)\b/)) {
    return { type: 'employer', label: 'someone at work' };
  }
  if (has(/\b(?:bank|credit union|checking account|savings account|debit card|fraud (?:department|team)|online banking)\b/)) {
    return { type: 'bank', label: 'a bank or card company' };
  }
  if (has(/\b(?:dhl|usps|fedex|ups|package|parcel|delivery|redelivery|tracking)\b/)) {
    return { type: 'delivery', label: 'a delivery company' };
  }
  if (has(/\b(?:it (?:department|support|helpdesk|help desk)|team member|employee)\b/)) {
    return { type: 'employer', label: 'someone at work' };
  }
  if (has(/\b(?:sweetheart|my love|darling|i love you|stuck (?:overseas|abroad))\b/)) {
    return { type: 'romance', label: 'someone you met online' };
  }
  if (has(/\b(?:you(?:'ve| have)? won|congratulations|prize|sweepstakes|lottery|refund (?:is )?(?:waiting|pending))\b/)) {
    return { type: 'prize', label: 'a prize or refund' };
  }
  if (has(/\b(?:paypal|amazon|netflix|apple|google account|microsoft account|order #|receipt|invoice)\b/)) {
    return { type: 'shopping', label: 'a store or payment company' };
  }
  return { type: 'generic', label: 'someone you may not know' };
}

/** Plain-language list of what the message asks the person to do. */
export function describeAsks(signals: Signal[]): string[] {
  const asks: string[] = [];
  for (const s of signals) {
    if (s.isAsk && s.askPhrase && !asks.includes(s.askPhrase)) asks.push(s.askPhrase);
  }
  if (signals.some((s) => s.id === 'link-risky') && !asks.includes('click a link')) asks.push('click a link');
  return asks;
}

export function assessMessage(input: ShieldInput, analysis: OverallAnalysisResult | null): ShieldAssessment {
  const text = `${input.subject}\n${input.body}`;
  const signals: Signal[] = [];

  for (const rule of RULES) {
    const evidence = uniqueSnippets(text, rule.patterns);
    if (evidence.length === 0) continue;
    signals.push({
      id: rule.id,
      title: rule.title,
      group: rule.group,
      technique: rule.technique,
      weight: rule.weight,
      isAsk: Boolean(rule.isAsk),
      askPhrase: rule.askPhrase,
      evidence,
      why: rule.why,
    });
  }

  // Links (from the existing analyzer)
  const links = analysis?.information.links ?? [];
  const riskyLinks = links.filter((l) => l.threatLevel !== 'safe');
  if (riskyLinks.length > 0) {
    const dangerous = riskyLinks.some((l) => l.threatLevel === 'dangerous');
    signals.push({
      id: 'link-risky',
      title: 'A link that does not look trustworthy',
      group: 'link',
      weight: dangerous ? 22 : 14,
      isAsk: true,
      askPhrase: 'click a link',
      evidence: riskyLinks.slice(0, 2).map((l) => l.url),
      why:
        'The address ' +
        (riskyLinks[0].domain ? `“${riskyLinks[0].domain}” ` : '') +
        'does not look like a company’s real website. Fake sign-in pages are made to steal passwords and card numbers. Type the real website yourself instead.',
    });
  } else if (links.length > 0 && /\bclick (?:here|below|the link|this link)\b/i.test(text)) {
    signals.push({
      id: 'link-click',
      title: 'Asking you to click a link',
      group: 'link',
      weight: 5,
      isAsk: false,
      evidence: uniqueSnippets(text, [/\bclick (?:here|below|the link|this link)\b/gi], 1),
      why: 'Links in unexpected messages can lead to fake pages. When in doubt, type the website address yourself.',
    });
  }

  // Sender checks (from the existing analyzer plus one extra for made-up lookalike domains)
  const sender = analysis?.sender;
  if (sender) {
    const status = sender.domainMatchStatus;
    if (status === 'free_webmail_forgery' || status === 'suspicious_lookalike' || status === 'spoofed_impersonation') {
      signals.push({
        id: 'sender-mismatch',
        title: 'The sender does not match who they claim to be',
        group: 'sender',
        technique: 'trust',
        weight: 24,
        isAsk: false,
        evidence: [sender.senderEmail || input.sender].filter(Boolean),
        why:
          sender.claimedOrganization && sender.claimedOrganization !== 'Unknown Organization'
            ? `The message claims to be from ${sender.claimedOrganization}, but the sending address is not one that company publishes.`
            : 'The sending address does not match the organization the message claims to be from.',
      });
    } else if (sender.senderDomain) {
      const label = sender.senderDomain.split('.').slice(0, -1).join('.');
      if (label.includes('-') && URL_KEYWORDS.test(label)) {
        signals.push({
          id: 'sender-lookalike',
          title: 'A made-up sending address',
          group: 'sender',
          technique: 'trust',
          weight: 18,
          isAsk: false,
          evidence: [sender.senderEmail],
          why: 'Real organizations usually send from their one main website address. Long hyphenated names with words like “secure” or “verify” are a common disguise.',
        });
      }
    }
    if (sender.replyToMismatch) {
      signals.push({
        id: 'reply-to',
        title: 'Replies would go somewhere else',
        group: 'sender',
        weight: 14,
        isAsk: false,
        evidence: [sender.replyToEmail || input.replyTo].filter(Boolean),
        why: 'If you reply, your message would go to a different address than the one that sent it. Scammers do this to collect answers.',
      });
    }
  }

  // Sloppy language (from the existing analyzer)
  if (analysis?.tone.languageAndSpelling?.hasMisspellings) {
    signals.push({
      id: 'language',
      title: 'Unusual spelling or wording',
      group: 'style',
      weight: 5,
      isAsk: false,
      evidence: analysis.tone.languageAndSpelling.misspelledWords.slice(0, 2).map((w) => w.word),
      why: 'Typos and odd phrasing are common in scam messages, though a polished message can still be a scam.',
    });
  }

  signals.sort((a, b) => b.weight - a.weight);

  const points = Math.min(100, signals.reduce((sum, s) => sum + s.weight, 0));
  const analyzerScore = analysis?.riskScore ?? 0;
  const hasAsk = signals.some((s) => s.isAsk && s.group !== 'link');
  const hasPressure = signals.some((s) => s.group === 'pressure' || s.group === 'emotion');
  const hasBadSender = signals.some((s) => s.group === 'sender' && s.id !== 'reply-to');
  const hasRiskyLink = signals.some((s) => s.id === 'link-risky');

  let level: RiskLevel = 'LOW';
  if (points >= 50 || analyzerScore >= 75 || (hasAsk && hasPressure)) {
    level = 'HIGH';
  } else if (points >= 20 || analyzerScore >= 40 || hasAsk || hasBadSender || hasRiskyLink) {
    level = 'CAREFUL';
  }

  const techniques: TechniqueId[] = [];
  for (const s of signals) {
    if (s.technique && !techniques.includes(s.technique)) techniques.push(s.technique);
  }

  const claim = detectClaimType(text, input.sender);
  const asks = describeAsks(signals);

  let headline: string;
  let summary: string;
  if (level === 'HIGH') {
    headline = 'Please stop and check before you do anything';
    summary =
      'This message has several warning signs that scammers use to pressure people into sending money or information. You have not done anything wrong by reading it. Pause, and use the steps below to verify.';
  } else if (level === 'CAREFUL') {
    headline = 'A few things here are worth double-checking';
    summary =
      'We noticed some warning signs. This does not prove the message is a scam, but please verify it independently before you click, pay, or share anything.';
  } else {
    headline = 'We did not find major warning signs';
    summary =
      'No major warning signs were detected, but always verify unexpected requests involving money or personal information. We cannot promise any message is genuine.';
  }

  return {
    level,
    points,
    signals,
    techniques,
    headline,
    summary,
    interrupt: level === 'HIGH',
    claimType: claim.type,
    claimedFrom: claim.label,
    asks,
  };
}
