import React, { useState } from 'react';
import { OverallAnalysisResult, InfoDensityLevel } from '../types/analyzer';

interface RiskScoreGaugeProps {
  result: OverallAnalysisResult;
  isLargeText: boolean;
  infoDensity?: InfoDensityLevel;
  educationalUrl?: string;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  result,
  isLargeText,
  infoDensity = 'standard',
  educationalUrl = 'https://consumer.ftc.gov/scams',
}) => {
  const [copiedFamilyNote, setCopiedFamilyNote] = useState(false);

  // If email is NOT suspicious, don't show any scary or intrusive boxes!
  // Per user instruction: "don't change how a normal email will look (ie: don't include 'verified safe email')"
  if (!result.keywordFlag?.isSuspicious) {
    return null;
  }

  // If info density is 'minimal', the Gmail-style warning banner in AgentCopilotBar is sufficient
  if (infoDensity === 'minimal') {
    return null;
  }

  const handleCopyFamilyNote = () => {
    const note = `Hi! I received an email from "${result.sender.displayName || 'someone'}" that Friendly Web Safety marked as "* Possibly Fraudulent". Could you take a look with me when you get a chance? No rush! Thank you.`;
    navigator.clipboard.writeText(note);
    setCopiedFamilyNote(true);
    setTimeout(() => setCopiedFamilyNote(false), 3000);
  };

  return (
    <section className="bg-white border border-[#DADCE0] rounded-[8px] p-5 mb-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#DADCE0]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-mono text-[#D93025] uppercase tracking-wide bg-[#FCE8E6] px-2.5 py-1 rounded">
            Possibly Fraudulent
          </span>
          <span className="text-xs text-[#5F6368]">
            • Safety Analysis Summary
          </span>
        </div>

        <button
          onClick={handleCopyFamilyNote}
          className="text-xs font-medium text-[#1A73E8] hover:underline cursor-pointer flex items-center gap-1 self-start sm:self-auto"
        >
          {copiedFamilyNote ? '✓ Copied note for family' : 'Ask family or helper'}
        </button>
      </div>

      {/* 3-Point Check Grid */}
      <div className="grid grid-cols-3 gap-2 bg-[#F8F9FA] p-3 rounded-[6px] border border-[#DADCE0] text-center mb-4">
        <div>
          <span className="text-[11px] uppercase text-[#5F6368] font-medium block mb-0.5">
            Tone Pressure
          </span>
          <span
            className={`text-xs sm:text-sm font-bold ${
              result.tone.urgencyScore >= 40 ? 'text-[#D93025]' : 'text-[#1E8E3E]'
            }`}
          >
            {result.tone.urgencyScore >= 40 ? 'Urgent / Rushed' : 'Normal'}
          </span>
        </div>

        <div className="border-x border-[#DADCE0]">
          <span className="text-[11px] uppercase text-[#5F6368] font-medium block mb-0.5">
            Links
          </span>
          <span
            className={`text-xs sm:text-sm font-bold ${
              result.information.suspiciousLinksCount > 0 ? 'text-[#D93025]' : 'text-[#1E8E3E]'
            }`}
          >
            {result.information.suspiciousLinksCount > 0 ? 'Suspicious' : 'Normal'}
          </span>
        </div>

        <div>
          <span className="text-[11px] uppercase text-[#5F6368] font-medium block mb-0.5">
            Sender Address
          </span>
          <span
            className={`text-xs sm:text-sm font-bold ${
              result.sender.domainMatchStatus === 'verified_match' || result.sender.postedOfficialEmailsMatch === true
                ? 'text-[#1E8E3E]'
                : result.sender.domainMatchStatus === 'suspicious_lookalike' ||
                  result.sender.domainMatchStatus === 'free_webmail_forgery' ||
                  result.sender.domainMatchStatus === 'spoofed_impersonation' ||
                  result.sender.postedOfficialEmailsMatch === false
                ? 'text-[#D93025]'
                : 'text-[#5F6368]'
            }`}
          >
            {result.sender.domainMatchStatus === 'verified_match' || result.sender.postedOfficialEmailsMatch === true
              ? 'Matched'
              : result.sender.domainMatchStatus === 'suspicious_lookalike' ||
                result.sender.domainMatchStatus === 'free_webmail_forgery' ||
                result.sender.domainMatchStatus === 'spoofed_impersonation' ||
                result.sender.postedOfficialEmailsMatch === false
              ? 'Mismatched'
              : 'Standard'}
          </span>
        </div>
      </div>

      {/* Explanatory notes */}
      <div className="space-y-2 text-xs text-[#3C4043] leading-relaxed">
        {result.tone.urgentPhrases && result.tone.urgentPhrases.length > 0 && (
          <p>
            <strong className="text-[#202124]">Tone note:</strong> Contains phrases like{' '}
            <span className="text-[#D93025] font-medium">
              {result.tone.urgentPhrases.map((p) => `"${p.phrase}"`).join(', ')}
            </span>.
          </p>
        )}
        <p>
          <strong className="text-[#202124]">Sender address note:</strong> Claims{' '}
          <span className="font-medium text-[#202124]">{result.sender.claimedOrganization}</span>, but sent from{' '}
          <span className="font-mono text-[#D93025]">@{result.sender.senderDomain || 'unknown'}</span>.
        </p>
      </div>
    </section>
  );
};
