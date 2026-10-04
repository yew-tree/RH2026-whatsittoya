import React from 'react';
import { InformationAnalysis } from '../types/analyzer';

interface InformationAnalysisCardProps {
  information: InformationAnalysis;
  isLargeText: boolean;
}

export const InformationAnalysisCard: React.FC<InformationAnalysisCardProps> = ({
  information,
  isLargeText,
}) => {
  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-[4px] p-6 sm:p-7 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1A1A1A]/10 gap-2">
        <div>
          <span className="font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-[#1A1A1A]/60 block mb-1">
            Section 02 • Link & Intelligence Inspection
          </span>
          <h3 className="font-serif-editorial text-2xl font-bold tracking-tight text-[#1A1A1A]">
            The Links: Where do the buttons really lead?
          </h3>
        </div>

        <span className="font-mono-editorial text-[10px] uppercase tracking-[0.14em] font-bold px-2.5 py-1 rounded-[2px] bg-[#FAFAFA] border border-[#1A1A1A]/10 text-[#1A1A1A]/70 self-start sm:self-auto">
          {information.totalLinks} {information.totalLinks === 1 ? 'Link Detected' : 'Links Detected'}
        </span>
      </div>

      {/* Online Threat / Scam Database Matches */}
      {information.knownThreatDatabaseMatches && information.knownThreatDatabaseMatches.length > 0 ? (
        <div className="bg-[#FFF9F9] border-l-4 border-l-[#C62828] border border-[#1A1A1A]/10 p-5 rounded-[2px] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-[#C62828] font-bold">
              [Scam Database Match]
            </span>
            <span className="font-mono-editorial text-[10px] uppercase tracking-[0.1em] text-[#C62828]">
              {information.knownThreatDatabaseMatches.length} Campaign Hit(s)
            </span>
          </div>

          <div className="space-y-2.5">
            {information.knownThreatDatabaseMatches.map((match, idx) => (
              <div key={idx} className="bg-white p-3.5 border border-[#1A1A1A]/10 rounded-[2px]">
                <div className="font-bold text-xs sm:text-sm text-[#1A1A1A]">
                  {match.matchedPattern}
                </div>
                <div className="text-xs text-[#1A1A1A]/70 mt-1 leading-relaxed">
                  {match.details}
                </div>
                <div className="font-mono-editorial text-[10px] text-[#1A1A1A]/50 mt-1 uppercase tracking-[0.06em]">
                  Registry: {match.database}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#F5FBF6] border-l-4 border-l-[#2E7D32] border border-[#1A1A1A]/10 p-4 rounded-[2px] text-xs text-[#1A1A1A]/80 font-sans">
          <strong className="text-[#2E7D32]">Watchlist Clear:</strong> This email does not match any known automated phishing signatures in current consumer defense feeds.
        </div>
      )}

      {/* Link Inspection Table */}
      <div>
        <span className="font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-[#1A1A1A]/70 font-bold block mb-3">
          Hyperlink Destination Audit:
        </span>

        {information.links.length === 0 ? (
          <div className="bg-[#FAFAFA] border border-[#1A1A1A]/10 p-4 rounded-[2px] text-center text-xs text-[#1A1A1A]/60">
            No clickable links detected in the email body.
          </div>
        ) : (
          <div className="space-y-3">
            {information.links.map((link, idx) => {
              const isFlagged = link.threatLevel !== 'safe' || link.isMismatch;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-[2px] border ${
                    isFlagged
                      ? 'bg-[#FFF9F9] border-l-4 border-l-[#C62828] border-[#1A1A1A]/10'
                      : 'bg-[#FAFAFA] border-l-4 border-l-[#2E7D32] border-[#1A1A1A]/10'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span
                      className={`font-mono-editorial text-[10px] uppercase tracking-[0.12em] font-bold px-2 py-0.5 rounded-[2px] border ${
                        isFlagged
                          ? 'text-[#C62828] bg-[#C62828]/5 border-[#C62828]/30'
                          : 'text-[#2E7D32] bg-[#2E7D32]/5 border-[#2E7D32]/30'
                      }`}
                    >
                      {isFlagged ? '⚠️ Tricky Target' : '✅ Standard Domain'}
                    </span>

                    {link.isMismatch && (
                      <span className="font-mono-editorial text-[10px] uppercase tracking-[0.1em] text-[#C62828] font-bold">
                        Anchor Text Mismatch!
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 font-mono-editorial text-xs">
                    {link.originalText !== link.url && (
                      <div className="text-[#1A1A1A]/60">
                        DISPLAY TEXT: <span className="text-[#1A1A1A] font-semibold">{link.originalText}</span>
                      </div>
                    )}
                    <div className="text-[#1A1A1A]/60 break-all">
                      TARGET URL: <span className="text-[#2A5B52] font-bold">{link.url}</span>
                    </div>
                  </div>

                  {link.riskReason && (
                    <div className="mt-2 text-xs text-[#1A1A1A]/80 bg-white p-2.5 rounded-[2px] border border-[#1A1A1A]/10 leading-relaxed font-sans">
                      💡 <strong>Note:</strong> {link.riskReason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
