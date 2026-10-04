export interface ExtractedLink {
  originalText: string;
  url: string;
  domain: string;
  isMismatch: boolean;
  isSuspiciousTld: boolean;
  isIpAddress: boolean;
  hasMultipleSubdomains: boolean;
  isShortener: boolean;
  threatLevel: 'safe' | 'suspicious' | 'dangerous';
  riskReason?: string;
}

export interface ToneAnalysis {
  urgencyLevel: 'critical' | 'high' | 'moderate' | 'low' | 'neutral';
  urgencyScore: number; // 0 - 100
  hasLinks: boolean;
  urgencyWithLinksAmplifier: boolean; // Flagged if urgency + links present
  emotionalTriggers: Array<{
    trigger: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
  }>;
  urgentPhrases: Array<{
    phrase: string;
    context: string;
    category: 'deadline' | 'threat' | 'panic' | 'financial' | 'confidentiality';
  }>;
  sentiment: string;
  summary: string;
  languageAndSpelling?: {
    hasMisspellings: boolean;
    misspelledWords: Array<{ word: string; suggestion: string; context: string }>;
    grammarOrInformalIssues: Array<{ issue: string; explanation: string }>;
    summary: string;
  };
}

export interface ThreatDbMatch {
  database: string;
  matchedPattern: string;
  threatType: string;
  confidence: number;
  details: string;
  severity: 'critical' | 'high' | 'medium';
}

export interface InformationAnalysis {
  links: ExtractedLink[];
  totalLinks: number;
  suspiciousLinksCount: number;
  mismatchedLinksCount: number;
  knownThreatDatabaseMatches: ThreatDbMatch[];
  suspiciousKeywords: string[];
  attachmentMentioned?: boolean;
  attachmentRisk?: string;
  informationRiskScore: number; // 0 - 100
  summary: string;
}

export interface SenderAnalysis {
  displayName: string;
  senderEmail: string;
  senderDomain: string;
  claimedOrganization: string;
  officialWebsite?: string;
  officialContactEmails?: string[];
  postedOfficialEmailsMatch?: boolean;
  postedOfficialEmails?: string[];
  officialSecurityUrl?: string;
  domainMatchStatus:
    | 'verified_match'
    | 'spoofed_impersonation'
    | 'suspicious_lookalike'
    | 'free_webmail_forgery'
    | 'unverified_domain'
    | 'neutral';
  typosquattingDetected: boolean;
  lookalikeDetails?: string;
  websiteMatchAnalysis: string;
  replyToMismatch: boolean;
  replyToEmail?: string;
  authHeadersStatus: {
    spf?: 'pass' | 'fail' | 'softfail' | 'none';
    dkim?: 'pass' | 'fail' | 'none';
    dmarc?: 'pass' | 'fail' | 'none';
    summary: string;
  };
  senderRiskScore: number; // 0 - 100
  summary: string;
}

export type InfoDensityLevel = 'minimal' | 'standard' | 'detailed';

export interface KeywordFlagInfo {
  keyword: string; // e.g. "POSSIBLY_FRAUDULENT" or "NORMAL"
  displayTag: string; // "* Possibly Fraudulent" for suspicious, or "" (empty) for normal
  isSuspicious: boolean;
  explanation: string;
}

export interface OverallAnalysisResult {
  riskScore: number; // 0 - 100
  verdict: 'CRITICAL_THREAT' | 'HIGH_RISK' | 'SUSPICIOUS' | 'CAUTION' | 'SAFE';
  verdictTitle: string;
  verdictExplanation: string;
  keywordFlag: KeywordFlagInfo;
  tone: ToneAnalysis;
  information: InformationAnalysis;
  sender: SenderAnalysis;
  recommendedActions: Array<{
    priority: 'immediate' | 'precaution' | 'general';
    action: string;
    reason: string;
  }>;
  safeOfficialChannels?: {
    brand: string;
    authenticUrl: string;
    authenticContact: string;
    safetyNote: string;
    officialContactEmails?: string[];
    securityHelpUrl?: string;
  };
  isEmployerRelated?: boolean;
  employerAlertMessage?: string;
  analyzedAt: string;
  source: 'ai_and_heuristic' | 'heuristic_fallback';
}

export interface SampleEmail {
  id: string;
  title: string;
  category: 'phishing_urgent' | 'lookalike_spoof' | 'link_deception' | 'ceo_fraud' | 'legit_security' | 'legit_newsletter';
  categoryLabel: string;
  badgeColor: string;
  keywordFlag: string; // e.g. "* RUSH", "* LINK", "* FAKE", "* MONEY", "SAFE"
  sender: string;
  replyTo?: string;
  subject: string;
  body: string;
  description: string;
}
