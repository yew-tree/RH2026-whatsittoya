import React, { useState } from 'react';
import { Menu, ShieldCheck, X } from 'lucide-react';
import { AccessibilitySettings } from '../services/accessibility';
import { AccessibilityMenu } from './AccessibilityMenu';

export type PageId = 'home' | 'check' | 'pause' | 'learn' | 'practice';

export const NAV_ITEMS: Array<{ id: PageId; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'check', label: 'Check a Message' },
  { id: 'pause', label: 'Pause Before You Pay' },
  { id: 'learn', label: 'Learn to Spot a Scam' },
  { id: 'practice', label: 'Would You Trust This?' },
];

interface SiteHeaderProps {
  page: PageId;
  onNavigate: (page: PageId) => void;
  settings: AccessibilitySettings;
  onSettingsChange: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ page, onNavigate, settings, onSettingsChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (id: PageId) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="border-b border-line bg-surface" style={{ borderBottomWidth: 'var(--bw)' }}>
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => go('home')}
          className="flex min-h-[2.75rem] cursor-pointer items-center gap-2.5 text-left"
          aria-label="WhatsItToYa? Stop. Check. Protect. Home"
        >
          <ShieldCheck size={30} strokeWidth={2} className="flex-shrink-0 text-brand" aria-hidden="true" />
          <span className="leading-tight">
            <span className="block text-[1.25rem] font-bold tracking-tight text-ink">WhatsItToYa?</span>
            <span className="t-small hidden sm:block">Stop. Check. Protect.</span>
          </span>
        </button>

        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-2 sm:flex sm:w-auto sm:items-center">
          <AccessibilityMenu settings={settings} onChange={onSettingsChange} />
          <button
            type="button"
            className="btn btn-secondary w-full sm:w-auto lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* Desktop navigation: a quiet tab row. The active page is marked with an underline. */}
      <nav aria-label="Main" className="hidden border-t border-line lg:block" style={{ borderTopWidth: 'var(--bw)' }}>
        <ul className="mx-auto flex max-w-4xl flex-wrap gap-x-1 px-4 sm:px-6">
          {NAV_ITEMS.map((item) => {
            const current = item.id === page;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => go(item.id)}
                  aria-current={current ? 'page' : undefined}
                  className={`-mb-px min-h-[2.9rem] cursor-pointer border-b-[3px] px-3 text-[0.97rem] ${
                    current
                      ? 'border-brand font-bold text-brand'
                      : 'border-transparent font-medium text-ink hover:border-line-strong hover:text-brand'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-line lg:hidden" style={{ borderTopWidth: 'var(--bw)' }}>
          <ul className="divided mx-auto max-w-4xl px-4 sm:px-6">
            {NAV_ITEMS.map((item) => {
              const current = item.id === page;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => go(item.id)}
                    aria-current={current ? 'page' : undefined}
                    className={`flex min-h-[3rem] w-full cursor-pointer items-center border-l-[3px] px-3 text-left text-[1.02rem] ${
                      current ? 'border-brand bg-brand-soft font-bold text-brand' : 'border-transparent font-medium'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
};
