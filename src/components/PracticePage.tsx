import React, { useRef, useState } from 'react';
import { SCENARIOS } from '../data/scenarios';
import { TECHNIQUES } from '../data/techniques';
import { PageId } from './SiteHeader';
import { Bullets, Button, PageHeader, Section } from './ui';

interface PracticePageProps {
  onNavigate: (page: PageId) => void;
}

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const newOrders = () => Object.fromEntries(SCENARIOS.map((s) => [s.id, shuffled(s.choices.map((c) => c.id))]));

export const PracticePage: React.FC<PracticePageProps> = ({ onNavigate }) => {
  // Mix up the order of the answers so the safe choice is not always in the same place.
  const [orders, setOrders] = useState<Record<string, string[]>>(newOrders);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const scenario = SCENARIOS[index];
  const choiceId = picked[scenario.id];
  const choice = scenario.choices.find((c) => c.id === choiceId);
  const total = SCENARIOS.length;
  const safeCount = SCENARIOS.filter((s) => s.choices.find((c) => c.id === picked[s.id])?.safe).length;

  const choose = (id: string) => {
    if (choiceId) return; // one answer per scenario keeps the lesson clear
    setPicked((prev) => ({ ...prev, [scenario.id]: id }));
    window.setTimeout(() => {
      feedbackRef.current?.scrollIntoView({ block: 'nearest' });
      feedbackRef.current?.querySelector<HTMLElement>('h2')?.focus();
    }, 50);
  };

  const next = () => {
    if (index + 1 >= total) setFinished(true);
    else setIndex(index + 1);
    window.scrollTo({ top: 0 });
    window.setTimeout(() => document.getElementById('page-title')?.focus(), 30);
  };

  const restart = () => {
    setIndex(0);
    setPicked({});
    setFinished(false);
    setOrders(newOrders());
    window.scrollTo({ top: 0 });
  };

  if (finished) {
    return (
      <div className="wity-fade-in">
        <PageHeader
          title="Practice summary"
          lead="Every scenario is modeled on real scams that deceive careful people."
        />
        <p className="max-w-2xl text-[1.1rem]">
          You chose the safest response in <strong>{safeCount} of {total}</strong> scenarios. There is no passing score.
          The aim is to make the pattern familiar.
        </p>

        <Section id="remember" title="What to remember">
          <Bullets
            className="max-w-2xl"
            items={[
              'Pause. A genuine request can wait.',
              'Contact the person or company yourself, using details you already have or find on your own.',
              'Never pay with gift cards, cryptocurrency, or wire transfers because someone contacted you.',
              'Tell someone you trust, even if you were asked to keep it secret.',
            ]}
          />
        </Section>

        <div className="section flex flex-col gap-2 sm:flex-row">
          <Button onClick={restart}>Practice again</Button>
          <Button variant="secondary" onClick={() => onNavigate('learn')}>
            Learn about each scam
          </Button>
          <Button variant="secondary" onClick={() => onNavigate('check')}>
            Check a Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Would You Trust This?"
        lead="Realistic, made-up scam scenarios. Choose what you would do, then see what to look for."
      />

      <p className="t-meta mb-3" aria-live="polite">
        Scenario {index + 1} of {total}
      </p>
      <h2 id="scenario-title" className="t-section">
        {scenario.title}
      </h2>
      <p className="t-small mt-0.5">{scenario.channel}. This message is fictional.</p>

      <blockquote
        className="mt-4 whitespace-pre-wrap border-l-4 border-line-strong bg-subtle px-5 py-4 text-[1.05rem] leading-relaxed"
        aria-labelledby="scenario-title"
      >
        {scenario.message}
      </blockquote>

      <fieldset className="mt-6">
        <legend className="t-sub mb-3 text-[1.1rem]">{scenario.question}</legend>
        <div className="max-w-2xl space-y-2">
          {orders[scenario.id].map((id) => scenario.choices.find((c) => c.id === id)!).map((c) => {
            const isPicked = choiceId === c.id;
            const state = isPicked
              ? c.safe
                ? 'border-ok bg-ok-soft'
                : 'border-warn bg-warn-soft'
              : choiceId
              ? 'border-line bg-subtle text-muted'
              : 'border-line-strong bg-surface';
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => choose(c.id)}
                aria-pressed={isPicked}
                disabled={Boolean(choiceId) && !isPicked}
                className={`block w-full cursor-pointer rounded-md border px-4 py-3 text-left disabled:cursor-default ${state} ${
                  choiceId ? '' : 'hover:border-brand hover:bg-brand-soft'
                }`}
                style={{ borderWidth: 'var(--bw)' }}
              >
                {isPicked && <span className="t-meta mb-0.5 block">Your choice</span>}
                <span className={isPicked ? 'font-semibold' : ''}>{c.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div ref={feedbackRef} aria-live="polite">
        {choice && (
          <div className="wity-fade-in mt-6">
            <section aria-labelledby="feedback-heading" className={`callout ${choice.safe ? 'callout-ok' : 'callout-warn'}`}>
              <h2 id="feedback-heading" tabIndex={-1} className="t-sub focus:outline-none">
                {choice.safe ? 'This is the safest response' : 'This response carries risk'}
              </h2>
              <p className="mt-1 max-w-2xl">{choice.feedback}</p>
            </section>

            <Section id="signs" title="Warning signs">
              <Bullets items={scenario.warningSigns} className="max-w-2xl" />
            </Section>

            <Section id="tactics" title="Tactics used">
              <ul className="space-y-2">
                {scenario.techniques.map((t) => (
                  <li key={t} className="max-w-2xl">
                    <strong className="font-semibold">{TECHNIQUES[t].name}.</strong> {TECHNIQUES[t].explain}
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="instead" title="What to do instead">
              <Bullets items={scenario.doInstead} className="max-w-2xl" />
            </Section>

            <div className="section">
              <Button onClick={next}>{index + 1 >= total ? 'See summary' : 'Next scenario'}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
