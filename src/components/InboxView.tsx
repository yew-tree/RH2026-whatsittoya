import React, { useState } from 'react';
import { SampleEmail, OverallAnalysisResult, InfoDensityLevel } from '../types/analyzer';
import { AgentCopilotBar } from './AgentCopilotBar';
import { EmailViewerWithHighlights } from './EmailViewerWithHighlights';

interface InboxViewProps {
  emails: SampleEmail[];
  selectedEmail: SampleEmail | null;
  onSelectEmail: (email: SampleEmail) => void;
  result: OverallAnalysisResult | null;
  isLoading: boolean;
  isLargeText: boolean;
  isLinksDisarmed: boolean;
  onToggleDisarmLinks: () => void;
  onQuarantineEmail: (emailId: string) => void;
  onOpenLookup: () => void;
  quarantinedIds: Set<string>;
  infoDensity: InfoDensityLevel;
  educationalUrl?: string;
  onComposeClick?: () => void;
  onOpenSettings?: () => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  emails,
  selectedEmail,
  onSelectEmail,
  result,
  isLoading,
  isLargeText,
  isLinksDisarmed,
  onToggleDisarmLinks,
  onQuarantineEmail,
  onOpenLookup,
  quarantinedIds,
  infoDensity,
  educationalUrl = 'https://consumer.ftc.gov/scams',
  onComposeClick,
  onOpenSettings,
}) => {
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'fraudulent' | 'quarantine'>('inbox');
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());

  const toggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter based on folder
  const nonQuarantined = emails.filter((e) => !quarantinedIds.has(e.id));
  const fraudulentEmails = nonQuarantined.filter((e) => e.keywordFlag && e.keywordFlag.includes('Fraudulent'));
  const quarantinedEmails = emails.filter((e) => quarantinedIds.has(e.id));

  const displayList =
    activeFolder === 'fraudulent'
      ? fraudulentEmails
      : activeFolder === 'quarantine'
      ? quarantinedEmails
      : nonQuarantined;

  const isScam = Boolean(result?.keywordFlag?.isSuspicious);

  return (
    <div className="bg-white border border-[#DADCE0] rounded-[12px] shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[720px]">
      {/* Left Gmail-style Navigation Sidebar */}
      <aside className="w-full md:w-60 bg-[#F6F8FC] p-3 border-b md:border-b-0 md:border-r border-[#E0E2E7] flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Compose / Test button */}
          <div className="mb-4 pt-1">
            <button
              onClick={onComposeClick}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#F8Fafd] border border-[#DADCE0] shadow-sm hover:shadow transition-all text-[#3C4043] font-medium py-3 px-4 rounded-2xl cursor-pointer text-sm"
            >
              <svg className="w-5 h-5 text-[#EA4335]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Test / Paste Email</span>
            </button>
          </div>

          {/* Folder List */}
          <nav className="space-y-0.5 text-sm font-medium" aria-label="Mail Folders">
            {/* Inbox */}
            <button
              onClick={() => setActiveFolder('inbox')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-r-full text-left transition-colors cursor-pointer ${
                activeFolder === 'inbox'
                  ? 'bg-[#D3E3FD] text-[#041E49] font-bold'
                  : 'text-[#444746] hover:bg-[#EAEBEF]'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z"/>
                </svg>
                <span>Inbox</span>
              </div>
              <span className="text-xs bg-[#041E49]/10 px-2 py-0.5 rounded-full">
                {nonQuarantined.length}
              </span>
            </button>

            {/* Possibly Fraudulent folder */}
            <button
              onClick={() => setActiveFolder('fraudulent')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-r-full text-left transition-colors cursor-pointer ${
                activeFolder === 'fraudulent'
                  ? 'bg-[#FCE8E6] text-[#B71C1C] font-bold'
                  : 'text-[#D93025] hover:bg-[#FCE8E6]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold">⚠️</span>
                <span>Flagged</span>
              </div>
              <span className="text-xs bg-[#D93025] text-white px-2 py-0.5 rounded-full font-bold">
                {fraudulentEmails.length}
              </span>
            </button>

            {/* Quarantined Trash */}
            <button
              onClick={() => setActiveFolder('quarantine')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-r-full text-left transition-colors cursor-pointer ${
                activeFolder === 'quarantine'
                  ? 'bg-[#D3E3FD] text-[#041E49] font-bold'
                  : 'text-[#444746] hover:bg-[#EAEBEF]'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Trash ({quarantinedIds.size})</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer with Settings link */}
        <div className="pt-4 border-t border-[#E0E2E7] mt-4 space-y-2">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#3C4043] hover:bg-[#EAEBEF] cursor-pointer transition-colors"
            >
              <span>⚙️</span>
              <span>Settings & Features</span>
            </button>
          )}

          <div className="text-[11px] text-[#5F6368] leading-tight px-3 pt-1">
            <span className="font-semibold text-[#202124] block mb-0.5">Friendly Web Safety</span>
            <span>Opening email is always safe.</span>
          </div>
        </div>
      </aside>

      {/* Center & Right: Two-pane layout */}
      <div className="flex-1 flex flex-col md:flex-row min-w-0">
        {/* Email Thread List */}
        <div className="w-full md:w-[360px] lg:w-[400px] border-r border-[#E0E2E7] flex flex-col flex-shrink-0 bg-white">
          {/* Top Mail List Toolbar */}
          <div className="p-3 border-b border-[#E0E2E7] bg-[#FAFAFA] flex items-center justify-between text-xs text-[#5F6368]">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-[#1A73E8]" readOnly />
              <span className="font-medium text-[#444746] capitalize">{activeFolder}</span>
            </div>
            <span>{displayList.length} messages</span>
          </div>

          {/* Email Item Rows */}
          <div className="divide-y divide-[#F1F3F4] overflow-y-auto max-h-[660px]">
            {displayList.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#5F6368]">
                No messages in this folder.
              </div>
            ) : (
              displayList.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                const isStarred = starredIds.has(email.id);
                const isEmailScam = Boolean(email.keywordFlag && email.keywordFlag.includes('Fraudulent'));

                return (
                  <button
                    key={email.id}
                    onClick={() => onSelectEmail(email)}
                    className={`w-full text-left p-3.5 transition-colors cursor-pointer flex flex-col relative ${
                      isSelected
                        ? 'bg-[#E8F0FE]'
                        : isEmailScam
                        ? 'bg-[#FFFBFB] hover:bg-[#FCE8E6]/40'
                        : 'bg-white hover:bg-[#F2F6FC]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 truncate">
                        <span
                          onClick={(e) => toggleStar(e, email.id)}
                          className={`text-sm cursor-pointer ${
                            isStarred ? 'text-[#F4B400]' : 'text-[#BDC1C6] hover:text-[#5F6368]'
                          }`}
                        >
                          ★
                        </span>
                        <span className={`text-xs font-semibold truncate ${isSelected ? 'text-[#1A73E8]' : 'text-[#202124]'}`}>
                          {email.sender.split('<')[0].trim()}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#5F6368] flex-shrink-0">
                        10:42 AM
                      </span>
                    </div>

                    {/* Subject line:
                        1. If scam: marked as fraudulent (* Possibly Fraudulent)
                        2. If not scam: left alone completely! */}
                    <div className="text-xs truncate font-medium text-[#202124] mb-0.5 flex items-center">
                      {isEmailScam && (
                        <span className="text-[#D93025] font-bold text-[11px] bg-[#FCE8E6] border border-[#F28B82]/50 px-1.5 py-0.5 rounded mr-1.5 flex-shrink-0">
                          * Possibly Fraudulent
                        </span>
                      )}
                      <span className="truncate">{email.subject}</span>
                    </div>

                    {/* Body snippet */}
                    <div className="text-[11px] text-[#5F6368] truncate">
                      {email.body.replace(/\n/g, ' ')}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Reading Pane on Right */}
        <div className="flex-1 p-5 lg:p-6 overflow-y-auto bg-[#F8F9FA] flex flex-col">
          {isLoading ? (
            <div className="bg-white border border-[#DADCE0] p-12 text-center rounded-[8px] my-auto">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A73E8] mb-3"></div>
              <p className="text-sm font-medium text-[#202124]">Checking email...</p>
            </div>
          ) : selectedEmail && result ? (
            <div className="space-y-4 max-w-4xl mx-auto w-full">
              {/* IF AN EMAIL IS A SCAM:
                  1. Mark as fraudulent (* Possibly Fraudulent)
                  2. Brief explanation as to why AFTER clicking in
                  3. Reassure that simply opening won't make them unsafe
                  4. Provide a "Learn More" link for those curious about phishing

                  IF NOT A SCAM:
                  Leave it be! AgentCopilotBar returns null and no extra UI is rendered. */}
              {isScam ? (
                <AgentCopilotBar
                  result={result}
                  isLinksDisarmed={isLinksDisarmed}
                  onToggleDisarmLinks={onToggleDisarmLinks}
                  onQuarantineEmail={() => onQuarantineEmail(selectedEmail.id)}
                  onOpenLookup={onOpenLookup}
                  educationalUrl={educationalUrl}
                />
              ) : (
                <div
                  role="status"
                  aria-label="Verified safe email"
                  className="bg-[#E6F4EA] border border-[#34A853] rounded-[8px] p-4 sm:p-5 flex items-center justify-between gap-3 text-[#137333] shadow-xs mb-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#1E8E3E] text-2xl sm:text-3xl font-bold leading-none" aria-hidden="true">
                      ✓
                    </span>
                    <div>
                      <span className="text-[#137333] font-bold text-sm sm:text-base block">
                        This has been a verified safe email
                      </span>
                      <p className="text-xs text-[#1E8E3E] mt-0.5">
                        No fraudulent links, suspicious sender addresses, or deceptive tactics were detected.
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block px-3 py-1 bg-[#CEEAD6] text-[#0D652D] text-xs font-semibold rounded-full">
                    Verified Safe
                  </span>
                </div>
              )}

              {/* If user enabled "Detailed Breakdown" in Settings, show deeper analysis when scam is opened */}
              {isScam && infoDensity === 'detailed' && (
                <div className="bg-white border border-[#DADCE0] rounded-[8px] p-4 text-xs text-[#3C4043] space-y-2.5">
                  <div className="flex items-center justify-between font-semibold text-[#202124] border-b border-[#F1F3F4] pb-2">
                    <span>Detailed Inspection (Enabled in Settings)</span>
                    <button
                      onClick={onOpenSettings}
                      className="text-[#1A73E8] hover:underline font-normal cursor-pointer"
                    >
                      Change in Settings
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1">
                    <div className="bg-[#F8F9FA] p-2.5 rounded border border-[#DADCE0]">
                      <span className="text-[10px] text-[#5F6368] font-bold uppercase block mb-1">Tone Pressure</span>
                      <span className="font-semibold text-[#D93025]">
                        {result.tone.urgencyLevel.toUpperCase()} ({result.tone.urgencyScore}/100)
                      </span>
                    </div>

                    <div className="bg-[#F8F9FA] p-2.5 rounded border border-[#DADCE0]">
                      <span className="text-[10px] text-[#5F6368] font-bold uppercase block mb-1">Sender Match</span>
                      <span className="font-semibold text-[#D93025]">
                        {result.sender.domainMatchStatus.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="bg-[#F8F9FA] p-2.5 rounded border border-[#DADCE0]">
                      <span className="text-[10px] text-[#5F6368] font-bold uppercase block mb-1">Links Inspected</span>
                      <span className="font-semibold text-[#202124]">
                        {result.information.totalLinks} links ({result.information.suspiciousLinksCount} suspicious)
                      </span>
                    </div>
                  </div>

                  {result.tone.languageAndSpelling?.hasMisspellings && (
                    <div className="bg-[#FFF8E1] border border-[#FFE082] p-2.5 rounded text-[11px] text-[#5D4037]">
                      <strong>Language quirks: </strong>
                      {result.tone.languageAndSpelling.summary}
                    </div>
                  )}
                </div>
              )}

              {/* Standard, familiar email viewer (Clean Gmail look) */}
              <EmailViewerWithHighlights
                sender={selectedEmail.sender}
                replyTo={selectedEmail.replyTo}
                subject={selectedEmail.subject}
                body={selectedEmail.body}
                result={result}
                isLargeText={isLargeText}
                isLinksDisarmed={isLinksDisarmed}
              />
            </div>
          ) : (
            <div className="bg-white border border-[#DADCE0] p-12 text-center rounded-[8px] my-auto">
              <p className="text-sm text-[#5F6368]">Select an email to read.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
