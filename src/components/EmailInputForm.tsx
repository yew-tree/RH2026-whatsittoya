import React, { useState } from 'react';
import { parseRawEmailHeadersAndBody } from '../services/heuristicAnalyzer';

interface EmailInputFormProps {
  sender: string;
  setSender: (val: string) => void;
  replyTo: string;
  setReplyTo: (val: string) => void;
  subject: string;
  setSubject: (val: string) => void;
  body: string;
  setBody: (val: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  onClear: () => void;
  isLargeText: boolean;
  isVerifiedSafe?: boolean;
  hasOutput?: boolean;
}

export const EmailInputForm: React.FC<EmailInputFormProps> = ({
  sender,
  setSender,
  replyTo,
  setReplyTo,
  subject,
  setSubject,
  body,
  setBody,
  onAnalyze,
  isLoading,
  onClear,
  isLargeText,
  isVerifiedSafe = false,
  hasOutput = false,
}) => {
  const [activeTab, setActiveTab] = useState<'raw' | 'guided' | 'file'>('raw');
  const [rawText, setRawText] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);

  // Keep rawText cleared when form is reset
  React.useEffect(() => {
    if (!sender && !subject && !body && rawText) {
      setRawText('');
    }
  }, [sender, subject, body, rawText]);

  const handleApplyRaw = (text: string) => {
    setRawText(text);
    const parsed = parseRawEmailHeadersAndBody(text);
    if (parsed.sender) setSender(parsed.sender);
    if (parsed.replyTo) setReplyTo(parsed.replyTo);
    if (parsed.subject) setSubject(parsed.subject);
    if (parsed.body) setBody(parsed.body);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleApplyRaw(content);
        setActiveTab('raw');
      }
    };
    reader.onerror = () => {
      setFileError('Could not read this file. Please make sure it is a valid email or text file.');
    };
    reader.readAsText(file);
  };

  const handleClearForm = () => {
    setRawText('');
    onClear();
  };

  const canAnalyze = (sender.trim() || subject.trim() || body.trim() || rawText.trim()) && !isLoading;

  return (
    <section className="bg-white border border-[#1A1A1A]/10 rounded-[4px] p-6 sm:p-7 mb-8 shadow-xs">
      {/* Top Header with Editorial Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#1A1A1A]/10">
        <div className="font-mono-editorial text-[11px] uppercase tracking-[0.14em] text-[#1A1A1A]/80 font-bold">
          Safety Input Panel
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('raw')}
            className={`font-mono-editorial text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-[2px] cursor-pointer transition-colors ${
              activeTab === 'raw'
                ? 'bg-[#1A1A1A] text-white'
                : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
            }`}
          >
            Paste
          </button>
          <button
            onClick={() => setActiveTab('guided')}
            className={`font-mono-editorial text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-[2px] cursor-pointer transition-colors ${
              activeTab === 'guided'
                ? 'bg-[#1A1A1A] text-white'
                : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
            }`}
          >
            Fields
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`font-mono-editorial text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-[2px] cursor-pointer transition-colors ${
              activeTab === 'file'
                ? 'bg-[#1A1A1A] text-white'
                : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
            }`}
          >
            File Upload
          </button>

          <button
            onClick={handleClearForm}
            className="font-mono-editorial text-[10px] uppercase tracking-[0.1em] text-[#1A1A1A]/40 hover:text-[#C62828] ml-2 cursor-pointer"
          >
            [Clear]
          </button>
        </div>
      </div>

      {activeTab === 'guided' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-mono-editorial text-[10px] uppercase tracking-[0.12em] text-[#1A1A1A]/70 font-semibold">
                Sender Address
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g. PayPal Customer Support <service-alert@paypa1.com>"
                className={`bg-[#FAFAFA] border border-[#1A1A1A]/10 rounded-[2px] p-3 text-[#1A1A1A] focus:outline-1 focus:outline-[#1A1A1A] font-sans ${
                  isLargeText ? 'text-base' : 'text-sm'
                }`}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono-editorial text-[10px] uppercase tracking-[0.12em] text-[#1A1A1A]/70 font-semibold">
                Reply-To Address (Optional)
              </label>
              <input
                type="text"
                value={replyTo}
                onChange={(e) => setReplyTo(e.target.value)}
                placeholder="e.g. billing-disputes@mail-tracker92.info"
                className={`bg-[#FAFAFA] border border-[#1A1A1A]/10 rounded-[2px] p-3 text-[#1A1A1A] focus:outline-1 focus:outline-[#1A1A1A] font-sans ${
                  isLargeText ? 'text-base' : 'text-sm'
                }`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono-editorial text-[10px] uppercase tracking-[0.12em] text-[#1A1A1A]/70 font-semibold">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. URGENT: Your PayPal account will be closed in 12 hours"
              className={`bg-[#FAFAFA] border border-[#1A1A1A]/10 rounded-[2px] p-3 text-[#1A1A1A] focus:outline-1 focus:outline-[#1A1A1A] font-sans ${
                isLargeText ? 'text-base' : 'text-sm'
              }`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono-editorial text-[10px] uppercase tracking-[0.12em] text-[#1A1A1A]/70 font-semibold">
              Email Content
            </label>
            <textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Paste email text here..."
              className={`bg-[#FAFAFA] border border-[#1A1A1A]/10 rounded-[2px] p-3 text-[#1A1A1A] focus:outline-1 focus:outline-[#1A1A1A] font-sans leading-relaxed ${
                isLargeText ? 'text-base' : 'text-sm'
              }`}
            />
          </div>
        </div>
      )}

      {activeTab === 'raw' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-mono-editorial text-[10px] uppercase tracking-[0.12em] text-[#1A1A1A]/70 font-semibold block">
              Paste Email (Message Text, Subject, or Full Headers)
            </label>
            <span className="font-mono-editorial text-[10px] text-[#1A1A1A]/40 uppercase tracking-[0.1em] hidden sm:inline">
              Single-field quick paste
            </span>
          </div>
          <textarea
            rows={8}
            value={rawText || (body ? (sender || subject ? `From: ${sender}\nSubject: ${subject}\n\n${body}` : body) : '')}
            onChange={(e) => handleApplyRaw(e.target.value)}
            placeholder="Paste your email here... You can paste the entire email, headers, subject line, or message text directly from your email client."
            className={`w-full bg-[#FAFAFA] border border-[#1A1A1A]/10 rounded-[2px] p-3 text-[#1A1A1A] focus:outline-1 focus:outline-[#1A1A1A] font-sans leading-relaxed ${
              isLargeText ? 'text-base' : 'text-sm'
            }`}
          />
        </div>
      )}

      {activeTab === 'file' && (
        <div className="border border-dashed border-[#1A1A1A]/20 rounded-[2px] p-8 text-center bg-[#FAFAFA]">
          <input
            type="file"
            accept=".eml,.txt,.msg"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <span className="font-mono-editorial text-xs uppercase tracking-[0.12em] font-bold text-[#1A1A1A] mb-1">
              Select or Drop Email File (.eml / .txt)
            </span>
            <p className="text-xs text-[#1A1A1A]/60 max-w-sm mb-4">
              Exported from your mail client. Will be processed safely right here.
            </p>
            <span className="px-4 py-2 border-[1.5px] border-[#1A1A1A] text-xs font-semibold uppercase tracking-[0.06em] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors">
              Browse Files
            </span>
          </label>
          {fileError && (
            <div className="mt-3 text-xs text-[#C62828] font-mono-editorial">
              {fileError}
            </div>
          )}
        </div>
      )}

      {/* Footer Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 mt-5 border-t border-[#1A1A1A]/10">
        <div>
          {isVerifiedSafe && !isLoading ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#137333] bg-[#E6F4EA] border border-[#34A853]/40 px-3.5 py-2 rounded-[4px] shadow-2xs">
              <span className="text-[#1E8E3E] text-base font-bold leading-none" aria-hidden="true">✓</span>
              <span>This has been a verified safe email</span>
            </div>
          ) : (
            <span className="font-mono-editorial text-[11px] uppercase tracking-[0.14em] text-[#1A1A1A]/60">
              100% Safe & Private Verification
            </span>
          )}
        </div>

        <button
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className={`px-6 py-3 rounded-[2px] font-semibold uppercase tracking-[0.08em] text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            canAnalyze
              ? 'bg-[#1A1A1A] hover:bg-[#2A5B52] text-white shadow-xs'
              : 'bg-[#1A1A1A]/10 text-[#1A1A1A]/30 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/30 border-t-white" aria-hidden="true"></span>
              <span>Reloading Verification...</span>
            </>
          ) : hasOutput ? (
            <>
              <span aria-hidden="true">🔄</span>
              <span>Reload / Re-verify This Email</span>
            </>
          ) : (
            'Check This Email For Me'
          )}
        </button>
      </div>
    </section>
  );
};
