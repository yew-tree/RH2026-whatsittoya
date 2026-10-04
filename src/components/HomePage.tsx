import React from 'react';
import { ChevronRight } from 'lucide-react';
import { PageId } from './SiteHeader';
import { Button, Section } from './ui';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onTryExample: () => void;
}

const PRINCIPLES = [
  { word: 'Detect', text: 'Notice the warning signs that scammers leave in messages and requests.' },
  { word: 'Interrupt', text: 'Slow down suspicious requests at the moment they matter.' },
  { word: 'Protect', text: 'Verify through official channels, and bring in someone you trust.' },
  { word: 'Educate', text: 'Understand how the manipulation works, so you can spot it next time.' },
];

const START: Array<{ page: PageId; title: string; text: string }> = [
  { page: 'check', title: 'Check a Message', text: 'Paste an email or text and see what we notice.' },
  { page: 'pause', title: 'Pause Before You Pay', text: 'Answer a few questions before sending money or information.' },
  { page: 'learn', title: 'Learn to Spot a Scam', text: 'Plain guides to common scams and the tactics behind them.' },
  { page: 'practice', title: 'Would You Trust This?', text: 'Practice with realistic, made-up scam scenarios.' },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onTryExample }) => (
  <div>
    <header className="border-b border-line pb-7" style={{ borderBottomWidth: 'var(--bw)' }}>
      <h1 id="page-title" tabIndex={-1} className="text-[2rem] font-bold leading-tight tracking-tight focus:outline-none">
        WhatsItToYa?
      </h1>
      <p className="mt-1 text-[1.15rem] font-semibold text-brand">Stop. Check. Protect.</p>
      <p className="t-lead mt-4">
        Scammers create pressure. We help you slow down and verify before you act.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button onClick={() => onNavigate('check')}>Check a Message</Button>
        <Button variant="secondary" onClick={() => onNavigate('pause')}>
          Pause Before You Pay
        </Button>
        <Button variant="link" onClick={onTryExample}>
          See an example scam
        </Button>
      </div>
    </header>

    <Section id="protects" title="How WhatsItToYa? protects you" first className="!mt-7">
      <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <div key={p.word}>
            <dt className="t-sub">{p.word}</dt>
            <dd className="mt-0.5 text-muted">{p.text}</dd>
          </div>
        ))}
      </dl>
    </Section>

    <Section id="start" title="Where to start">
      <ul className="divided rounded-md border border-line" style={{ borderWidth: 'var(--bw)' }}>
        {START.map((item) => (
          <li key={item.page}>
            <button
              type="button"
              onClick={() => onNavigate(item.page)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left hover:bg-brand-soft"
            >
              <span>
                <span className="block font-semibold">{item.title}</span>
                <span className="t-small block">{item.text}</span>
              </span>
              <ChevronRight size={20} className="flex-shrink-0 text-muted" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </Section>

    <Section id="about" title="About the name">
      <p className="max-w-2xl">
        When someone you did not expect asks for your money, your passwords, or your trust, stop and ask them: “What’s it
        to ya?” Why do you need this, and who are you really? A genuine organization can wait while you check.
      </p>
      <p className="t-small mt-3 max-w-2xl">
        WhatsItToYa? looks for common warning signs. It cannot guarantee that any message is genuine, so it never calls a
        message safe. For anything involving money or personal information, check using contact details you find yourself.
      </p>
    </Section>
  </div>
);
