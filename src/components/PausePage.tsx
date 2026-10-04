import React, { useEffect, useRef, useState } from 'react';
import { TechniqueId, TECHNIQUES } from '../data/techniques';
import { ClaimType } from '../data/verification';
import { RiskLevel } from '../services/shieldSignals';
import { TrustedVerification } from './TrustedVerification';
import { VerificationGuide } from './VerificationGuide';
import { Button, LEVEL, PageHeader, RiskLabel, Section, Steps } from './ui';

interface Question {
  id: string;
  text: string;
  /** Any "Yes" to a critical question means we recommend pausing. */
  critical: boolean;
  weight: number;
  technique?: TechniqueId;
  /** What the person is being asked to do, used in the trusted-contact message. */
  askPhrase?: string;
  reasonPhrase: string;
  why: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'unexpected',
    text: 'Did this person or organization contact you unexpectedly?',
    critical: false,
    weight: 1,
    reasonPhrase: 'they contacted me out of the blue',
    why: 'Most genuine requests do not arrive out of the blue. Scammers start the conversation so that they control the story.',
  },
  {
    id: 'urgent',
    text: 'Are they asking you to act immediately?',
    critical: false,
    weight: 2,
    technique: 'urgency',
    reasonPhrase: 'they want me to act immediately',
    why: 'They are pressuring you to act immediately. Scammers create urgency because slowing down gives you time to notice warning signs.',
  },
  {
    id: 'threat',
    text: 'Are they threatening you with arrest, a closed account, or fees?',
    critical: false,
    weight: 2,
    technique: 'fear',
    reasonPhrase: 'they are threatening me',
    why: 'They are trying to frighten you. Fear makes it hard to think clearly, which is what scammers count on.',
  },
  {
    id: 'secret',
    text: 'Are they asking you to keep this secret?',
    critical: true,
    weight: 3,
    technique: 'secrecy',
    reasonPhrase: 'they asked me to keep it secret',
    why: 'Secrecy cuts you off from the people most likely to spot the trick. Genuine organizations do not ask you to hide a request.',
  },
  {
    id: 'giftcards',
    text: 'Are they asking you to pay with gift cards?',
    critical: true,
    weight: 4,
    technique: 'payment',
    askPhrase: 'buy gift cards',
    reasonPhrase: 'they asked for gift cards',
    why: 'Gift cards are not a legitimate way to pay a bill, a fine, or an employer. Once the codes are shared, the money is almost impossible to recover.',
  },
  {
    id: 'crypto',
    text: 'Are they asking you to pay with cryptocurrency, such as Bitcoin?',
    critical: true,
    weight: 4,
    technique: 'payment',
    askPhrase: 'send cryptocurrency',
    reasonPhrase: 'they asked for cryptocurrency',
    why: 'Cryptocurrency payments are hard to trace and cannot be reversed, which is why scammers ask for them.',
  },
  {
    id: 'wire',
    text: 'Are they asking you to wire money, or move it to a “safe account”?',
    critical: true,
    weight: 4,
    technique: 'payment',
    askPhrase: 'send or move money',
    reasonPhrase: 'they asked me to send or move money',
    why: 'Wire transfers are very hard to undo. A real bank will never ask you to move your money to a “safe account”.',
  },
  {
    id: 'isolate',
    text: 'Are they telling you not to contact your bank, family, or friends?',
    critical: true,
    weight: 3,
    technique: 'secrecy',
    reasonPhrase: 'they told me not to talk to my bank, family, or friends',
    why: 'Scammers isolate people. Your bank, family, and friends are the best place to check, and anyone who tells you to avoid them is hoping you will not.',
  },
  {
    id: 'codes',
    text: 'Are they asking for a password or a verification code?',
    critical: true,
    weight: 4,
    askPhrase: 'share a password or verification code',
    reasonPhrase: 'they asked for a password or code',
    why: 'A password or one-time code is the key to your account. Nobody legitimate will ask you to share one.',
  },
];

type Answer = 'yes' | 'no' | 'unsure';
const OPTIONS: Array<{ value: Answer; label: string }> = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'unsure', label: 'I’m not sure' },
];

function levelFor(yes: Question[], unsureCount: number): RiskLevel {
  const points = yes.reduce((sum, q) => sum + q.weight, 0);
  if (yes.some((q) => q.critical) || points >= 4) return 'HIGH';
  if (points >= 2 || unsureCount >= 3) return 'CAREFUL';
  return 'LOW';
}

interface PausePageProps {
  onNavigate: (page: 'check') => void;
  onOpenLearn: (scamId?: string) => void;
}

