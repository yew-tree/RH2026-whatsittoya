import React, { useState } from 'react';
import { OverallAnalysisResult } from '../types/analyzer';

interface AgentCopilotBarProps {
  result: OverallAnalysisResult;
  isLinksDisarmed: boolean;
  onToggleDisarmLinks: () => void;
  onQuarantineEmail: () => void;
  onOpenLookup?: () => void;
  educationalUrl?: string;
}

export const AgentCopilotBar: React.FC<AgentCopilotBarProps> = ({
  result,
  isLinksDisarmed,
  onToggleDisarmLinks,
  onQuarantineEmail,
  onOpenLookup,
  educationalUrl = 'https://consumer.ftc.gov/scams',
}) => {
  const [copiedAlert, setCopiedAlert] = useState(false);

  // If the email is NOT a scam, leave it be!
  if (!result.keywordFlag?.isSuspicious) {
    return null;
  }

  const sender = result.sender;
  const officialInfo = result.safeOfficialChannels || (sender.officialWebsite ? {
    brand: sender.claimedOrganization,
    authenticUrl: sender.officialWebsite,
    securityHelpUrl: sender.officialSecurityUrl || sender.officialWebsite,
    officialContactEmails: sender.postedOfficialEmails || sender.officialContactEmails || [],
    authenticContact: '',
    safetyNote: '',
  } : undefined);

  // Determine a brief, specific explanation as to why it was flagged
  let briefReason = result.keywordFlag.explanation || result.verdictExplanation;
  if (sender.postedOfficialEmailsMatch === false && sender.claimedOrganization !== 'Unknown Organization') {
    briefReason = `The sender's email address (${sender.senderEmail || 'unknown'}) is NOT one of the official emails posted on ${sender.claimedOrganization}'s verified website.`;
  } else if (
    sender.domainMatchStatus === 'suspicious_lookalike' ||
    sender.domainMatchStatus === 'free_webmail_forgery' ||
    sender.domainMatchStatus === 'spoofed_impersonation'
  ) {
    briefReason = `The sender's address (@${sender.senderDomain || 'unknown'}) does not match the official website for ${sender.claimedOrganization}.`;
  } else if (result.tone.urgencyWithLinksAmplifier || result.tone.urgencyScore >= 40) {
    briefReason = 'This message uses an artificial countdown deadline to rush your decision right before asking you to click.';
  } else if (result.information.suspiciousLinksCount > 0 || result.information.mismatchedLinksCount > 0) {
    briefReason = 'Buttons or links in this email point to an unverified or deceptive destination.';
  }

  const handleCopyWorkplaceWarning = () => {
    const textToCopy = `⚠️ Heads-up team: I just received a fraudulent email posing as IT / Tech Safety / Administrator / Workplace ("${result.keywordFlag.explanation || 'Phishing scam'}"). Please do not click any links, open attachments, or enter credentials. Make sure to report it to our supervisor and IT security team right away!`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedAlert(true);
    setTimeout(() => setCopiedAlert(false), 3000);
  };

  return (
    <div
      role="alert"
      aria-label="Fraudulent Email Warning"
      className="bg-[#FCE8E6] border border-[#F28B82] rounded-[8px] p-4 sm:p-5 mb-5 text-[#202124] shadow-xs"
    >
      {/* 1. Mark as fraudulent in bold red */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F28B82]/30">
        <div className="flex items-center gap-2">
          <span className="text-[#D93025] text-base" aria-hidden="true">
            ⚠️
          </span>
          <span className="text-[#D93025] font-bold text-sm sm:text-base tracking-[0.02em]">
            Possibly Fraudulent
          </span>
        </div>

        {/* Learn More link for those curious about phishing */}
        <a
          href={educationalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#1A73E8] hover:underline font-semibold inline-flex items-center gap-1"
        >
          Learn More about Phishing ↗
        </a>
      </div>

      <div className="my-3 space-y-3 text-xs sm:text-sm leading-relaxed text-[#3C4043]">
        {/* 2. Brief explanation as to why AFTER the user clicks into the email */}
        <p>
          <strong className="text-[#202124]">Why: </strong>
          {briefReason}
        </p>

        {/* Employer / Workplace Alert message */}
        {result.isEmployerRelated && (
          <div className="bg-[#FFF4E5] border border-[#FFE0B2] p-3.5 rounded-[6px] text-xs text-[#5D3F00] space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-bold flex items-center gap-1.5 text-sm text-[#7A4100]">
                <span>🏢</span>
                <span>Workplace & Tech Safety Alert: Report to IT, Administrator & Coworkers</span>
              </span>
              <span className="text-[10px] font-bold uppercase bg-[#FFE0B2] text-[#7A4100] px-2 py-0.5 rounded">
                IT, Administrator & Workplace Alert
              </span>
            </div>

            <p className="leading-relaxed">
              {result.employerAlertMessage ||
                'This fraudulent email appears to involve your workplace, IT department, administrator, or Tech Safety. Please report this message to your supervisor and IT/Tech Safety team immediately, and let your coworkers and work friends know so you can spread the word quickly and protect everyone across the company!'}
            </p>

            <div className="pt-2 border-t border-[#FFE0B2]/60 flex items-center justify-between flex-wrap gap-2">
              <button
                onClick={handleCopyWorkplaceWarning}
                className="px-3 py-1.5 bg-white border border-[#FFE0B2] hover:bg-[#FFFDF9] text-[#7A4100] font-semibold rounded-[4px] cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>📋</span>
                <span>{copiedAlert ? '✓ Warning Copied to Clipboard!' : 'Copy Quick Warning to Alert Coworkers'}</span>
              </button>
              <span className="text-[11px] text-[#8C5300]">
                Spreading the word quickly prevents coworkers from falling for it.
              </span>
            </div>
          </div>
        )}

        {/* Link to official website to contact the necessary people & confirm accounts are safe */}
        {officialInfo && (
          <div className="bg-white border border-[#F28B82]/50 p-3.5 rounded-[6px] text-xs space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-bold text-[#202124]">
                <span>🏢</span>
                <span>Confirm Your Account with {officialInfo.brand}</span>
              </div>

              <a
                href={officialInfo.securityHelpUrl || officialInfo.authenticUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-[#1A73E8] hover:bg-[#174EA6] text-white text-xs font-semibold rounded-full inline-flex items-center gap-1 self-start sm:self-auto shadow-2xs"
              >
                Visit Official {officialInfo.brand} Website ↗
              </a>
            </div>

            <p className="text-[#3C4043] leading-relaxed">
              To confirm whether your account is safe, contact {officialInfo.brand} directly through their verified website above. Never use links or phone numbers provided inside an unexpected email.
            </p>

            {officialInfo.officialContactEmails && officialInfo.officialContactEmails.length > 0 && (
              <div className="pt-2 border-t border-[#F1F3F4] text-[11px] text-[#5F6368]">
                <strong className="text-[#202124]">Official emails posted on their website: </strong>
                <span className="font-mono text-[#1E8E3E] font-medium">
                  {officialInfo.officialContactEmails.join(', ')}
                </span>
                <span className="block mt-0.5 text-[#D93025]">
                  This sender address ({sender.senderEmail || 'unknown'}) is NOT published on their website.
                </span>
              </div>
            )}
          </div>
        )}

        {/* 3. Reassure that simply opening the email won't make them unsafe */}
        <div className="bg-white/80 border border-[#F28B82]/40 p-2.5 rounded-[6px] text-xs text-[#202124] flex items-start gap-2">
          <span className="text-[#1E8E3E] font-bold text-sm leading-none mt-0.5">✓</span>
          <p>
            <strong>You are completely safe:</strong> Simply opening or reading this email cannot harm your computer, phone, or accounts. Phishing tricks can only cause issues if you click their links, share passwords, or send money.
          </p>
        </div>
      </div>

      {/* Helpful Actions */}
      <div className="pt-3 border-t border-[#F28B82]/30 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onQuarantineEmail}
            className="px-3 py-1.5 rounded-[4px] text-xs font-semibold bg-[#D93025] text-white hover:bg-[#B71C1C] transition-colors cursor-pointer"
          >
            Delete Email Safely
          </button>

          {result.information.totalLinks > 0 && (
            <button
              onClick={onToggleDisarmLinks}
              className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold border transition-colors cursor-pointer ${
                isLinksDisarmed
                  ? 'bg-white text-[#1E8E3E] border-[#1E8E3E]'
                  : 'bg-white text-[#D93025] border-[#D93025]'
              }`}
            >
              {isLinksDisarmed ? '✓ Links Disarmed (Safe)' : 'Disarm Links'}
            </button>
          )}
        </div>

        <span className="text-[11px] text-[#5F6368]">
          Friendly Web Safety
        </span>
      </div>
    </div>
  );
};
