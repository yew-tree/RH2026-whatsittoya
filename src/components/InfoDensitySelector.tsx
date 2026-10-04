import React from 'react';
import { InfoDensityLevel } from '../types/analyzer';

interface InfoDensitySelectorProps {
  density: InfoDensityLevel;
  onChange: (level: InfoDensityLevel) => void;
  onAnnounce?: (msg: string) => void;
}

export const InfoDensitySelector: React.FC<InfoDensitySelectorProps> = ({
  density,
  onChange,
  onAnnounce,
}) => {
  const handleSelect = (level: InfoDensityLevel) => {
    onChange(level);
    if (onAnnounce) {
      onAnnounce(
        level === 'minimal'
          ? 'Switched to Simple view: showing just the one-word flag and direct safe action.'
          : level === 'detailed'
          ? 'Switched to Detailed view: showing full threat intelligence and domain breakdown.'
          : 'Switched to Standard view: showing key findings.'
      );
    }
  };

  return (
    <div
      role="group"
      aria-label="Information Detail Level"
      className="flex items-center gap-1.5 bg-white border border-[#1A1A1A]/20 p-1 rounded-[2px]"
    >
      <span className="font-mono-editorial text-[10px] uppercase font-bold text-[#1A1A1A]/60 px-2">
        Info Detail:
      </span>

      <button
        onClick={() => handleSelect('minimal')}
        aria-pressed={density === 'minimal'}
        title="Show just the one-word flag and a single safe action"
        className={`px-2.5 py-1 text-[11px] font-mono-editorial uppercase font-bold rounded-[2px] transition-colors cursor-pointer ${
          density === 'minimal'
            ? 'bg-[#1A1A1A] text-white'
            : 'text-[#1A1A1A]/70 hover:bg-[#1A1A1A]/5'
        }`}
      >
        Simple
      </button>

      <button
        onClick={() => handleSelect('standard')}
        aria-pressed={density === 'standard'}
        title="Show the key findings and 3-point check"
        className={`px-2.5 py-1 text-[11px] font-mono-editorial uppercase font-bold rounded-[2px] transition-colors cursor-pointer ${
          density === 'standard'
            ? 'bg-[#1A1A1A] text-white'
            : 'text-[#1A1A1A]/70 hover:bg-[#1A1A1A]/5'
        }`}
      >
        Standard
      </button>

      <button
        onClick={() => handleSelect('detailed')}
        aria-pressed={density === 'detailed'}
        title="Show full in-depth inspection and threat intelligence breakdown"
        className={`px-2.5 py-1 text-[11px] font-mono-editorial uppercase font-bold rounded-[2px] transition-colors cursor-pointer ${
          density === 'detailed'
            ? 'bg-[#1A1A1A] text-white'
            : 'text-[#1A1A1A]/70 hover:bg-[#1A1A1A]/5'
        }`}
      >
        Detailed
      </button>
    </div>
  );
};
