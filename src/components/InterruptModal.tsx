import React from 'react';
import { ShieldAssessment } from '../services/shieldSignals';
import { Dialog } from './Dialog';
import { BigButton } from './ui';

export type InterruptChoice = 'trust' | 'verify' | 'details';

interface InterruptModalProps {
  assessment: ShieldAssessment;
  onChoose: (choice: InterruptChoice) => void;
}

/**
 * SMART FRICTION. Shown only when the shield finds meaningful risk (HIGH RISK),
 * so it stays rare enough that people take it seriously.
 */
export const InterruptModal: React.FC<InterruptModalProps> = ({ assessment, onChoose }) => {
  const top = assessment.signals.slice(0, 3);

  return (
    <Dialog labelledBy="interrupt-title" describedBy="interrupt-desc" onClose={() => onChoose('details')} tone="danger">
      <div className="flex items-start gap-4">
        <span aria-hidden="true" className="text-5xl">
          ✋
        </span>
        <div>
          <h2 id="interrupt-title" className="text-3xl font-extrabold leading-tight text-danger">
            Before you continue…
          </h2>
          <p id="interrupt-desc" className="mt-1 text-xl font-semibold">
            We noticed several warning signs. Take a moment before sending money or information.
          </p>
        </div>
      </div>

      {top.length > 0 && (
        <ul className="mt-5 space-y-2 rounded-2xl border-2 border-line bg-paper p-4 text-lg">
          {top.map((s) => (
            <li key={s.id} className="flex gap-3">
              <span aria-hidden="true" className="font-extrabold text-danger">
                !
              </span>
              <span>{s.title}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 rounded-2xl border-2 border-danger bg-danger-soft p-4">
        <p className="mb-2 text-lg font-extrabold">Right now, please:</p>
        <ul className="space-y-1 text-lg font-semibold">
          <li>✋ Do not send money yet.</li>
          <li>✋ Do not share any codes or passwords.</li>
          <li>✋ Do not use the phone number or link in the message.</li>
        </ul>
      </div>

      <p className="mt-4 text-lg text-muted">
        You have done nothing wrong. Reading a message cannot hurt you, and checking first was a smart move.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <BigButton data-autofocus onClick={() => onChoose('trust')} full>
          🤝 Ask someone I trust
        </BigButton>
        <BigButton variant="secondary" onClick={() => onChoose('verify')} full>
          ✅ Show me how to check this safely
        </BigButton>
        <BigButton variant="quiet" onClick={() => onChoose('details')} full>
          Show me what you noticed
        </BigButton>
      </div>
    </Dialog>
  );
};
