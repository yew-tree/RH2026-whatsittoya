import React from 'react';
import { CLAIM_TYPE_ORDER, ClaimType, VERIFICATION_GUIDES } from '../data/verification';
import { Bullets, Callout, Section, Steps } from './ui';

interface VerificationGuideProps {
  id?: string;
  type: ClaimType;
  onTypeChange?: (type: ClaimType) => void;
  /** Domain the claimed organization really uses, if we know it. Shown as plain text, never a link. */
  officialDomain?: { brand: string; domain: string };
  onOpenLearn?: (scamId: string) => void;
  first?: boolean;
}

export const VerificationGuide: React.FC<VerificationGuideProps> = ({
  id = 'wity-verify',
  type,
  onTypeChange,
  officialDomain,
  onOpenLearn,
  first,
}) => {
  const guide = VERIFICATION_GUIDES[type];

  return (
    <Section id={id} title="Check it safely" first={first}>
      <Callout tone="warn" className="mb-5 max-w-2xl">
        <strong>Do not use a phone number, email address, or link from the suspicious message to check it.</strong> Find
        the official contact details yourself.
      </Callout>

      {onTypeChange && (
        <div className="mb-5">
          <label htmlFor={`${id}-who`} className="t-label">
            Who does the message claim to be from?
          </label>
          <select
            id={`${id}-who`}
            value={type}
            onChange={(e) => onTypeChange(e.target.value as ClaimType)}
            className="field sm:max-w-sm"
          >
            {CLAIM_TYPE_ORDER.map((t) => (
              <option key={t} value={t}>
                {VERIFICATION_GUIDES[t].label}
              </option>
            ))}
          </select>
        </div>
      )}

      <h3 className="t-sub mb-3">{guide.headline}</h3>
      <Steps items={guide.steps} className="max-w-2xl" />

      {officialDomain && (
        <p className="mt-4 max-w-2xl">
          {officialDomain.brand} uses <strong>{officialDomain.domain}</strong> for its real website. Type it into your
          browser yourself rather than clicking from this page or from the message.
        </p>
      )}

      <h3 className="t-sub mb-2 mt-6">Avoid</h3>
      <Bullets items={guide.avoid} className="max-w-2xl" />

      {guide.learnId && onOpenLearn && (
        <p className="mt-5">
          <button type="button" className="btn-link" onClick={() => onOpenLearn(guide.learnId!)}>
            Learn more about this kind of scam
          </button>
        </p>
      )}
    </Section>
  );
};