export const PausePage: React.FC<PausePageProps> = ({ onNavigate, onOpenLearn }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [done, setDone] = useState(false);
  const [claimType, setClaimType] = useState<ClaimType>('generic');
  const legendRef = useRef<HTMLLegendElement>(null);
  const first = useRef(true);

  const total = QUESTIONS.length;
  const q = QUESTIONS[step];
  const current = answers[q.id];

  // Move focus to the new question so keyboard and screen-reader users hear it.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    legendRef.current?.focus();
  }, [step]);

  const next = () => {
    if (!current) return;
    if (step + 1 >= total) {
      setDone(true);
      window.scrollTo({ top: 0 });
      window.setTimeout(() => document.getElementById('pause-result')?.focus(), 30);
    } else {
      setStep(step + 1);
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
    first.current = true;
    window.scrollTo({ top: 0 });
  };

  if (done) {
    const yes = QUESTIONS.filter((x) => answers[x.id] === 'yes');
    const unsure = QUESTIONS.filter((x) => answers[x.id] === 'unsure');
    const level = levelFor(yes, unsure.length);
    const techniques = Array.from(new Set(yes.map((x) => x.technique).filter(Boolean))) as TechniqueId[];

    return (
      <div className="wity-fade-in">
        <PageHeader title="Your assessment" lead="Based on your answers to Pause Before You Pay. This is guidance, not a verdict." />

        <section aria-labelledby="pause-result" className={`callout ${LEVEL[level].callout}`}>
          <RiskLabel level={level} />
          {level === 'HIGH' ? (
            <>
              <h2 id="pause-result" tabIndex={-1} className="t-section mt-1.5 focus:outline-none">
                Pause. Do not pay yet.
              </h2>
              <p className="mt-2 max-w-2xl">
                Your answers show several warning signs commonly used in payment scams. This does not prove it is a scam, but
                it is a strong reason to stop and verify the request independently before sending money or information.
              </p>
            </>
          ) : level === 'CAREFUL' ? (
            <>
              <h2 id="pause-result" tabIndex={-1} className="t-section mt-1.5 focus:outline-none">
                Slow down and double-check
              </h2>
              <p className="mt-2 max-w-2xl">
                Your answers show a warning sign or two. Before you pay or share anything, verify the request independently
                using the steps below.
              </p>
            </>
          ) : (
            <>
              <h2 id="pause-result" tabIndex={-1} className="t-section mt-1.5 focus:outline-none">
                No major warning signs in your answers
              </h2>
              <p className="mt-2 max-w-2xl">
                That does not guarantee anything is genuine. If the request involves money or personal information and you
                were not expecting it, verify it independently before you act.
              </p>
            </>
          )}
        </section>

        {yes.length > 0 && (
          <Section id="why" title="Why we say that">
            <ul className="divided">
              {yes.map((x) => (
                <li key={x.id} className="py-4 first:pt-0">
                  <h3 className="t-sub">{x.text}</h3>
                  <p className="mt-1 max-w-2xl">{x.why}</p>
                </li>
              ))}
            </ul>
            {techniques.length > 0 && (
              <p className="t-small mt-3">Tactics at work: {techniques.map((t) => TECHNIQUES[t].name).join(', ')}.</p>
            )}
          </Section>
        )}

        {unsure.length > 0 && (
          <Section id="unsure" title="Questions you were not sure about">
            <ul className="bullets max-w-2xl">
              {unsure.map((x) => (
                <li key={x.id}>{x.text}</li>
              ))}
            </ul>
            <p className="t-small mt-2">If you are unsure, treat it as a reason to check before you act.</p>
          </Section>
        )}

        <Section id="next" title="What to do next">
          <Steps
            className="max-w-2xl"
            items={
              level === 'LOW'
                ? [
                    'If anything feels off, pause and verify before paying.',
                    'Use contact details you find yourself, not ones the other person gave you.',
                    'If you are unsure, ask someone you trust.',
                  ]
                : [
                    'Do not send money, gift cards, codes, or passwords yet.',
                    'Contact the organization or person independently, using details you find yourself.',
                    'Ask someone you trust to look at it with you.',
                  ]
            }
          />
        </Section>

        {level !== 'LOW' && (
          <TrustedVerification
            id="pause-trusted"
            context={{
              asks: yes.filter((x) => x.askPhrase).map((x) => x.askPhrase!),
              reasons: yes.map((x) => x.reasonPhrase).slice(0, 4),
            }}
          />
        )}

        <VerificationGuide id="pause-verify" type={claimType} onTypeChange={setClaimType} onOpenLearn={onOpenLearn} />

        <Section id="have-message" title="Do you have the message?">
          <p className="mb-3 max-w-2xl">Paste it into Check a Message and we will point out the warning signs in it.</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => onNavigate('check')}>Check a Message</Button>
            <Button variant="secondary" onClick={restart}>
              Start over
            </Button>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Pause Before You Pay"
        lead="Answer a few questions before you send money or information. It takes about a minute."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
        noValidate
      >
        <div className="mb-5">
          <div className="flex items-baseline justify-between">
            <p className="t-meta" aria-live="polite">
              Question {step + 1} of {total}
            </p>
          </div>
          <div
            role="progressbar"
            aria-label="Progress"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={step + 1}
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line"
          >
            <div className="h-full bg-brand transition-[width]" style={{ width: `${((step + 1) / total) * 100}%` }} />
          </div>
        </div>

        <fieldset>
          <legend ref={legendRef} tabIndex={-1} className="t-section mb-4 max-w-2xl focus:outline-none">
            {q.text}
          </legend>
          <div className="max-w-md space-y-2">
            {OPTIONS.map((o) => (
              <label
                key={o.value}
                className={`flex min-h-[3rem] cursor-pointer items-center gap-3 rounded-md border px-4 py-2 hover:bg-brand-soft ${
                  current === o.value ? 'border-brand bg-brand-soft font-semibold' : 'border-line-strong bg-surface'
                }`}
                style={{ borderWidth: 'var(--bw)' }}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={o.value}
                  checked={current === o.value}
                  onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: o.value }))}
                  className="h-5 w-5 flex-shrink-0 accent-[var(--color-brand)]"
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            Back
          </Button>
          <Button type="submit" disabled={!current}>
            {step + 1 >= total ? 'See result' : 'Next'}
          </Button>
          {answers[q.id] === undefined && <span className="t-small">Select an answer to continue.</span>}
        </div>
      </form>
    </div>
  );
};
