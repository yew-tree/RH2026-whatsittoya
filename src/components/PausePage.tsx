import React, { useRef, useState } from 'react';
import { TechniqueId, TECHNIQUES } from '../data/techniques';
import { ClaimType } from '../data/verification';
import { RiskLevel } from '../services/shieldSignals';
import { TrustedVerification } from './TrustedVerification';
import { VerificationGuide } from './VerificationGuide';
import { BigButton, Card, LEVEL_STYLE, PageTitle, RiskBadge, SectionHeading } from './ui';

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
    text: 'Did someone contact you unexpectedly?',
    critical: false,
    weight: 1,
    technique: 'trust',
    reasonPhrase: 'they contacted me out of the blue',
    why: 'Most real requests do not arrive out of the blue. Scammers start the conversation so they control the story.',
  },
  {
    id: 'urgent',
    text: 'Are they asking you to act immediately?',
    critical: false,
    weight: 2,
    technique: 'urgency',
    reasonPhrase: 'they want me to act immediately',
    why: TECHNIQUES.urgency.explain,
  },
  {
    id: 'threat',
    text: 'Are they threatening you (arrest, a closed account, fees)?',
    critical: false,
    weight: 2,
    technique: 'fear',
    reasonPhrase: 'they are threatening me',
    why: TECHNIQUES.fear.explain,
  },
  {
    id: 'secret',
    text: 'Are they asking you to keep this secret?',
    critical: true,
    weight: 3,
    technique: 'secrecy',
    reasonPhrase: 'they asked me to keep it secret',
    why: TECHNIQUES.secrecy.explain,
  },
  {
    id: 'giftcards',
    text: 'Are they asking for gift cards?',
    critical: true,
    weight: 4,
    technique: 'payment',
    askPhrase: 'buy gift cards',
    reasonPhrase: 'they asked for gift cards',
    why: 'Gift cards are not a real way to pay a bill, a fine, or a boss. Once the codes are shared, the money is almost impossible to get back.',
  },
  {
    id: 'crypto',
    text: 'Are they asking for cryptocurrency (like Bitcoin)?',
    critical: true,
    weight: 4,
    technique: 'payment',
    askPhrase: 'send cryptocurrency',
    reasonPhrase: 'they asked for cryptocurrency',
    why: 'Crypto payments are hard to trace and cannot be reversed, which is why scammers ask for them.',
  },
  {
    id: 'wire',
    text: 'Are they asking for a wire transfer or to move your money?',
    critical: true,
    weight: 4,
    technique: 'payment',
    askPhrase: 'send or move money',
    reasonPhrase: 'they asked me to send or move money',
    why: 'Wire transfers are very hard to undo. Real banks never ask you to move money to a “safe account”.',
  },
  {
    id: 'nobank',
    text: 'Are they telling you not to contact your bank?',
    critical: true,
    weight: 3,
    technique: 'secrecy',
    reasonPhrase: 'they told me not to contact my bank',
    why: 'Your bank is the best place to check. Anyone who tells you to avoid it is hoping you will not find out the truth.',
  },
  {
    id: 'nofamily',
    text: 'Are they telling you not to contact your family or friends?',
    critical: true,
    weight: 3,
    technique: 'secrecy',
    reasonPhrase: 'they told me not to talk to family or friends',
    why: 'Scammers cut people off from help. Family and friends are the ones most likely to spot the trick.',
  },
  {
    id: 'codes',
    text: 'Are they asking for passwords or verification codes?',
    critical: true,
    weight: 4,
    technique: 'authority',
    askPhrase: 'share a password or verification code',
    reasonPhrase: 'they asked for a password or code',
    why: 'A password or one-time code is the key to your account. Nobody legitimate will ask you to share one.',
  },
];

const ANSWER_YES = 'yes';
const ANSWER_NO = 'no';
type Answer = typeof ANSWER_YES | typeof ANSWER_NO;

function levelFor(yes: Question[]): RiskLevel {
  const points = yes.reduce((sum, q) => sum + q.weight, 0);
  if (yes.some((q) => q.critical) || points >= 4) return 'HIGH';
  if (points >= 2) return 'CAREFUL';
  return 'LOW';
}

interface PausePageProps {
  onNavigate: (page: 'check') => void;
  onOpenLearn: (scamId?: string) => void;
}

