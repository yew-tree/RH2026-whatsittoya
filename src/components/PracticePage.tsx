import React, { useRef, useState } from 'react';
import { SCENARIOS } from '../data/scenarios';
import { TECHNIQUES } from '../data/techniques';
import { PageId } from './SiteHeader';
import { BigButton, BulletList, Card, PageTitle, SectionHeading } from './ui';

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

export const PracticePage: React.FC<PracticePageProps> = ({ onNavigate }) => {
  // Mix up the order of the answers so the safe choice is not always in the same place.
  const [orders, setOrders] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(SCENARIOS.map((s) => [s.id, shuffled(s.choices.map((c) => c.id))]))
  );
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
      feedbackRef.current?.scrollIntoView({ block: 'start' });
      feedbackRef.current?.querySelector<HTMLElement>('h2')?.focus();
    }, 50);
  };

  const next = () => {
    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex(index + 1);
    }
    window.scrollTo({ top: 0 });
    window.setTimeout(() => document.getElementById('page-title')?.focus(), 30);
  };

  const restart = () => {
    setIndex(0);
    setPicked({});
    setFinished(false);
    setOrders(Object.fromEntries(SCENARIOS.map((s) => [s.id, shuffled(s.choices.map((c) => c.id))])));
    window.scrollTo({ top: 0 });
  };

  if (finished) {
    return (
      <div className="space-y-6">
        <PageTitle icon="🎉" title="Nice work practicing" subtitle="Every scenario here is based on real scams that fool smart, careful people every day." />
        <Card tone="brand" aria-labelledby="summary-heading">
          <SectionHeading id="summary-heading">
            You chose the safest response {safeCount} out of {total} times
          </SectionHeading>
          <p className="text-xl">
            There is no pass or fail. Practice is how these tricks become easy to recognize. The safest moves were nearly
            always the same: stop, do not use the contact details in the message, and check another way.
          </p>
        </Card>
        <Card aria-labelledby="recap-heading">
          <SectionHeading id="recap-heading">What to remember</SectionHeading>
          <BulletList
            className="text-xl"
            items={[
              'Pause. Real requests can wait.',
              'Contact the person or company yourself, using details you already have or find on your own.',
              'Never pay with gift cards, crypto, or wire transfers because someone contacted you.',
              'Tell someone you trust, even if you were asked to keep it secret.',
            ]}
          />
        </Card>
        <div className="flex flex-col gap-3 sm:flex-row">
          <BigButton onClick={restart}>Practice again</BigButton>
          <BigButton variant="secondary" onClick={() => onNavigate('learn')}>
            📘 Learn about each scam
          </BigButton>
          <BigButton variant="secondary" onClick={() => onNavigate('check')}>
            🔍 Check a message
          </BigButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle
        icon="🎯"
        title="Would You Trust This?"
        subtitle="Realistic make-believe scams. Choose what you would do. There are no wrong answers here, only things to learn."
      />

      <p className="text-lg font-extrabold uppercase tracking-wide text-muted" aria-live="polite">
        Scenario {index + 1} of {total}
      </p>

      <Card aria-labelledby="scenario-title">
        <h2 id="scenario-title" className="text-2xl font-extrabold">
          <span aria-hidden="true" className="mr-2">
            {scenario.icon}
          </span>
          {scenario.title}
        </h2>
        <p className="mt-1 text-lg font-bold text-muted">{scenario.channel} (made-up example)</p>
        <blockquote className="mt-4 whitespace-pre-wrap rounded-2xl border-l-8 border-brand bg-paper p-5 text-xl leading-relaxed">
          {scenario.message}
        </blockquote>
      </Card>

      <fieldset className="space-y-3">
        <legend className="mb-3 text-2xl font-extrabold">{scenario.question}</legend>
        {orders[scenario.id].map((id) => scenario.choices.find((c) => c.id === id)!).map((c) => {
          const isPicked = choiceId === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => choose(c.id)}
              aria-pressed={isPicked}
              disabled={Boolean(choiceId) && !isPicked}
              className={`w-full cursor-pointer rounded-2xl border-2 p-5 text-left text-xl font-bold disabled:cursor-default ${
                isPicked
                  ? c.safe
                    ? 'border-ok bg-ok-soft'
                    : 'border-warn bg-warn-soft'
                  : 'border-line bg-card hover:border-brand hover:bg-brand-soft disabled:opacity-60'
              }`}
            >
              {isPicked && <span aria-hidden="true">{c.safe ? '✔ ' : '➜ '}</span>}
              {c.label}
            </button>
          );
        })}
      </fieldset>

      <div ref={feedbackRef} className="scroll-mt-4" aria-live="polite">
        {choice && (
          <div className="wity-fade-in space-y-4">
            <Card tone={choice.safe ? 'ok' : 'warn'} aria-labelledby="feedback-heading">
              <h2 id="feedback-heading" tabIndex={-1} className="text-3xl font-extrabold focus:outline-none">
                {choice.safe ? '✔ A safe choice' : 'Let’s take a closer look'}
              </h2>
              <p className="mt-2 text-xl">{choice.feedback}</p>
            </Card>

            <Card aria-labelledby="signs-heading">
              <SectionHeading id="signs-heading">Warning signs you could notice</SectionHeading>
              <BulletList items={scenario.warningSigns} marker="⚠" className="text-xl" />
            </Card>

            <Card aria-labelledby="tricks-heading">
              <SectionHeading id="tricks-heading">The tricks being used</SectionHeading>
              <ul className="space-y-3">
                {scenario.techniques.map((t) => (
                  <li key={t} className="text-lg">
                    <strong className="text-brand">
                      <span aria-hidden="true" className="mr-1">
                        {TECHNIQUES[t].icon}
                      </span>
                      {TECHNIQUES[t].name}:
                    </strong>{' '}
                    {TECHNIQUES[t].explain}
                  </li>
                ))}
              </ul>
            </Card>

            <Card tone="brand" aria-labelledby="instead-heading">
              <SectionHeading id="instead-heading">What to do instead</SectionHeading>
              <BulletList items={scenario.doInstead} marker="✔" className="text-xl" />
            </Card>

            <BigButton onClick={next} className="text-xl">
              {index + 1 >= total ? 'See my summary →' : 'Next scenario →'}
            </BigButton>
          </div>
        )}
      </div>
    </div>
  );
};
