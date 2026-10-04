import React from 'react';
import { ToneAnalysis } from '../types/analyzer';

interface ToneAnalysisCardProps {
  tone: ToneAnalysis;
  isLargeText: boolean;
}

export const ToneAnalysisCard: React.FC<ToneAnalysisCardProps> = ({ tone, isLargeText }) => {
  const isRushed = tone.urgencyScore >= 40;
  const lang = tone.languageAndSpelling;

  return (
    <div className="bg-white border border-[#DADCE0] rounded-[8px] p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F3F4] gap-2">
        <div>
          <span className="text-xs uppercase tracking-wide text-[#5F6368] font-bold block mb-1">
            Section 01 • Tone, Spelling & Language Audit
          </span>
          <h3 className="text-xl font-normal text-[#202124]">
            Tone & Phrasing: Urgency, Misspellings & Grammar
          </h3>
        </div>

        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-[4px] self-start sm:self-auto ${
            isRushed
              ? 'text-[#D93025] bg-[#FCE8E6]'
              : 'text-[#1E8E3E] bg-[#E6F4EA]'
          }`}
        >
          {isRushed ? '⚠️ High Urgency / Pressure' : 'Normal Tone'}
        </span>
      </div>

      {/* Primary Compound Warning: Urgency + Links */}
      {tone.urgencyWithLinksAmplifier && (
        <div className="bg-[#FCE8E6] border border-[#F28B82] p-4 rounded-[6px]">
          <h4 className="text-sm font-bold text-[#D93025] mb-1">
            Fake Countdown Clock + Action Links Right Below
          </h4>
          <p className="text-xs text-[#3C4043] leading-relaxed">
            This email pairs a stressful deadline (like "within 12 hours") directly with clickable links. <strong>This is a classic phishing formula:</strong> create panic so you click before checking with a friend. Real organizations never terminate accounts over 12-hour email notices.
          </p>
        </div>
      )}

      {/* Misspellings and Grammar Detection Section */}
      {lang && lang.hasMisspellings && (
        <div className="bg-[#FFF8E1] border border-[#FFE082] p-4 rounded-[6px]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">✍️</span>
            <h4 className="text-sm font-bold text-[#8D6E63]">
              Spelling & Grammar Quirks Detected
            </h4>
          </div>

          <p className="text-xs text-[#5D4037] mb-3 leading-relaxed">
            Phishing templates often contain spelling mistakes, awkward translations, or generic greetings because they originate from automated mass-mailing kits.
          </p>

          {/* Misspelled words list */}
          {lang.misspelledWords && lang.misspelledWords.length > 0 && (
            <div className="mb-3 space-y-1.5">
              <span className="text-[11px] font-bold text-[#795548] uppercase tracking-wide block">
                Flagged Misspellings:
              </span>
              <div className="flex flex-wrap gap-2">
                {lang.misspelledWords.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white border border-[#FFE082] px-2 py-1 rounded text-[#D93025] font-mono"
                  >
                    "{item.word}" → suggested: <span className="text-[#1E8E3E] font-bold">{item.suggestion}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Grammar & awkward phrasing list */}
          {lang.grammarOrInformalIssues && lang.grammarOrInformalIssues.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#795548] uppercase tracking-wide block">
                Awkward Syntax & Informality:
              </span>
              {lang.grammarOrInformalIssues.map((issue, idx) => (
                <div key={idx} className="bg-white/80 border border-[#FFE082] p-2.5 rounded text-xs">
                  <div className="font-bold text-[#202124] mb-0.5">{issue.issue}</div>
                  <div className="text-[#5F6368]">{issue.explanation}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary Box */}
      <div className="bg-[#F8F9FA] border border-[#DADCE0] p-4 rounded-[6px]">
        <span className="text-[11px] uppercase tracking-wide text-[#5F6368] font-bold block mb-1">
          Tone Summary
        </span>
        <p className="text-xs text-[#3C4043] leading-relaxed">
          {tone.summary}
        </p>
      </div>

      {/* Rushed words detected */}
      {tone.urgentPhrases && tone.urgentPhrases.length > 0 && (
        <div>
          <span className="text-xs uppercase tracking-wide text-[#5F6368] font-bold block mb-2">
            Flagged Pressure Phrases In Text:
          </span>
          <div className="flex flex-wrap gap-2">
            {tone.urgentPhrases.map((phrase, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-[4px] bg-[#FCE8E6] text-[#D93025] font-mono"
              >
                "{phrase.phrase}"
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Emotional triggers */}
      {tone.emotionalTriggers && tone.emotionalTriggers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {tone.emotionalTriggers.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#F8F9FA] border border-[#DADCE0] p-3.5 rounded-[6px]"
            >
              <div className="text-xs font-bold text-[#202124] mb-1">
                {t.trigger}
              </div>
              <p className="text-xs text-[#5F6368] leading-relaxed">
                {t.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
