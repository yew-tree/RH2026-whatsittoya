import React from 'react';
import { SAMPLE_EMAILS } from '../data/sampleEmails';
import { SampleEmail } from '../types/analyzer';

interface SamplePickerProps {
  selectedId: string | null;
  onSelectSample: (sample: SampleEmail) => void;
  isLargeText: boolean;
}

export const SamplePicker: React.FC<SamplePickerProps> = ({
  selectedId,
  onSelectSample,
  isLargeText,
}) => {
  return (
    <div className="mb-6">
      <div className="text-xs uppercase font-bold tracking-wide text-[#5F6368] mb-3">
        Try an Example Email
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SAMPLE_EMAILS.map((sample) => {
          const isSelected = selectedId === sample.id;
          const isSuspicious = Boolean(sample.keywordFlag && sample.keywordFlag.includes('Fraudulent'));

          return (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className={`text-left p-4 rounded-[8px] border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#E8F0FE] border-[#1A73E8] shadow-xs'
                  : 'bg-white border-[#DADCE0] hover:border-[#1A73E8]/50 hover:bg-[#F8Fafd]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  {/* If suspicious, show * Possibly Fraudulent in red text. If normal, show nothing! */}
                  {isSuspicious ? (
                    <span className="text-xs font-bold text-[#D93025] bg-[#FCE8E6] px-2 py-0.5 rounded">
                      * Possibly Fraudulent
                    </span>
                  ) : (
                    <span className="text-xs text-[#5F6368] font-medium">
                      Standard Email
                    </span>
                  )}

                  <span className="text-[11px] text-[#5F6368]">
                    {sample.categoryLabel}
                  </span>
                </div>

                <div
                  className={`font-medium leading-snug mb-1 text-[#202124] ${
                    isLargeText ? 'text-base' : 'text-sm'
                  }`}
                >
                  {sample.title}
                </div>

                <div className="text-xs text-[#5F6368] leading-relaxed line-clamp-2">
                  {sample.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
