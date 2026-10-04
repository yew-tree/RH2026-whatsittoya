import React from 'react';
import { PageId } from './SiteHeader';
import { BigButton, Card } from './ui';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onTryExample: () => void;
}

const STEPS = [
  { word: 'Detect', icon: '🔍', text: 'We notice the warning signs scammers leave behind.' },
  { word: 'Interrupt', icon: '✋', text: 'When the risk is real, we ask you to pause before you act.' },
  { word: 'Protect', icon: '🤝', text: 'We help you bring in someone you trust, or check the request safely.' },
  { word: 'Educate', icon: '💡', text: 'We explain why it is suspicious, in plain words.' },
];

const DOORS: Array<{ page: PageId; icon: string; title: string; text: string; cta: string }> = [
  {
    page: 'check',
    icon: '🔍',
    title: 'Check a Message',
    text: 'Paste an email or text you are unsure about. We show what we noticed and what to do next.',
    cta: 'Check a message',
  },
  {
    page: 'pause',
    icon: '✋',
    title: 'Pause Before You Pay',
    text: 'Someone asking for money? Answer a few simple questions before you send anything.',
    cta: 'Pause before paying',
  },
  {
    page: 'learn',
    icon: '📘',
    title: 'Learn to Spot a Scam',
    text: 'Short, plain guides to the most common scams and the tricks behind them.',
    cta: 'Start learning',
  },
  {
    page: 'practice',
    icon: '🎯',
    title: 'Would You Trust This?',
    text: 'Try realistic make-believe scams. No scores to worry about, just practice.',
    cta: 'Practice now',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onTryExample }) => (
  <div className="space-y-10">
    <section aria-labelledby="page-title" className="rounded-3xl border-2 border-brand bg-brand-soft p-6 sm:p-10">
      <p className="text-xl font-bold text-brand">Welcome to</p>
      <h1 id="page-title" tabIndex={-1} className="mt-1 text-5xl font-extrabold leading-tight text-brand focus:outline-none sm:text-6xl">
        WhatsItToYa?
      </h1>
      <p className="mt-2 text-3xl font-extrabold text-ink">Stop. Check. Protect.</p>
      <p className="mt-5 max-w-3xl text-2xl text-ink">
        Scammers create pressure. We help you slow things down.
      </p>
      <p className="mt-3 max-w-3xl text-xl text-muted">
        Scammers want you to act before you think. WhatsItToYa? helps you slow down, spot the warning signs, and
        verify before you act.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <BigButton onClick={() => onNavigate('check')} className="text-xl">
          🔍 Check a message
        </BigButton>
        <BigButton variant="secondary" onClick={onTryExample} className="text-xl">
          See an example scam
        </BigButton>
      </div>
    </section>

    <section aria-labelledby="idea-heading">
      <h2 id="idea-heading" className="mb-2 text-3xl font-extrabold">
        Why “What’s it to ya?”
      </h2>
      <p className="max-w-3xl text-xl text-muted">
        When someone you did not expect asks for your money, your passwords, or your trust, stop and ask them:
        <strong className="text-ink"> “What’s it to ya?” </strong>
        Why do you need this, and who are you really? A real organization can wait while you check.
      </p>
    </section>

    <section aria-labelledby="how-heading">
      <h2 id="how-heading" className="mb-4 text-3xl font-extrabold">
        How it protects you
      </h2>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.word}>
            <Card as="div" className="h-full">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="text-4xl">
                  {s.icon}
                </span>
                <span className="text-sm font-extrabold uppercase tracking-wide text-muted">Step {i + 1}</span>
              </div>
              <h3 className="mt-2 text-2xl font-extrabold text-brand">{s.word}</h3>
              <p className="mt-1 text-lg">{s.text}</p>
            </Card>
          </li>
        ))}
      </ol>
    </section>

    <section aria-labelledby="start-heading">
      <h2 id="start-heading" className="mb-4 text-3xl font-extrabold">
        Where would you like to start?
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {DOORS.map((d) => (
          <Card key={d.page} as="div" className="flex flex-col">
            <h3 className="text-2xl font-extrabold">
              <span aria-hidden="true" className="mr-2">
                {d.icon}
              </span>
              {d.title}
            </h3>
            <p className="mb-5 mt-2 flex-1 text-lg text-muted">{d.text}</p>
            <BigButton variant="secondary" onClick={() => onNavigate(d.page)} aria-label={`${d.cta}: ${d.title}`}>
              {d.cta} →
            </BigButton>
          </Card>
        ))}
      </div>
    </section>

    <Card tone="warn" aria-label="An honest note">
      <h2 className="text-2xl font-extrabold">An honest note</h2>
      <p className="mt-2 text-lg">
        WhatsItToYa? looks for common warning signs. It cannot promise to catch every scam, and it will never tell you
        a message is “safe”. If anyone unexpectedly asks for money, codes, or passwords, always check using contact
        details you find yourself.
      </p>
    </Card>
  </div>
);
