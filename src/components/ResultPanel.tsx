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
import { BackLink, Button, LEVEL, PageHeader, RiskLabel, Section, Steps } from './ui';

interface ResultPanelProps {
  result: CheckResult;
  onOpenLearn: (scamId?: string) => void;
  onCheckAnother: () => void;
}

const VISIBLE_SIGNALS = 5;

function nextSteps(level: CheckResult['assessment']['level']): string[] {
  if (level === 'HIGH') {
    return [
      'Do not send money, share codes, or reply yet.',
      'Do not use the links or phone numbers in this message.',
      'Contact the organization independently, using details you find yourself.',
      'Ask someone you trust to look at it with you.',
      'If you already sent money or information, contact your bank or the company right away, using official contact details.',
    ];
  }
  if (level === 'CAREFUL') {
    return [
      'Do not click, pay, or share anything until you have verified the message.',
      'Contact the organization independently, using details you find yourself.',
      'If you are unsure, ask someone you trust.',
    ];
  }
  return [
    'If you were not expecting this and it asks for money, codes, or personal details, verify it independently first.',
    'Keep passwords and one-time codes private. Real companies do not ask for them.',
    'If you are unsure, ask someone you trust.',
  ];
}

function summarize(text: string, max = 70): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ result, onOpenLearn, onCheckAnother }) => {
  const { input, analysis, assessment } = result;
  const level = assessment.level;
  const tone = LEVEL[level].callout;

  const [showInterrupt, setShowInterrupt] = useState(assessment.interrupt);
  const [showAll, setShowAll] = useState(false);
  const [claimType, setClaimType] = useState<ClaimType>(assessment.claimType);

  const goTo = useCallback((id: string) => {
    // Wait a tick so the dialog has closed and focus has been restored first.
    window.setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ block: 'start' });
      const heading = el.querySelector<HTMLElement>('h2');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus();
    }, 50);
  }, []);

  const handleInterrupt = (choice: InterruptChoice) => {
    setShowInterrupt(false);
    goTo(choice === 'trust' ? 'wity-trusted' : choice === 'verify' ? 'wity-verify' : 'wity-noticed');
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

  const subjectLine = input.subject || input.body;

  return (
    <div className="wity-fade-in">
      {showInterrupt && <InterruptModal assessment={assessment} onChoose={handleInterrupt} />}

      <BackLink onClick={onCheckAnother}>Check another message</BackLink>
      <PageHeader title="Message assessment" lead={`Results for “${summarize(subjectLine)}”`} />

      {/* Verdict */}
      <section aria-labelledby="result-heading" className={`callout ${tone}`}>
        <RiskLabel level={level} />
        <h2 id="result-heading" tabIndex={-1} className="t-section mt-1.5 focus:outline-none">
          {assessment.headline}
        </h2>
        <p className="mt-2 max-w-2xl">{assessment.summary}</p>

        {assessment.asks.length > 0 && (
          <p className="mt-3 max-w-2xl">
            <strong>This message asks you to:</strong> {assessment.asks.join(', ')}.
          </p>
        )}

        {level !== 'LOW' && (
          <div className="mt-4 border-t border-current/20 pt-3" style={{ borderTopWidth: 'var(--bw)' }}>
            <p className="mb-1.5 font-semibold">Until you have checked:</p>
            <ul className="bullets">
              <li>Do not send money.</li>
              <li>Do not share codes or passwords.</li>
              <li>Do not use the phone number or link in the message.</li>
            </ul>
          </div>
        )}
      </section>

      {/* What we noticed */}
      <Section id="wity-noticed" title="What we noticed">
        {assessment.signals.length === 0 ? (
          <p className="max-w-2xl">
            We did not find any of the common warning signs in this message. That does not guarantee it is genuine, so keep
            verifying anything that asks for money or personal information.
          </p>
        ) : (
          <ul className="divided">
            {visibleSignals.map((s) => (
              <li key={s.id} className="py-4 first:pt-0">
                <h3 className="t-sub">{s.title}</h3>
                {s.evidence.length > 0 && (
                  <div className="mt-1.5 border-l-[3px] border-line-strong pl-3 text-[0.95rem] text-muted">
                    {s.evidence.map((e, i) => (
                      <p key={i} className="italic">
                        “{e}”
                      </p>
                    ))}
                  </div>
                )}
                <p className="mt-1.5 max-w-2xl">{s.why}</p>
              </li>
            ))}
          </ul>
        )}
        {hiddenCount > 0 && (
          <Button variant="secondary" className="mt-3" onClick={() => setShowAll(true)}>
            Show {hiddenCount} more {hiddenCount === 1 ? 'warning sign' : 'warning signs'}
          </Button>
        )}
      </Section>

      {/* What to do next */}
      <Section id="wity-next" title="What to do next">
        <Steps items={nextSteps(level)} className="max-w-2xl" />
      </Section>

      {/* Protect */}
      {level === 'LOW' ? (
        <Section id="wity-trusted-optional" title="Still unsure?">
          <details>
            <summary className="btn-link cursor-pointer">Ask someone you trust</summary>
            <div className="mt-2">
              <TrustedVerification context={trustedContext} first />
            </div>
          </details>
        </Section>
      ) : (
        <TrustedVerification context={trustedContext} />
      )}

      <VerificationGuide
        type={claimType}
        onTypeChange={setClaimType}
        officialDomain={officialDomain}
        onOpenLearn={onOpenLearn}
      />

      {/* Educate */}
      {assessment.techniques.length > 0 && (
        <Section id="wity-tactics" title="How this message tries to influence you">
          <p className="mb-3 max-w-2xl text-muted">
            Scammers rely on the same few pressure tactics. Recognizing them makes them easier to resist.
          </p>
          <ul className="divided">
            {assessment.techniques.slice(0, 6).map((id) => {
              const t = TECHNIQUES[id];
              return (
                <li key={id} className="py-4 first:pt-0">
                  <h3 className="t-sub">{t.name}</h3>
                  <p className="mt-1 max-w-2xl">{t.explain}</p>
                  <p className="mt-1 max-w-2xl text-muted">
                    <strong className="font-semibold text-ink">What helps:</strong> {t.counter}
                  </p>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      <MessageViewer sender={input.sender} replyTo={input.replyTo} subject={input.subject} body={input.body} level={level} />

      {/* Optional details */}
      <Section id="wity-details">
        <details>
          <summary className="btn-link cursor-pointer">More details</summary>
          <div className="mt-3 max-w-2xl space-y-3 text-[0.97rem]">
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
                <ul className="divided mt-1 rounded-md border border-line" style={{ borderWidth: 'var(--bw)' }}>
                  {analysis.information.links.map((l, i) => (
                    <li key={i} className="px-3 py-2">
                      <span className="break-all font-mono text-[0.85rem]">{l.url}</span>
                      <br />
                      <span className="t-small">
                        {l.threatLevel === 'safe' ? 'No obvious problem with this address.' : l.riskReason || 'This address looks unusual.'}
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
            <p className="t-small">
              These checks look for common warning signs. They are not a guarantee, and a message with no warning signs can
              still be a scam.
            </p>
          </div>
        </details>
      </Section>

      <div className="section flex flex-col gap-2 sm:flex-row">
        <Button onClick={onCheckAnother}>Check another message</Button>
        <Button variant="secondary" onClick={() => onOpenLearn()}>
          Learn to spot a scam
        </Button>
      </div>
    </div>
  );
};
