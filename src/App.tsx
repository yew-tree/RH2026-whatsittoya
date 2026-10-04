import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InboxView } from './components/InboxView';
import { SamplePicker } from './components/SamplePicker';
import { EmailInputForm } from './components/EmailInputForm';
import { EmailViewerWithHighlights } from './components/EmailViewerWithHighlights';
import { AgentCopilotBar } from './components/AgentCopilotBar';
import { SettingsPage } from './components/SettingsPage';
import { WebsiteLookupModal } from './components/WebsiteLookupModal';
import { SAMPLE_EMAILS } from './data/sampleEmails';
import { SampleEmail, OverallAnalysisResult } from './types/analyzer';
import { AdaSettings } from './components/AdaToolbar';
import { runFullHeuristicAnalysis } from './services/heuristicAnalyzer';

export default function App() {
  // Mode: inbox, custom tester, or settings page
  const [appMode, setAppMode] = useState<'inbox' | 'custom' | 'settings'>('inbox');

  // Inbox selected email & safety analysis
  const [selectedInboxEmail, setSelectedInboxEmail] = useState<SampleEmail | null>(SAMPLE_EMAILS[0]);
  const [inboxAnalysisResult, setInboxAnalysisResult] = useState<OverallAnalysisResult | null>(null);
  const [isInboxLoading, setIsInboxLoading] = useState<boolean>(false);

  // Safety Input Panel / Custom Tester states — starts completely empty and clean!
  const [customSender, setCustomSender] = useState<string>('');
  const [customReplyTo, setCustomReplyTo] = useState<string>('');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [customBody, setCustomBody] = useState<string>('');
  const [customSelectedSample, setCustomSelectedSample] = useState<SampleEmail | null>(null);
  const [customAnalysisResult, setCustomAnalysisResult] = useState<OverallAnalysisResult | null>(null);
  const [isCustomLoading, setIsCustomLoading] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string | null>(null);

  // Link disarming & quarantine
  const [isLinksDisarmed, setIsLinksDisarmed] = useState<boolean>(true);
  const [quarantinedIds, setQuarantinedIds] = useState<Set<string>>(new Set());

  // Search filter query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Links
  const [showLookupModal, setShowLookupModal] = useState<boolean>(false);
  const educationalUrl = 'https://consumer.ftc.gov/scams';

  // ADA Standards State
  const [adaSettings, setAdaSettings] = useState<AdaSettings>({
    textSize: 'standard',
    highContrast: false,
    easyReadSpacing: false,
    reducedMotion: false,
    infoDensity: 'standard', // 'standard' (concise) or 'detailed'
  });
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('Friendly Web Safety is active.');

  const announce = (msg: string) => {
    setLiveAnnouncement(msg);
  };

  // Helper to fetch analysis from API with local heuristic fallback
  const fetchAnalysis = async (
    sSender: string,
    sReplyTo: string,
    sSubject: string,
    sBody: string
  ): Promise<OverallAnalysisResult> => {
    try {
      const response = await fetch('/api/analyze-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: sSender,
          replyTo: sReplyTo,
          subject: sSubject,
          body: sBody,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      console.warn('API call failed, running local heuristic fallback:', err);
      return runFullHeuristicAnalysis(sSender, sReplyTo || undefined, sSubject, sBody);
    }
  };

  // Analyze email selected in Inbox
  const runInboxAnalysis = async (sample: SampleEmail) => {
    setIsInboxLoading(true);
    announce('Checking incoming email for safety flags...');
    try {
      const data = await fetchAnalysis(sample.sender, sample.replyTo || '', sample.subject, sample.body);
      setInboxAnalysisResult(data);
      announce(
        data.keywordFlag?.isSuspicious
          ? 'Alert: Email marked as Possibly Fraudulent.'
          : 'Email checked: standard message.'
      );
    } finally {
      setIsInboxLoading(false);
    }
  };

  // Analyze email in the Safety Input Panel
  const runCustomAnalysis = async (
    sSender: string,
    sReplyTo: string,
    sSubject: string,
    sBody: string
  ) => {
    if (!sBody.trim() && !sSubject.trim()) {
      setCustomError('Please paste or type an email subject or message to inspect.');
      return;
    }

    setIsCustomLoading(true);
    setCustomError(null);
    // Reload output immediately: clears previous output so reload indicator displays
    setCustomAnalysisResult(null);
    announce('Reloading email safety verification...');

    try {
      const data = await fetchAnalysis(sSender, sReplyTo, sSubject, sBody);
      setCustomAnalysisResult(data);
      announce(
        data.keywordFlag?.isSuspicious
          ? 'Alert: Email marked as Possibly Fraudulent.'
          : 'Email checked: this has been verified safe.'
      );
    } finally {
      setIsCustomLoading(false);
    }
  };

  // On mount, auto-inspect initial email in inbox only (keeps custom input panel clean!)
  useEffect(() => {
    if (selectedInboxEmail) {
      runInboxAnalysis(selectedInboxEmail);
    }
  }, []);

  const handleSelectInboxEmail = (sample: SampleEmail) => {
    setSelectedInboxEmail(sample);
    runInboxAnalysis(sample);
  };

  const handleQuarantine = (emailId: string) => {
    setQuarantinedIds((prev) => new Set(prev).add(emailId));
    announce('Email successfully quarantined and removed from your active inbox.');
    const remaining = SAMPLE_EMAILS.filter((e) => e.id !== emailId && !quarantinedIds.has(e.id));
    if (remaining.length > 0) {
      handleSelectInboxEmail(remaining[0]);
    } else {
      setSelectedInboxEmail(null);
      setInboxAnalysisResult(null);
    }
  };

  // Open Safety Input Panel cleanly without pre-filled contents
  const handleOpenCustomTester = () => {
    setCustomSender('');
    setCustomReplyTo('');
    setCustomSubject('');
    setCustomBody('');
    setCustomSelectedSample(null);
    setCustomAnalysisResult(null);
    setCustomError(null);
    setAppMode('custom');
  };

  // Clear Safety Input Panel
  const handleClearCustom = () => {
    setCustomSelectedSample(null);
    setCustomSender('');
    setCustomReplyTo('');
    setCustomSubject('');
    setCustomBody('');
    setCustomAnalysisResult(null);
    setCustomError(null);
  };

  // Select an optional example inside the tester
  const handleSelectCustomSample = (sample: SampleEmail) => {
    setCustomSelectedSample(sample);
    setCustomSender(sample.sender);
    setCustomReplyTo(sample.replyTo || '');
    setCustomSubject(sample.subject);
    setCustomBody(sample.body);
    setCustomError(null);
    runCustomAnalysis(sample.sender, sample.replyTo || '', sample.subject, sample.body);
  };

  const isLarge = adaSettings.textSize === 'large' || adaSettings.textSize === 'extra-large';

  // Filter sample emails by search query if any
  const filteredEmails = SAMPLE_EMAILS.filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.subject.toLowerCase().includes(q) ||
      e.sender.toLowerCase().includes(q) ||
      e.body.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className={`min-h-screen bg-[#F6F8FC] text-[#202124] flex flex-col font-sans transition-all ${
        adaSettings.textSize === 'extra-large'
          ? 'text-lg'
          : adaSettings.textSize === 'large'
          ? 'text-base'
          : 'text-sm'
      } ${adaSettings.highContrast ? 'contrast-125' : ''} ${
        adaSettings.easyReadSpacing ? 'tracking-wide leading-loose' : ''
      }`}
    >
      {/* ADA Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:p-4 focus:bg-[#1A73E8] focus:text-white focus:fixed focus:top-0 focus:left-0 focus:z-50 text-xs font-bold uppercase shadow-lg rounded"
      >
        Skip to Main Content
      </a>

      {/* Screen Reader Live Region (ADA Requirement) */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Gmail-style Header Bar */}
      <Header
        onOpenLookup={() => setShowLookupModal(true)}
        educationalUrl={educationalUrl}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSettings={() => setAppMode('settings')}
      />

      {/* Main Mail Experience */}
      <main
        id="main-content"
        tabIndex={-1}
        className="max-w-[1500px] w-full mx-auto px-3 sm:px-6 py-4 flex-1 focus:outline-none"
      >
        {appMode === 'inbox' ? (
          <InboxView
            emails={filteredEmails}
            selectedEmail={selectedInboxEmail}
            onSelectEmail={handleSelectInboxEmail}
            result={inboxAnalysisResult}
            isLoading={isInboxLoading}
            isLargeText={isLarge}
            isLinksDisarmed={isLinksDisarmed}
            onToggleDisarmLinks={() => {
              const next = !isLinksDisarmed;
              setIsLinksDisarmed(next);
              announce(next ? 'Links disarmed and secured' : 'Links disarm shield turned off');
            }}
            onQuarantineEmail={handleQuarantine}
            onOpenLookup={() => setShowLookupModal(true)}
            quarantinedIds={quarantinedIds}
            infoDensity={adaSettings.infoDensity}
            educationalUrl={educationalUrl}
            onComposeClick={handleOpenCustomTester}
            onOpenSettings={() => setAppMode('settings')}
          />
        ) : appMode === 'settings' ? (
          <SettingsPage
            onBackToInbox={() => setAppMode('inbox')}
            infoDensity={adaSettings.infoDensity}
            onDensityChange={(level) =>
              setAdaSettings((prev: AdaSettings) => ({ ...prev, infoDensity: level }))
            }
            adaSettings={adaSettings}
            onAdaChange={setAdaSettings}
            isLinksDisarmed={isLinksDisarmed}
            onToggleDisarm={() => setIsLinksDisarmed(!isLinksDisarmed)}
            educationalUrl={educationalUrl}
          />
        ) : (
          <div className="bg-white border border-[#DADCE0] rounded-[12px] p-6 sm:p-8 max-w-4xl mx-auto shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F4]">
              <div>
                <button
                  onClick={() => setAppMode('inbox')}
                  className="text-xs font-semibold text-[#1A73E8] hover:underline mb-1 flex items-center gap-1 cursor-pointer"
                >
                  ← Back to Inbox
                </button>
                <h1 className="text-xl font-normal text-[#202124]">
                  Test / Inspect Any Email
                </h1>
                <p className="text-xs text-[#5F6368] mt-0.5">
                  Paste content or select an example below to check for fraudulent indicators.
                </p>
              </div>

              <button
                onClick={() => setAppMode('inbox')}
                className="px-3.5 py-1.5 bg-[#F1F3F4] hover:bg-[#E8EAED] text-xs font-medium rounded-full cursor-pointer text-[#3C4043]"
              >
                Close
              </button>
            </div>

            {/* Quick Example Picker (None selected by default so inputs start clean) */}
            <SamplePicker
              selectedId={customSelectedSample?.id || null}
              onSelectSample={handleSelectCustomSample}
              isLargeText={isLarge}
            />

            {/* Safety Input Panel — Clean and empty by default */}
            <EmailInputForm
              sender={customSender}
              setSender={(v) => {
                setCustomSender(v);
                setCustomSelectedSample(null);
              }}
              replyTo={customReplyTo}
              setReplyTo={(v) => {
                setCustomReplyTo(v);
                setCustomSelectedSample(null);
              }}
              subject={customSubject}
              setSubject={(v) => {
                setCustomSubject(v);
                setCustomSelectedSample(null);
              }}
              body={customBody}
              setBody={(v) => {
                setCustomBody(v);
                setCustomSelectedSample(null);
              }}
              onAnalyze={() => runCustomAnalysis(customSender, customReplyTo, customSubject, customBody)}
              isLoading={isCustomLoading}
              onClear={handleClearCustom}
              isLargeText={isLarge}
              isVerifiedSafe={Boolean(customAnalysisResult && !customAnalysisResult.keywordFlag?.isSuspicious)}
              hasOutput={Boolean(customAnalysisResult)}
            />

            {customError && (
              <div className="p-3 bg-[#FCE8E6] text-[#D93025] rounded text-xs">
                ⚠️ {customError}
              </div>
            )}

            {/* Reloading state: shows immediately when verification is re-run without requiring clear */}
            {isCustomLoading && (
              <div
                role="status"
                aria-live="polite"
                className="pt-6 border-t border-[#F1F3F4] text-center p-8 bg-[#F8F9FA] rounded-[8px] border border-[#DADCE0] space-y-2 animate-pulse"
              >
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A73E8] mb-2" aria-hidden="true"></div>
                <p className="text-sm font-semibold text-[#202124]">
                  Reloading email verification...
                </p>
                <p className="text-xs text-[#5F6368]">
                  Checking links, sender authenticity, urgency cues, and domain records.
                </p>
              </div>
            )}

            {/* If analyzed, show preview */}
            {!isCustomLoading && customAnalysisResult && (
              <div className="pt-4 border-t border-[#F1F3F4] space-y-4">
                {/* Shows alert banner if suspicious, or green check if verified safe! */}
                {customAnalysisResult.keywordFlag?.isSuspicious ? (
                  <AgentCopilotBar
                    result={customAnalysisResult}
                    isLinksDisarmed={isLinksDisarmed}
                    onToggleDisarmLinks={() => setIsLinksDisarmed(!isLinksDisarmed)}
                    onQuarantineEmail={() => {
                      handleClearCustom();
                      setAppMode('inbox');
                    }}
                    onOpenLookup={() => setShowLookupModal(true)}
                    educationalUrl={educationalUrl}
                  />
                ) : (
                  <div
                    role="status"
                    aria-label="Verified safe email"
                    className="bg-[#E6F4EA] border border-[#34A853] rounded-[8px] p-4 sm:p-5 flex items-center justify-between gap-3 text-[#137333] shadow-xs"
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

                <EmailViewerWithHighlights
                  sender={customSender}
                  replyTo={customReplyTo}
                  subject={customSubject}
                  body={customBody}
                  result={customAnalysisResult}
                  isLargeText={isLarge}
                  isLinksDisarmed={isLinksDisarmed}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Directory Modal */}
      <WebsiteLookupModal
        isOpen={showLookupModal}
        onClose={() => setShowLookupModal(false)}
        isLargeText={isLarge}
      />

      {/* Minimal clean footer */}
      <footer className="border-t border-[#E0E2E7] bg-white py-4 mt-6 text-xs text-[#5F6368]">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#202124]">Friendly Web Safety</span>
            <span className="text-[#80868B]">•</span>
            <span>Simple, respectful email safety for all.</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={educationalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1A73E8] hover:underline"
            >
              Consumer FTC Safety Guide ↗
            </a>
            <button
              onClick={() => setAppMode('settings')}
              className="text-[#1A73E8] hover:underline cursor-pointer"
            >
              Accessibility Settings
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