export const PausePage: React.FC<PausePageProps> = ({ onNavigate, onOpenLearn }) => {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claimType, setClaimType] = useState<ClaimType>('generic');
  const resultRef = useRef<HTMLDivElement>(null);

  const answeredCount = Object.keys(answers).length;
  const yes = QUESTIONS.filter((q) => answers[q.id] === ANSWER_YES);
  const level = levelFor(yes);

  const setAnswer = (id: string, value: Answer) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setSubmitted(false);
    setError(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answeredCount === 0) {
      setError('Please answer at least one question so we can help.');
      return;
    }
    setSubmitted(true);
    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ block: 'start' });
      resultRef.current?.querySelector<HTMLElement>('h2')?.focus();
    }, 50);
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    setError(null);
    window.scrollTo({ top: 0 });
  };

  const style = LEVEL_STYLE[level];
  const techniquesFound = Array.from(new Set(yes.map((q) => q.technique).filter(Boolean))) as TechniqueId[];

  return (
    <div className="space-y-8">
      <PageTitle
        icon="✋"
        title="Pause Before You Pay"
        subtitle="Someone asking you for money or information? Take one minute. Answer a few simple questions, and we will help you decide what to do next."
      />

      <form onSubmit={submit} noValidate className="space-y-4">
        {QUESTIONS.map((q, i) => (
          <fieldset key={q.id} className="rounded-2xl border-2 border-line bg-card p-5">
            <legend className="px-2 text-sm font-extrabold uppercase tracking-wide text-muted">
              Question {i + 1} of {QUESTIONS.length}
            </legend>
            <p className="mb-4 text-2xl font-bold">{q.text}</p>
            <div className="flex gap-3">
              {([ANSWER_YES, ANSWER_NO] as Answer[]).map((value) => (
                <label key={value} className="flex-1">
                  <input
                    type="radio"
                    name={q.id}
                    value={value}
                    checked={answers[q.id] === value}
                    onChange={() => setAnswer(q.id, value)}
                    className="peer sr-only"
                  />
                  <span
                    className={`flex min-h-[3.5rem] cursor-pointer items-center justify-center rounded-xl border-2 border-line bg-card px-4 text-xl font-extrabold peer-focus-visible:outline-4 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus ${
                      value === ANSWER_YES
                        ? 'peer-checked:border-danger peer-checked:bg-danger peer-checked:text-white'
                        : 'peer-checked:border-brand peer-checked:bg-brand peer-checked:text-on-brand'
                    }`}
                  >
                    {answers[q.id] === value ? '✔ ' : ''}
                    {value === ANSWER_YES ? 'Yes' : 'No'}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <div role="status" aria-live="polite" className="text-lg font-semibold text-muted">
          {answeredCount} of {QUESTIONS.length} answered. If you are not sure, you can leave it blank.
        </div>

        {error && (
          <p role="alert" className="rounded-xl border-2 border-danger bg-danger-soft p-3 text-lg font-bold text-danger">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <BigButton type="submit" className="text-xl">
            See what to do
          </BigButton>
          {answeredCount > 0 && (
            <BigButton variant="quiet" onClick={reset}>
              Start over
            </BigButton>
          )}
        </div>
      </form>

      <div ref={resultRef} className="scroll-mt-4">
        {submitted && (
          <div className="wity-fade-in space-y-6">
            <section aria-labelledby="pause-result" className={`rounded-3xl border-4 p-6 sm:p-8 ${style.box}`}>
              <RiskBadge level={level} large />
              {level === 'HIGH' ? (
                <>
                  <h2 id="pause-result" tabIndex={-1} className="mt-4 text-4xl font-extrabold leading-tight text-danger focus:outline-none sm:text-5xl">
                    PAUSE.
                    <br />
                    DO NOT PAY YET.
                  </h2>
                  <p className="mt-3 text-2xl font-extrabold">Verify the request independently.</p>
                  <p className="mt-3 text-xl">
                    Your answers show several warning signs that scammers use. This does not prove it is a scam, but it is
                    a very good reason to stop and check before any money, codes, or information leave your hands.
                  </p>
                </>
              ) : level === 'CAREFUL' ? (
                <>
                  <h2 id="pause-result" tabIndex={-1} className="mt-4 text-4xl font-extrabold leading-tight focus:outline-none">
                    Slow down and double-check.
                  </h2>
                  <p className="mt-3 text-xl">
                    Your answers show a warning sign or two. Before you pay or share anything, verify the request
                    independently using the steps below.
                  </p>
                </>
              ) : (
                <>
                  <h2 id="pause-result" tabIndex={-1} className="mt-4 text-4xl font-extrabold leading-tight focus:outline-none">
                    We did not find major warning signs in your answers.
                  </h2>
                  <p className="mt-3 text-xl">
                    That does not guarantee anything is genuine. If the request involves money or personal information and
                    you were not expecting it, verify it independently before you act.
                  </p>
                </>
              )}
            </section>

            {yes.length > 0 && (
              <Card aria-labelledby="why-heading">
                <SectionHeading id="why-heading">Why we say that</SectionHeading>
                <ul className="space-y-3">
                  {yes.map((q) => (
                    <li key={q.id} className="rounded-2xl border-2 border-line bg-paper p-4">
                      <p className="text-xl font-extrabold">
                        {q.technique && (
                          <span aria-hidden="true" className="mr-2">
                            {TECHNIQUES[q.technique].icon}
                          </span>
                        )}
                        You said yes: {q.text}
                      </p>
                      <p className="mt-2 text-lg">{q.why}</p>
                    </li>
                  ))}
                </ul>
                {techniquesFound.length > 0 && (
                  <p className="mt-4 text-lg text-muted">
                    Tactics at work: {techniquesFound.map((t) => TECHNIQUES[t].name).join(', ')}.
                  </p>
                )}
              </Card>
            )}

            {level !== 'LOW' && (
              <TrustedVerification
                id="pause-trusted"
                context={{
                  asks: yes.filter((q) => q.askPhrase).map((q) => q.askPhrase!),
                  reasons: yes.map((q) => q.reasonPhrase).slice(0, 4),
                }}
              />
            )}

            <VerificationGuide id="pause-verify" type={claimType} onTypeChange={setClaimType} onOpenLearn={onOpenLearn} />

            <Card tone="plain" aria-label="Have the message?">
              <p className="mb-3 text-xl font-bold">Do you have the message or email?</p>
              <p className="mb-4 text-lg text-muted">Paste it into Check a Message and we will point out the warning signs in it.</p>
              <BigButton variant="secondary" onClick={() => onNavigate('check')}>
                🔍 Check a message
              </BigButton>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
