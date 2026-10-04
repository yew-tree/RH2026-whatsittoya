import React from 'react';
import { InfoDensityLevel } from '../types/analyzer';
import { AdaSettings } from './AdaToolbar';

interface SettingsPageProps {
  onBackToInbox: () => void;
  infoDensity: InfoDensityLevel;
  onDensityChange: (level: InfoDensityLevel) => void;
  adaSettings: AdaSettings;
  onAdaChange: (settings: AdaSettings) => void;
  isLinksDisarmed: boolean;
  onToggleDisarm: () => void;
  educationalUrl?: string;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onBackToInbox,
  infoDensity,
  onDensityChange,
  adaSettings,
  onAdaChange,
  isLinksDisarmed,
  onToggleDisarm,
  educationalUrl = 'https://consumer.ftc.gov/scams',
}) => {
  return (
    <div className="bg-white border border-[#DADCE0] rounded-[12px] p-6 sm:p-10 max-w-4xl mx-auto shadow-sm space-y-8">
      {/* Header with Back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F1F3F4] gap-4">
        <div>
          <button
            onClick={onBackToInbox}
            className="text-xs font-semibold text-[#1A73E8] hover:underline mb-2 flex items-center gap-1 cursor-pointer"
          >
            ← Back to Inbox
          </button>
          <h1 className="text-2xl font-normal text-[#202124]">
            Settings & Safety Features
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6368] mt-1">
            Choose whether to view safety warnings in more detail and customize how Friendly Web Safety protects you.
          </p>
        </div>

        <button
          onClick={onBackToInbox}
          className="px-4 py-2 bg-[#1A73E8] hover:bg-[#174EA6] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          Done & Return to Mail
        </button>
      </div>

      {/* Feature Section 1: Explanation Detail Choice */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[#202124] flex items-center gap-2">
            <span>🔍</span>
            <span>Explanation & Detail Level</span>
          </h2>
          <p className="text-xs text-[#5F6368] mt-0.5">
            Decide how much information appears when you open a flagged fraudulent email.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option A: Concise / Standard */}
          <div
            onClick={() => onDensityChange('standard')}
            className={`p-4 rounded-[8px] border-2 cursor-pointer transition-all flex flex-col justify-between ${
              infoDensity !== 'detailed'
                ? 'border-[#1A73E8] bg-[#E8F0FE]/40'
                : 'border-[#DADCE0] hover:border-[#BDC1C6] bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-[#202124]">
                  Concise & Friendly (Recommended)
                </span>
                {infoDensity !== 'detailed' && (
                  <span className="text-xs font-bold text-[#1A73E8] bg-[#E8F0FE] px-2 py-0.5 rounded">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5F6368] leading-relaxed">
                Keeps things simple and calm. Gives you a short, plain-English reason why the email was flagged, reassures you that you are safe, and provides a Learn More link.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-[#1E8E3E] font-medium">
              ✓ No technical jargon or overwhelming scorecards.
            </div>
          </div>

          {/* Option B: Detailed Breakdown */}
          <div
            onClick={() => onDensityChange('detailed')}
            className={`p-4 rounded-[8px] border-2 cursor-pointer transition-all flex flex-col justify-between ${
              infoDensity === 'detailed'
                ? 'border-[#1A73E8] bg-[#E8F0FE]/40'
                : 'border-[#DADCE0] hover:border-[#BDC1C6] bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-[#202124]">
                  Detailed Breakdown
                </span>
                {infoDensity === 'detailed' && (
                  <span className="text-xs font-bold text-[#1A73E8] bg-[#E8F0FE] px-2 py-0.5 rounded">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5F6368] leading-relaxed">
                For users who want to inspect the details. Shows deep findings including exact urgency phrases, domain alignment checks, spelling/grammar analysis, and threat intelligence database matches.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-[#1A73E8] font-medium">
              ✓ Includes technical breakdown and spelling audit.
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2: Active Protection Features */}
      <section className="space-y-4 pt-4 border-t border-[#F1F3F4]">
        <div>
          <h2 className="text-base font-semibold text-[#202124] flex items-center gap-2">
            <span>🛡️</span>
            <span>Active Safety Features</span>
          </h2>
          <p className="text-xs text-[#5F6368] mt-0.5">
            Built-in defenses operating automatically inside your inbox.
          </p>
        </div>

        <div className="space-y-3">
          {/* Link Disarm Feature */}
          <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-[8px] border border-[#DADCE0]">
            <div className="pr-4">
              <div className="text-xs sm:text-sm font-semibold text-[#202124]">
                Automatic Link Disarm Shield
              </div>
              <p className="text-xs text-[#5F6368] mt-0.5">
                Temporarily disarms clickable links inside flagged emails to prevent accidental clicks while you read.
              </p>
            </div>
            <button
              onClick={onToggleDisarm}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                isLinksDisarmed
                  ? 'bg-[#1E8E3E] text-white'
                  : 'bg-[#DADCE0] text-[#3C4043]'
              }`}
            >
              {isLinksDisarmed ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Spelling and Grammar Scanning */}
          <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-[8px] border border-[#DADCE0]">
            <div>
              <div className="text-xs sm:text-sm font-semibold text-[#202124]">
                Misspelling & Phishing Syntax Detection
              </div>
              <p className="text-xs text-[#5F6368] mt-0.5">
                Automatically scans for telltale typos, awkward phrasing ("kindly do the needful"), and generic "Dear Customer" greetings.
              </p>
            </div>
            <span className="text-xs text-[#1E8E3E] font-semibold bg-[#E6F4EA] px-2.5 py-1 rounded-full">
              Always Active
            </span>
          </div>

          {/* Lookalike & Typosquatting Domain Matching */}
          <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-[8px] border border-[#DADCE0]">
            <div>
              <div className="text-xs sm:text-sm font-semibold text-[#202124]">
                Official Website Domain Verification
              </div>
              <p className="text-xs text-[#5F6368] mt-0.5">
                Compares the sender's actual email address against the verified official corporate website to detect lookalikes (e.g. paypa1.com).
              </p>
            </div>
            <span className="text-xs text-[#1E8E3E] font-semibold bg-[#E6F4EA] px-2.5 py-1 rounded-full">
              Always Active
            </span>
          </div>
        </div>
      </section>

      {/* Feature Section 3: Visual & Reading Preferences */}
      <section className="space-y-4 pt-4 border-t border-[#F1F3F4]">
        <div>
          <h2 className="text-base font-semibold text-[#202124] flex items-center gap-2">
            <span>👓</span>
            <span>Display & Accessibility</span>
          </h2>
          <p className="text-xs text-[#5F6368] mt-0.5">
            Adjust text size and contrast for comfortable reading.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onAdaChange({ ...adaSettings, textSize: 'standard' })}
            className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
              adaSettings.textSize === 'standard'
                ? 'border-[#1A73E8] bg-[#E8F0FE]/30'
                : 'border-[#DADCE0] hover:bg-[#F8F9FA]'
            }`}
          >
            <div className="text-xs font-semibold text-[#202124]">Standard Text</div>
            <div className="text-[11px] text-[#5F6368] mt-0.5">Default Gmail font size</div>
          </button>

          <button
            onClick={() => onAdaChange({ ...adaSettings, textSize: 'large' })}
            className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
              adaSettings.textSize === 'large'
                ? 'border-[#1A73E8] bg-[#E8F0FE]/30'
                : 'border-[#DADCE0] hover:bg-[#F8F9FA]'
            }`}
          >
            <div className="text-sm font-semibold text-[#202124]">Large Text (A+)</div>
            <div className="text-[11px] text-[#5F6368] mt-0.5">Easier on the eyes</div>
          </button>

          <button
            onClick={() => onAdaChange({ ...adaSettings, textSize: 'extra-large' })}
            className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
              adaSettings.textSize === 'extra-large'
                ? 'border-[#1A73E8] bg-[#E8F0FE]/30'
                : 'border-[#DADCE0] hover:bg-[#F8F9FA]'
            }`}
          >
            <div className="text-base font-semibold text-[#202124]">Extra Large (A++)</div>
            <div className="text-[11px] text-[#5F6368] mt-0.5">Maximum readability</div>
          </button>
        </div>
      </section>

      {/* Feature Section 4: Educational Guides */}
      <section className="pt-4 border-t border-[#F1F3F4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-semibold text-[#202124] block">
            Looking for more educational materials?
          </span>
          <span className="text-[#5F6368]">
            Learn how modern phishing scams operate and how to protect yourself and your family.
          </span>
        </div>

        <a
          href={educationalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-[#F1F3F4] hover:bg-[#E8EAED] text-[#1A73E8] font-semibold rounded-full inline-flex items-center gap-1 self-start sm:self-auto"
        >
          Educational Website ↗
        </a>
      </section>
    </div>
  );
};
