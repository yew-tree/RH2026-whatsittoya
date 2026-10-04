import React from 'react';

interface HeaderProps {
  onOpenLookup: () => void;
  educationalUrl?: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLookup,
  educationalUrl = 'https://consumer.ftc.gov/scams',
  searchQuery = '',
  onSearchChange,
  onOpenSettings,
}) => {
  return (
    <header className="bg-white border-b border-[#E0E2E7] sticky top-0 z-30 px-4 sm:px-8 py-3">
      <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Friendly Google-colored Shield Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8] font-bold text-lg shadow-2xs">
              🛡️
            </div>
            <div>
              <span className="font-semibold text-lg text-[#202124] tracking-tight block leading-tight">
                Friendly Web Safety
              </span>
              <span className="text-[11px] text-[#5F6368] font-normal">
                Integrated Inbox Protection
              </span>
            </div>
          </div>
        </div>

        {/* Center: Familiar Gmail-style Search Bar */}
        <div className="w-full md:max-w-xl mx-auto">
          <div className="relative flex items-center bg-[#F1F3F4] hover:bg-[#EAEBEF] focus-within:bg-white focus-within:shadow-md focus-within:ring-1 focus-within:ring-[#1A73E8] rounded-full transition-all px-4 py-2">
            <svg
              className="w-5 h-5 text-[#5F6368] mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search in mail"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full bg-transparent text-sm text-[#202124] placeholder-[#5F6368] focus:outline-none"
            />
          </div>
        </div>

        {/* Right: Quick actions, Educational Link, Settings & Profile */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={onOpenLookup}
            className="px-3.5 py-1.5 border border-[#DADCE0] text-xs font-medium rounded-full bg-white text-[#3C4043] hover:bg-[#F8F9FA] transition-colors cursor-pointer hidden sm:inline-block"
          >
            Official Websites
          </button>

          <a
            href={educationalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-[#1A73E8] hover:bg-[#174EA6] text-white text-xs font-medium rounded-full transition-colors inline-flex items-center gap-1 shadow-2xs"
          >
            Educational Website ↗
          </a>

          {/* Settings button */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="w-8 h-8 rounded-full border border-[#DADCE0] hover:bg-[#F1F3F4] text-[#5F6368] flex items-center justify-center text-sm transition-colors cursor-pointer"
              title="Settings & Features"
              aria-label="Settings and Features"
            >
              ⚙️
            </button>
          )}

          {/* User Avatar Circle */}
          <div
            className="w-8 h-8 rounded-full bg-[#1E8E3E] text-white flex items-center justify-center font-bold text-xs shadow-xs ml-0.5"
            title="User Account"
          >
            M
          </div>
        </div>
      </div>
    </header>
  );
};
