import React from 'react';
import { OverallAnalysisResult } from '../types/analyzer';

interface EditorialSidebarProps {
  result: OverallAnalysisResult | null;
  isLargeText: boolean;
  educationalUrl?: string;
}

export const EditorialSidebar: React.FC<EditorialSidebarProps> = ({
  result,
  isLargeText,
  educationalUrl = 'https://consumer.ftc.gov/scams',
}) => {
  const officialChannel = result?.safeOfficialChannels;

  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      {/* What To Do Now Card */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 rounded-[4px] shadow-xs">
        <h3 className="font-serif-editorial text-2xl font-bold tracking-tight text-[#1A1A1A] mb-5">
          What To Do Now
        </h3>

        <div className="flex flex-col gap-5">
          <div>
            <span className="font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-[#1A1A1A] font-bold block mb-1">
              Step 01
            </span>
            <p className="font-bold text-[#1A1A1A] text-sm mb-0.5">Breathe.</p>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
              You are completely safe. Nothing bad has happened to your computer or your accounts just from opening an email.
            </p>
          </div>

          <div className="pt-4 border-t border-[#1A1A1A]/10">
            <span className="font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-[#1A1A1A] font-bold block mb-1">
              Step 02
            </span>
            <p className="font-bold text-[#1A1A1A] text-sm mb-0.5">Delete the email.</p>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
              It is 100% safe to simply delete it. Legitimate companies never rely solely on an unexpected email for critical issues.
            </p>
          </div>

          <div className="pt-4 border-t border-[#1A1A1A]/10">
            <span className="font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-[#1A1A1A] font-bold block mb-1">
              Step 03
            </span>
            <p className="font-bold text-[#1A1A1A] text-sm mb-0.5">Go directly to the source.</p>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
              {officialChannel ? (
                <>
                  If you want to check, visit{' '}
                  <a
                    href={officialChannel.authenticUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold text-[#2A5B52] hover:text-[#1A1A1A]"
                  >
                    {officialChannel.authenticUrl}
                  </a>{' '}
                  manually in your web browser.
                </>
              ) : (
                'If you are worried, open a new browser tab and type the official company website yourself, or call the phone number on your card.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Educational Website Card */}
      <div className="bg-[#1A1A1A] text-white p-6 rounded-[4px] shadow-xs">
        <span className="font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-white/60 font-bold block mb-2">
          [Educational Resource]
        </span>
        <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-4">
          Want to learn how these tricks work and see real consumer examples? Visit our dedicated educational guide.
        </p>
        <a
          href={educationalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 border border-white text-xs font-mono-editorial uppercase font-bold tracking-[0.08em] text-white hover:bg-white hover:text-[#1A1A1A] transition-colors"
        >
          Visit Educational Website ↗
        </a>
      </div>

      {/* Official Verified Contact if present */}
      {officialChannel && (
        <div className="bg-[#FAFAFA] border border-[#1A1A1A]/10 p-5 rounded-[4px]">
          <span className="font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-[#2A5B52] font-bold block mb-1.5">
            Verified Directory Match
          </span>
          <div className="text-xs font-bold text-[#1A1A1A] mb-1">
            {officialChannel.brand}
          </div>
          <div className="text-xs text-[#1A1A1A]/70 leading-relaxed">
            Support contact: <span className="font-mono font-medium">{officialChannel.authenticContact}</span>
          </div>
        </div>
      )}
    </aside>
  );
};
