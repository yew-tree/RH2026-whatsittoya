import React from 'react';
import { OctagonAlert } from 'lucide-react';
import { ShieldAssessment } from '../services/shieldSignals';
import { Dialog } from './Dialog';
import { Button } from './ui';

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
      <div className="flex items-start gap-3">
        <OctagonAlert size={28} className="mt-0.5 flex-shrink-0 text-danger" aria-hidden="true" />
        <div>
          <h2 id="interrupt-title" className="text-[1.35rem] font-bold leading-tight">
            Before you continue
          </h2>
          <p id="interrupt-desc" className="mt-1">
            This message contains several signs commonly associated with payment scams. We recommend pausing before
            you send money or share information.
          </p>
        </div>
      </div>

      {top.length > 0 && (
        <div className="mt-5">
          <p className="t-meta mb-2">What we noticed</p>
          <ul className="bullets">
            {top.map((s) => (
              <li key={s.id}>{s.title}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="callout callout-danger mt-5">
        <p className="mb-1.5 font-semibold">Until you have checked:</p>
        <ul className="bullets">
          <li>Do not send money.</li>
          <li>Do not share codes or passwords.</li>
          <li>Do not use the phone number or link in the message.</li>
        </ul>
      </div>

      <p className="t-small mt-4">Reading a message cannot harm you. Checking before you act was the right step.</p>

      <div className="mt-6 flex flex-col gap-2">
        <Button data-autofocus onClick={() => onChoose('trust')} full>
          Ask someone I trust
        </Button>
        <Button variant="secondary" onClick={() => onChoose('verify')} full>
          How to check this safely
        </Button>
        <Button variant="link" onClick={() => onChoose('details')} className="self-start">
          See what we noticed
        </Button>
      </div>
    </Dialog>
  );
};
