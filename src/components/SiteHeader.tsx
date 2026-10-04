import React from 'react';
import { AccessibilitySettings } from '../services/accessibility';

export type PageId = 'home' | 'check' | 'pause' | 'learn' | 'practice';

export const NAV_ITEMS: Array<{ id: PageId; label: string; icon: string }> = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'check', label: 'Check a Message', icon: '🔍' },
  { id: 'pause', label: 'Pause Before You Pay', icon: '✋' },
  { id: 'learn', label: 'Learn', icon: '📘' },
  { id: 'practice', label: 'Practice', icon: '🎯' },
];

interface SiteHeaderProps {
  page: PageId;
  onNavigate: (page: PageId) => void;
  settings: AccessibilitySettings;
  onSettingsChange: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
}

const TEXT_SIZES: Array<{ id: AccessibilitySettings['textSize']; label: string; aria: string; cls: string }> = [
  { id: 'standard', label: 'A', aria: 'Standard text size', cls: 'text-base' },
  { id: 'large', label: 'A+', aria: 'Large text size', cls: 'text-xl' },
  { id: 'xl', label: 'A++', aria: 'Extra large text size', cls: 'text-2xl' },
];

const Toggle: React.FC<{ pressed: boolean; onClick: () => void; children: React.ReactNode }> = ({ pressed, onClick, children }) => (
  <button
    type="button"
    aria-pressed={pressed}
    onClick={onClick}
    className={`min-h-[2.75rem] cursor-pointer rounded-lg border-2 px-3 py-1 text-base font-bold ${
      pressed ? 'border-brand bg-brand text-on-brand' : 'border-line bg-card text-ink hover:bg-brand-soft'
    }`}
  >
    {pressed ? '✔ ' : ''}
    {children}
  </button>
);

export const SiteHeader: React.FC<SiteHeaderProps> = ({ page, onNavigate, settings, onSettingsChange }) => {
  const set = (patch: Partial<AccessibilitySettings>) => onSettingsChange((prev) => ({ ...prev, ...patch }));

  return (
    <header className="border-b-2 border-line bg-card">
      {/* Display options: always visible and always in the same place */}
      <div role="region" aria-label="Display options" className="border-b border-line bg-brand-soft">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 sm:px-6">
          <span className="text-base font-bold text-ink">Make it easier to read:</span>
          <div role="group" aria-label="Text size" className="flex gap-1">
            {TEXT_SIZES.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-label={s.aria}
                aria-pressed={settings.textSize === s.id}
                onClick={() => set({ textSize: s.id })}
                className={`min-h-[2.75rem] min-w-[3rem] cursor-pointer rounded-lg border-2 px-3 font-extrabold ${s.cls} ${
                  settings.textSize === s.id ? 'border-brand bg-brand text-on-brand' : 'border-line bg-card text-ink hover:bg-brand-soft'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <Toggle pressed={settings.highContrast} onClick={() => set({ highContrast: !settings.highContrast })}>
            High contrast
          </Toggle>
          <Toggle pressed={settings.roomySpacing} onClick={() => set({ roomySpacing: !settings.roomySpacing })}>
            More spacing
          </Toggle>
          <Toggle pressed={settings.reducedMotion} onClick={() => set({ reducedMotion: !settings.reducedMotion })}>
            Less motion
          </Toggle>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex cursor-pointer items-center gap-3 text-left"
            aria-label="WhatsItToYa? Stop. Check. Protect. Go to the home page"
          >
            <span
              aria-hidden="true"
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-3xl text-on-brand"
            >
              🛡️
            </span>
            <span>
              <span className="block text-3xl font-extrabold leading-none text-brand">WhatsItToYa?</span>
              <span className="block text-base font-semibold text-muted">Stop. Check. Protect.</span>
            </span>
          </button>

          <nav aria-label="Main">
            <ul className="flex flex-wrap gap-2">
              {NAV_ITEMS.map((item) => {
                const current = item.id === page;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate(item.id)}
                      aria-current={current ? 'page' : undefined}
                      className={`inline-flex min-h-[3.25rem] cursor-pointer items-center gap-2 rounded-xl border-2 px-4 py-2 text-lg font-bold ${
                        current ? 'border-brand bg-brand text-on-brand' : 'border-line bg-card text-ink hover:bg-brand-soft'
                      }`}
                    >
                      <span aria-hidden="true">{item.icon}</span>
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
