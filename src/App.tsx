import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SiteHeader, PageId, NAV_ITEMS } from './components/SiteHeader';
import { HomePage } from './components/HomePage';
import { CheckPage } from './components/CheckPage';
import { PausePage } from './components/PausePage';
import { LearnPage } from './components/LearnPage';
import { PracticePage } from './components/PracticePage';
import { useMessageChecker } from './hooks/useMessageChecker';
import { DEMO_MESSAGE } from './data/demoMessage';
import {
  AccessibilitySettings,
  applyAccessibility,
  loadAccessibility,
  saveAccessibility,
} from './services/accessibility';

const PAGE_IDS = NAV_ITEMS.map((n) => n.id);
const FTC_URL = 'https://consumer.ftc.gov/scams';

function pageFromHash(): PageId {
  const id = window.location.hash.replace(/^#\/?/, '') as PageId;
  return PAGE_IDS.includes(id) ? id : 'home';
}

export default function App() {
  const [page, setPage] = useState<PageId>(pageFromHash);
  const [learnScamId, setLearnScamId] = useState<string | undefined>();
  const [settings, setSettings] = useState<AccessibilitySettings>(loadAccessibility);
  const checker = useMessageChecker();
  const firstRender = useRef(true);

  // Apply display options and remember them on this device.
  useEffect(() => {
    applyAccessibility(settings);
    saveAccessibility(settings);
  }, [settings]);

  // Keep the browser's Back and Forward buttons working.
  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // On every page change: update the tab title, scroll to top, and move focus to the page heading
  // so keyboard and screen-reader users land in the right place.
  useEffect(() => {
    const label = NAV_ITEMS.find((n) => n.id === page)?.label ?? 'Home';
    document.title = page === 'home' ? 'WhatsItToYa? Stop. Check. Protect.' : `${label} | WhatsItToYa?`;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    window.setTimeout(() => document.getElementById('page-title')?.focus(), 30);
  }, [page]);

  // Leaving Check a Message discards the pasted text and its result, so coming back
  // always starts with a blank box. Nothing is saved, so a refresh or closing the tab does too.
  const { clear: clearChecker } = checker;
  useEffect(() => {
    if (page !== 'check') clearChecker();
  }, [page, clearChecker]);

  const navigate = useCallback((next: PageId) => {
    if (next !== 'learn') setLearnScamId(undefined);
    if (window.location.hash === `#/${next}`) {
      setPage(next);
    } else {
      window.location.hash = `/${next}`;
    }
  }, []);

  const openLearn = useCallback(
    (scamId?: string) => {
      setLearnScamId(scamId);
      navigate('learn');
    },
    [navigate]
  );

  const tryExample = useCallback(() => {
    navigate('check');
    checker.loadExample(DEMO_MESSAGE);
  }, [navigate, checker]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only-focusable btn btn-primary fixed left-2 top-2 z-[60]"
      >
        Skip to main content
      </a>

      <SiteHeader page={page} onNavigate={navigate} settings={settings} onSettingsChange={setSettings} />

      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-4xl flex-1 px-3 py-6 focus:outline-none sm:px-6 sm:py-8">
        <div className="surface p-5 sm:p-8">
          {page === 'home' && <HomePage onNavigate={navigate} onTryExample={tryExample} />}
          {page === 'check' && <CheckPage checker={checker} onOpenLearn={openLearn} />}
          {page === 'pause' && <PausePage onNavigate={navigate} onOpenLearn={openLearn} />}
          {page === 'learn' && <LearnPage initialScamId={learnScamId} onNavigate={navigate} />}
          {page === 'practice' && <PracticePage onNavigate={navigate} />}
        </div>
      </main>

      <footer className="border-t border-line bg-surface" style={{ borderTopWidth: 'var(--bw)' }}>
        <div className="mx-auto flex max-w-4xl flex-col gap-2 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p className="t-small max-w-xl">
            WhatsItToYa? looks for common warning signs. It cannot guarantee that any message is genuine, and it never
            sends messages on your behalf. A hackathon prototype.
          </p>
          <a href={FTC_URL} target="_blank" rel="noopener noreferrer" className="btn-link text-[0.95rem]">
            FTC scam guide (opens in a new tab)
          </a>
        </div>
      </footer>
    </div>
  );
}
