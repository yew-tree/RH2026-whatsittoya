import React from 'react';
import { SenderAnalysis } from '../types/analyzer';

interface SenderAnalysisCardProps {
  sender: SenderAnalysis;
  isLargeText: boolean;
}

export const SenderAnalysisCard: React.FC<SenderAnalysisCardProps> = ({
  sender,
  isLargeText,
}) => {
  const isMatch =
    sender.domainMatchStatus === 'verified_match' ||
    sender.postedOfficialEmailsMatch === true;

  const isMismatch =
    sender.domainMatchStatus === 'suspicious_lookalike' ||
    sender.domainMatchStatus === 'free_webmail_forgery' ||
    sender.domainMatchStatus === 'spoofed_impersonation' ||
    sender.postedOfficialEmailsMatch === false;

  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-[4px] p-6 sm:p-7 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1A1A1A]/10 gap-2">
        <div>
          <span className="font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-[#1A1A1A]/60 block mb-1">
            Section 03 • Origin & Website Verification
          </span>
          <h3 className="font-serif-editorial text-2xl font-bold tracking-tight text-[#1A1A1A]">
            Who Sent It: Does the real website match?
          </h3>
        </div>

        <span
          className={`font-mono-editorial text-[10px] uppercase tracking-[0.14em] font-bold px-2.5 py-1 rounded-[2px] border self-start sm:self-auto ${
            isMatch
              ? 'text-[#2E7D32] bg-[#2E7D32]/5 border-[#2E7D32]/30'
              : isMismatch
              ? 'text-[#C62828] bg-[#C62828]/5 border-[#C62828]/30'
              : 'text-[#1A1A1A]/70 bg-[#1A1A1A]/5 border-[#1A1A1A]/20'
          }`}
        >
          {isMatch
            ? '✅ Official Domain Confirmed'
            : isMismatch
            ? '⚠️ Sender Address Mismatch'
            : 'ℹ️ Standard Sender Domain'}
        </span>
      </div>

      {/* Comparison: Name Claimed vs Actual Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-[#FAFAFA] border border-[#1A1A1A]/10 rounded-[2px]">
          <span className="font-mono-editorial text-[10px] uppercase tracking-[0.12em] text-[#1A1A1A]/60 font-bold block mb-1">
            Claimed Entity
          </span>
          <div className="text-sm font-bold text-[#1A1A1A]">
            {sender.claimedOrganization}
          </div>
          <div className="text-xs text-[#1A1A1A]/60 mt-1 font-mono-editorial">
            DISPLAY: "{sender.displayName}"
          </div>
        </div>

        <div
          className={`p-4 rounded-[2px] border ${
            isMatch
              ? 'bg-[#F5FBF6] border-[#2E7D32]/30'
              : isMismatch
              ? 'bg-[#FFF9F9] border-[#C62828]/30'
              : 'bg-[#FAFAFA] border-[#1A1A1A]/10'
          }`}
        >
          <span className="font-mono-editorial text-[10px] uppercase tracking-[0.12em] text-[#1A1A1A]/60 font-bold block mb-1">
            Actual Sending Address
          </span>
          <div className="text-sm font-bold font-mono-editorial text-[#1A1A1A] break-all">
            {sender.senderEmail || 'No valid address detected'}
          </div>
          <div className="text-xs text-[#1A1A1A]/60 mt-1 font-mono-editorial">
            DOMAIN: {sender.senderDomain || 'N/A'}
          </div>
        </div>
      </div>

      {/* Primary requirement: "matches the email posted on their website online" */}
      <div className="bg-[#FAFAFA] border border-[#1A1A1A]/10 p-5 rounded-[2px] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span className="font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-[#2A5B52] font-bold">
            Website Alignment Audit
          </span>
          {sender.officialWebsite && (
            <a
              href={sender.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-editorial text-xs text-[#2A5B52] underline font-bold"
            >
              {sender.officialWebsite} ↗
            </a>
          )}
        </div>

        <p className="text-xs sm:text-sm text-[#1A1A1A]/90 leading-relaxed font-sans">
          {sender.websiteMatchAnalysis}
        </p>

        {sender.officialContactEmails && sender.officialContactEmails.length > 0 && (
          <div className="pt-3 border-t border-[#1A1A1A]/10">
            <span className="font-mono-editorial text-[10px] uppercase tracking-[0.12em] text-[#1A1A1A]/60 font-bold block mb-1.5">
              Official addresses published on their corporate website:
            </span>
            <div className="flex flex-wrap gap-2">
              {sender.officialContactEmails.map((email, idx) => (
                <span
                  key={idx}
                  className="font-mono-editorial text-xs px-2.5 py-1 rounded-[2px] bg-white border border-[#1A1A1A]/10 text-[#2E7D32] font-bold"
                >
                  ✓ {email}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reply-To Redirect Warning */}
      {sender.replyToMismatch && (
        <div className="bg-[#FFFBF5] border-l-4 border-l-[#EF6C00] border border-[#1A1A1A]/10 p-4 rounded-[2px] text-xs text-[#1A1A1A]/90 font-sans">
          <strong className="text-[#EF6C00] block mb-0.5">Routing Redirect Notice:</strong> If you press "Reply", your email is configured to route to <code>{sender.replyToEmail}</code>, bypassing the visible sender. Do not reply.
        </div>
      )}
    </div>
  );
};
