import React, { useState } from 'react';
import { OverallAnalysisResult } from '../types/analyzer';

interface EmailViewerWithHighlightsProps {
  sender: string;
  replyTo?: string;
  subject: string;
  body: string;
  result: OverallAnalysisResult | null;
  isLargeText: boolean;
  isLinksDisarmed?: boolean;
}

export const EmailViewerWithHighlights: React.FC<EmailViewerWithHighlightsProps> = ({
  sender,
  replyTo,
  subject,
  body,
  result,
  isLargeText,
}) => {
  // State for the prompt modal when a link in a fraudulent email is clicked
  const [pendingLink, setPendingLink] = useState<string | null>(null);

  const isSuspicious = Boolean(result?.keywordFlag?.isSuspicious);

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    if (isSuspicious) {
      // Show confirmation prompt pop-up before opening
      setPendingLink(url);
    } else {
      // Normal email - open directly
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleConfirmOpen = () => {
    if (pendingLink) {
      window.open(pendingLink, '_blank', 'noopener,noreferrer');
      setPendingLink(null);
    }
  };

  const handleCancelOpen = () => {
    setPendingLink(null);
  };

  // Generate sender initial for the Gmail-style circular avatar
  const senderDisplayName = sender.split('<')[0].trim() || sender;
  const initial = senderDisplayName.charAt(0).toUpperCase() || 'M';

  // Deterministic avatar color based on initial
  const avatarColors = [
    'bg-[#1A73E8]',
    'bg-[#B31412]',
    'bg-[#137333]',
    'bg-[#E37400]',
    'bg-[#8430CE]',
    'bg-[#129EAF]',
  ];
  const colorIndex = (sender.charCodeAt(0) || 0) % avatarColors.length;
  const avatarColor = avatarColors[colorIndex];

  return (
    <div className="bg-white border border-[#DADCE0] rounded-[8px] overflow-hidden shadow-xs relative">
      {/* Gmail-style Email Header */}
      <div className="p-6 pb-4 border-b border-[#F1F3F4]">
        {/* Subject */}
        <h2 className="text-xl sm:text-2xl font-normal text-[#202124] mb-4">
          {subject || '(No Subject)'}
        </h2>

        {/* Sender details in Gmail layout */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {/* Circular Avatar */}
            <div
              className={`w-10 h-10 rounded-full ${avatarColor} text-white flex items-center justify-center font-bold text-base flex-shrink-0 shadow-xs`}
            >
              {initial}
            </div>

            <div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-semibold text-sm text-[#202124]">
                  {senderDisplayName}
                </span>
                <span className="text-xs text-[#5F6368] break-all font-mono">
                  {sender.includes('<') ? `<${sender.split('<')[1]}` : sender}
                </span>
              </div>

              <div className="text-xs text-[#5F6368] mt-0.5 flex items-center gap-1.5">
                <span>to me</span>
                {replyTo && (
                  <span className="text-[11px] text-[#80868B] font-mono">
                    (Reply-to: {replyTo})
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-xs text-[#5F6368] whitespace-nowrap pt-1">
            10:42 AM (3 hours ago)
          </div>
        </div>
      </div>

      {/* Email Body */}
      <div
        className={`p-6 sm:p-8 font-sans leading-relaxed text-[#202124] whitespace-pre-wrap ${
          isLargeText ? 'text-base' : 'text-sm'
        }`}
      >
        {body.split('\n').map((line, idx) => {
          // Check for URL patterns
          const urlMatch = line.match(/(https?:\/\/[^\s]+)/g);
          if (urlMatch && isSuspicious) {
            return (
              <div key={idx} className="my-2">
                {line.split(urlMatch[0]).map((part, pIdx, arr) => (
                  <React.Fragment key={pIdx}>
                    {part}
                    {pIdx < arr.length - 1 && (
                      <span className="inline-block my-1">
                        <button
                          onClick={(e) => handleLinkClick(e, urlMatch[0])}
                          className="text-[#D93025] underline font-semibold bg-[#FCE8E6] px-1.5 py-0.5 rounded cursor-pointer hover:opacity-80 break-all text-left"
                          title="Clicking this link will prompt for your safety"
                        >
                          {urlMatch[0]}
                        </button>
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            );
          } else if (urlMatch) {
            // Normal email links - clean blue Gmail link styling
            return (
              <div key={idx} className="my-1">
                {line.split(urlMatch[0]).map((part, pIdx, arr) => (
                  <React.Fragment key={pIdx}>
                    {part}
                    {pIdx < arr.length - 1 && (
                      <a
                        href={urlMatch[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1A73E8] underline hover:text-[#174EA6] break-all"
                      >
                        {urlMatch[0]}
                      </a>
                    )}
                  </React.Fragment>
                ))}
              </div>
            );
          }

          return <div key={idx} className="min-h-[1.25rem]">{line}</div>;
        })}
      </div>

      {/* Confirmation Modal when user clicks a fraudulent link */}
      {pendingLink && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="fraudulent-link-prompt"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs"
        >
          <div className="bg-white rounded-[12px] max-w-lg w-full p-6 shadow-2xl border border-[#DADCE0] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Header Icon + Exact Prompt from User */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FCE8E6] text-[#D93025] flex items-center justify-center font-bold text-xl flex-shrink-0">
                ⚠️
              </div>
              <div>
                <h3
                  id="fraudulent-link-prompt"
                  className="text-base sm:text-lg font-bold text-[#202124] leading-snug"
                >
                  This link has been marked as possibly fraudulent. Would you like to continue?
                </h3>
                <p className="text-xs text-[#5F6368] mt-1 leading-relaxed">
                  Friendly Web Safety recommends not opening this address, as it may be designed to mimic a trusted service or capture sensitive personal info.
                </p>
              </div>
            </div>

            {/* Destination URL Display */}
            <div className="p-3 bg-[#F8F9FA] rounded-[6px] border border-[#DADCE0] text-xs">
              <span className="text-[11px] font-semibold text-[#5F6368] block mb-1 uppercase tracking-wide">
                Destination Address:
              </span>
              <span className="font-mono text-[#D93025] break-all select-all font-medium">
                {pendingLink}
              </span>
            </div>

            {/* Safe & Continue Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
              <button
                onClick={handleConfirmOpen}
                className="w-full sm:w-auto px-4 py-2 border border-[#DADCE0] hover:bg-[#F1F3F4] text-xs font-semibold text-[#5F6368] rounded-full transition-colors cursor-pointer text-center"
              >
                Yes, Continue to Website
              </button>

              <button
                onClick={handleCancelOpen}
                autoFocus
                className="w-full sm:w-auto px-5 py-2.5 bg-[#1A73E8] hover:bg-[#174EA6] text-white text-xs font-bold rounded-full transition-colors cursor-pointer text-center shadow-xs"
              >
                Cancel & Stay Safe (Recommended)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
