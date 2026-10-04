import React from 'react';
import { InfoDensityLevel } from '../types/analyzer';

export interface AdaSettings {
  textSize: 'standard' | 'large' | 'extra-large';
  highContrast: boolean;
  easyReadSpacing: boolean;
  reducedMotion: boolean;
  infoDensity: InfoDensityLevel;
}

interface AdaToolbarProps {
  settings: AdaSettings;
  onChange: (settings: AdaSettings) => void;
  onAnnounce: (msg: string) => void;
  onOpenSettings?: () => void;
}

export const AdaToolbar: React.FC<AdaToolbarProps> = ({
  settings,
  onChange,
  onAnnounce,
  onOpenSettings,
}) => {
  const handleTextSizeChange = (size: AdaSettings['textSize']) => {
    onChange({ ...settings, textSize: size });
    onAnnounce(`Text size set to ${size}`);
  };

  const toggleContrast = () => {
    const next = !settings.highContrast;
    onChange({ ...settings, highContrast: next });
    onAnnounce(next ? 'High contrast mode enabled' : 'Standard contrast mode enabled');
  };

  const toggleSpacing = () => {
    const next = !settings.easyReadSpacing;
    onChange({ ...settings, easyReadSpacing: next });
    onAnnounce(next ? 'Easy-read reading spacing enabled' : 'Standard reading spacing enabled');
  };

  return (
    <div
      role="region"
      aria-label="Accessibility Bar"
      className="bg-[#FAFAFA] border-b border-[#E0E2E7] py-2 px-4 sm:px-8 text-xs font-sans text-[#5F6368]"
    >
      <div className="max-w-[1500px] mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#202124]">Accessibility Options</span>
          <span className="text-[#BDC1C6]">•</span>
          <span>ADA Standard</span>
        </div>

        {/* Accessibility Display Controls (no detail selector on front page) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Text Size Stepper */}
          <div
            className="flex items-center gap-1 bg-white border border-[#DADCE0] rounded-md p-0.5"
            role="group"
            aria-label="Text Size Controls"
          >
            <span className="px-2 text-[11px] text-[#5F6368] font-medium">Text:</span>
            <button
              onClick={() => handleTextSizeChange('standard')}
              className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                settings.textSize === 'standard'
                  ? 'bg-[#1A73E8] text-white'
                  : 'text-[#3C4043] hover:bg-[#F1F3F4]'
              }`}
              aria-pressed={settings.textSize === 'standard'}
            >
              A
            </button>
            <button
              onClick={() => handleTextSizeChange('large')}
              className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                settings.textSize === 'large'
                  ? 'bg-[#1A73E8] text-white'
                  : 'text-[#3C4043] hover:bg-[#F1F3F4]'
              }`}
              aria-pressed={settings.textSize === 'large'}
            >
              A+
            </button>
            <button
              onClick={() => handleTextSizeChange('extra-large')}
              className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                settings.textSize === 'extra-large'
                  ? 'bg-[#1A73E8] text-white'
                  : 'text-[#3C4043] hover:bg-[#F1F3F4]'
              }`}
              aria-pressed={settings.textSize === 'extra-large'}
            >
              A++
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleContrast}
            className={`px-3 py-1 rounded-md border text-xs font-medium cursor-pointer transition-colors ${
              settings.highContrast
                ? 'bg-[#202124] text-white border-[#202124]'
                : 'bg-white border-[#DADCE0] text-[#3C4043] hover:bg-[#F1F3F4]'
            }`}
            aria-pressed={settings.highContrast}
          >
            {settings.highContrast ? '✓ High Contrast' : 'Contrast'}
          </button>

          {/* Spacing Toggle */}
          <button
            onClick={toggleSpacing}
            className={`px-3 py-1 rounded-md border text-xs font-medium cursor-pointer transition-colors ${
              settings.easyReadSpacing
                ? 'bg-[#1A73E8] text-white border-[#1A73E8]'
                : 'bg-white border-[#DADCE0] text-[#3C4043] hover:bg-[#F1F3F4]'
            }`}
            aria-pressed={settings.easyReadSpacing}
          >
            {settings.easyReadSpacing ? '✓ Relaxed Spacing' : 'Spacing'}
          </button>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="px-3 py-1 rounded-md bg-white border border-[#DADCE0] text-xs font-medium text-[#1A73E8] hover:bg-[#F8Fafd] cursor-pointer flex items-center gap-1"
            >
              <span>⚙️</span>
              <span>Settings & Features</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
