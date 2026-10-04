import React from 'react';
import { CLAIM_TYPE_ORDER, ClaimType, VERIFICATION_GUIDES } from '../data/verification';
import { BulletList, Card, NumberedList, SectionHeading } from './ui';

interface VerificationGuideProps {
  id?: string;
  type: ClaimType;
  onTypeChange?: (type: ClaimType) => void;
  /** Domain the claimed organization really uses, if we know it. Shown as plain text, never a link. */
  officialDomain?: { brand: string; domain: string };
  onOpenLearn?: (scamId: string) => void;
}

export const VerificationGuide: React.FC<VerificationGuideProps> = ({ id = 'wity-verify', type, onTypeChange, officialDomain, onOpenLearn }) => {
  const guide = VERIFICATION_GUIDES[type];

  return (
    <Card aria-labelledby={`${id}-heading`} id={id}>
      <SectionHeading id={`${id}-heading`}>
        <span aria-hidden="true" className="mr-2">
          ✅
        </span>
        Check It Safely
      </SectionHeading>

      <p className="mb-4 rounded-xl border-2 border-danger bg-danger-soft p-4 text-lg font-bold">
        Never use a phone number, email address, or link from the suspicious message to check it. Always find the
        official contact details yourself.
      </p>

      {onTypeChange && (
        <div className="mb-4">
          <label htmlFor={`${id}-who`} className="mb-1 block text-lg font-bold">
            Who do they say they are?
          </label>
          <select
            id={`${id}-who`}
            value={type}
            onChange={(e) => onTypeChange(e.target.value as ClaimType)}
            className="min-h-[3.25rem] w-full rounded-xl border-2 border-line bg-card px-3 text-lg sm:w-auto"
          >
            {CLAIM_TYPE_ORDER.map((t) => (
              <option key={t} value={t}>
                {VERIFICATION_GUIDES[t].label}
              </option>
            ))}
          </select>
        </div>
      )}

      <h3 className="mb-3 text-xl font-extrabold text-brand">{guide.headline}</h3>
      <NumberedList items={guide.steps} />

      {officialDomain && (
        <p className="mt-4 rounded-xl border-2 border-line bg-paper p-3 text-lg">
          <strong>{officialDomain.brand}</strong>’s real website uses <strong>{officialDomain.domain}</strong>. Type it
          into your browser yourself, rather than clicking from this page or from the message.
        </p>
      )}

      <h3 className="mb-2 mt-6 text-xl font-extrabold text-danger">Please do not</h3>
      <BulletList items={guide.avoid} marker="✕" />

      {guide.learnId && onOpenLearn && (
        <button
          type="button"
          onClick={() => onOpenLearn(guide.learnId!)}
          className="mt-5 min-h-[3rem] cursor-pointer rounded-xl border-2 border-brand px-4 py-2 text-lg font-bold text-brand hover:bg-brand-soft"
        >
          📘 Learn more about this kind of scam →
        </button>
      )}
    </Card>
  );
};
