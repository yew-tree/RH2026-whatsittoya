import React, { useCallback, useState } from 'react';
import { CheckResult } from '../hooks/useMessageChecker';
import { TECHNIQUES } from '../data/techniques';
import { ClaimType } from '../data/verification';
import { VERIFIED_BRAND_REGISTRY } from '../services/heuristicAnalyzer';
import { asksFromSignals, reasonsFromSignals } from '../services/trustedContact';
import { InterruptChoice, InterruptModal } from './InterruptModal';
import { MessageViewer } from './MessageViewer';
import { TrustedVerification } from './TrustedVerification';
import { VerificationGuide } from './VerificationGuide';
import { BigButton, Card, LEVEL_STYLE, NumberedList, RiskBadge, SectionHeading } from './ui';

interface ResultPanelProps {
  result: CheckResult;
  onOpenLearn: (scamId?: string) => void;
  onCheckAnother: () => void;
}

const VISIBLE_SIGNALS = 5;

function nextSteps(level: CheckResult['assessment']['level']): string[] {
  if (level === 'HIGH') {
    return [
      'Pause. Do not reply, click, pay, or share anything yet.',
      'Do not use the phone number or link in the message.',
      'Check it safely using the steps below.',
      'Ask someone you trust to look at it with you.',
      'If you already sent money or information, call your bank or the company right away, using official contact details you find yourself.',
    ];
  }
  if (level === 'CAREFUL') {
    return [
      'Do not click, pay, or share anything until you have verified it.',
      'Check it safely using the steps below.',
      'If you are unsure, ask someone you trust.',
    ];
  }
  return [
    'If you were not expecting this and it asks for money, codes, or personal details, verify it independently first.',
    'Keep your passwords and one-time codes private. Real companies never ask for them.',
    'When in doubt, ask someone you trust.',
  ];
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ result, onOpenLearn, onCheckAnother }) => {
  const { input, analysis, assessment } = result;
  const level = assessment.level;
  const style = LEVEL_STYLE[level];

  const [showInterrupt, setShowInterrupt] = useState(assessment.interrupt);
  const [showAll, setShowAll] = useState(false);
  const [claimType, setClaimType] = useState<ClaimType>(assessment.claimType);
  const [showTrusted, setShowTrusted] = useState(level !== 'LOW');

  const goTo = useCallback((id: string) => {
    // Wait a tick so the dialog has closed and focus has been restored first.
    window.setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ block: 'start' });
      el.querySelector<HTMLElement>('h2')?.setAttribute('tabindex', '-1');
      el.querySelector<HTMLElement>('h2')?.focus();
    }, 50);
  }, []);

  const handleInterrupt = (choice: InterruptChoice) => {
    setShowInterrupt(false);
    if (choice === 'trust') {
      setShowTrusted(true);
      goTo('wity-trusted');
    } else if (choice === 'verify') {
      goTo('wity-verify');
    } else {
      goTo('wity-noticed');
    }
  };

  const visibleSignals = showAll ? assessment.signals : assessment.signals.slice(0, VISIBLE_SIGNALS);
  const hiddenCount = assessment.signals.length - visibleSignals.length;

  const registryBrand = Object.values(VERIFIED_BRAND_REGISTRY).find((b) => b.name === analysis.sender.claimedOrganization);
  const officialDomain = registryBrand && level !== 'LOW' ? { brand: registryBrand.name, domain: registryBrand.officialDomain } : undefined;

  const trustedContext = {
    claimedFrom: assessment.claimedFrom === 'someone you may not know' ? undefined : assessment.claimedFrom,
    asks: asksFromSignals(assessment.signals),
    reasons: reasonsFromSignals(assessment.signals),
  };

  return (
    <div className="wity-fade-in space-y-6" aria-live="polite">
      {showInterrupt && <InterruptModal assessment={assessment} onChoose={handleInterrupt} />}

      {/* 1. The verdict, in words and not just color */}
      <section aria-labelledby="result-heading" className={`rounded-3xl border-4 p-6 sm:p-8 ${style.box}`}>
        <RiskBadge level={level} large />
        <h2 id="result-heading" tabIndex={-1} className="mt-4 text-3xl font-extrabold leading-tight focus:outline-none">
          {assessment.headline}
        </h2>
        <p className="mt-3 text-xl">{assessment.summary}</p>

        {level !== 'LOW' && (
          <div className="mt-5 rounded-2xl border-2 border-current bg-card p-4">
            <p className="mb-2 text-xl font-extrabold">Until you have checked:</p>
            <ul className="space-y-1 text-lg font-semibold">
              <li>✋ Do not send money yet.</li>
              <li>✋ Do not share any codes or passwords.</li>
              <li>✋ Do not use the phone number or link in the message.</li>
            </ul>
          </div>
        )}

        {assessment.asks.length > 0 && (
          <p className="mt-4 text-lg">
            <strong>This message wants you to:</strong> {assessment.asks.join(', ')}.
          </p>
        )}
      </section>

      {/* 2. What we noticed + why it matters */}
      <Card aria-labelledby="wity-noticed-heading" id="wity-noticed">
        <SectionHeading id="wity-noticed-heading">What we noticed</SectionHeading>
        {assessment.signals.length === 0 ? (
          <p className="text-lg">
            We did not spot any of the common warning signs in this message. That does not guarantee it is genuine, so
            keep verifying anything that asks for money or personal information.
          </p>
        ) : (
          <ul className="space-y-4">
            {visibleSignals.map((s) => (
              <li key={s.id} className="rounded-2xl border-2 border-line bg-paper p-4">
                <h3 className="text-xl font-extrabold">
                  {s.technique && (
                    <span aria-hidden="true" className="mr-2">
                      {TECHNIQUES[s.technique].icon}
                    </span>
                  )}
                  {s.title}
                </h3>
                {s.evidence.length > 0 && (
                  <p className="mt-2 text-lg">
                    <span className="font-bold">In the message: </span>
                    {s.evidence.map((e, i) => (
                      <q key={i} className="mr-2 italic">
                        {e}
                      </q>
                    ))}
                  </p>
                )}
                <p className="mt-2 text-lg">
                  <span className="font-bold">Why it matters: </span>
                  {s.why}
                </p>
              </li>
            ))}
          </ul>
        )}
        {hiddenCount > 0 && (
          <BigButton variant="quiet" className="mt-4" onClick={() => setShowAll(true)}>
            Show {hiddenCount} more warning {hiddenCount === 1 ? 'sign' : 'signs'}
          </BigButton>
        )}
      </Card>

      {/* 3. How they are trying to influence you */}
      {assessment.techniques.length > 0 && (
        <Card aria-labelledby="tactics-heading">
          <SectionHeading id="tactics-heading">How this message tries to influence you</SectionHeading>
          <p className="mb-4 text-lg text-muted">
            Scammers use the same handful of pressure tactics again and again. Knowing them makes them easier to spot.
          </p>
          <ul className="grid gap-4 md:grid-cols-2">
            {assessment.techniques.slice(0, 6).map((id) => {
              const t = TECHNIQUES[id];
              return (
                <li key={id} className="rounded-2xl border-2 border-line bg-paper p-4">
                  <h3 className="text-xl font-extrabold text-brand">
                    <span aria-hidden="true" className="mr-2">
                      {t.icon}
                    </span>
                    {t.name}
                  </h3>
                  <p className="mt-2 text-lg">{t.explain}</p>
                  <p className="mt-2 text-lg font-semibold">What helps: {t.counter}</p>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {/* 4. What to do next */}
      <Card aria-labelledby="next-heading">
        <SectionHeading id="next-heading">What you should do next</SectionHeading>
        <NumberedList items={nextSteps(level)} />
      </Card>

      {/* 5. PROTECT: trusted verification and safe verification */}
      {level === 'LOW' && !showTrusted ? (
        <Card tone="plain">
          <p className="mb-3 text-lg">Still not sure about it? There is no harm in a second opinion.</p>
          <BigButton variant="secondary" onClick={() => setShowTrusted(true)}>
            🤝 Ask someone I trust
          </BigButton>
        </Card>
      ) : (
        <TrustedVerification context={trustedContext} compact={level === 'LOW'} />
      )}

      <VerificationGuide
        type={claimType}
        onTypeChange={setClaimType}
        officialDomain={officialDomain}
        onOpenLearn={onOpenLearn}
      />

      {/* 6. The message itself, with guarded links */}
      <MessageViewer sender={input.sender} replyTo={input.replyTo} subject={input.subject} body={input.body} level={level} />

      {/* 7. Optional details for the curious */}
      <details className="rounded-2xl border-2 border-line bg-card p-5">
        <summary className="cursor-pointer text-xl font-bold">More details (optional)</summary>
        <div className="mt-4 space-y-4 text-lg">
          <p>
            <strong>How we checked:</strong> {result.engineNote}
          </p>
          {analysis.sender.senderEmail && (
            <p>
              <strong>Sender address:</strong> <span className="break-all">{analysis.sender.senderEmail}</span>
            </p>
          )}
          {analysis.information.links.length > 0 && (
            <div>
              <strong>Links in the message:</strong>
              <ul className="mt-2 space-y-2">
                {analysis.information.links.map((l, i) => (
                  <li key={i} className="rounded-xl border-2 border-line bg-paper p-3">
                    <span className="break-all font-mono text-base">{l.url}</span>
                    <br />
                    <span className="text-base">
                      {l.threatLevel === 'safe'
                        ? 'No obvious problem with this address.'
                        : l.riskReason || 'This address looks unusual.'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.engine === 'ai' && level !== 'LOW' && analysis.verdictExplanation && (
            <p>
              <strong>AI helper’s note:</strong> {analysis.verdictExplanation}
            </p>
          )}
          <p className="text-base text-muted">
            These checks look for common warning signs. They are not a guarantee, and a message with no warning signs
            can still be a scam.
          </p>
        </div>
      </details>

      <div className="flex flex-col gap-3 sm:flex-row">
        <BigButton onClick={onCheckAnother}>Check another message</BigButton>
        <BigButton variant="secondary" onClick={() => onOpenLearn()}>
          📘 Learn to spot a scam
        </BigButton>
      </div>
    </div>
  );
};
