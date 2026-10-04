import React, { useState } from 'react';
import { RiskLevel } from '../services/shieldSignals';
import { Dialog } from './Dialog';
import { BigButton } from './ui';

interface MessageViewerProps {
  sender: string;
  replyTo: string;
  subject: string;
  body: string;
  level: RiskLevel;
}

const URL_SPLIT = /(https?:\/\/[^\s<>"')]+)/g;

/**
 * Shows the message the person checked. When the message has warning signs, links
 * are not real links: clicking one first shows a second, smaller "are you sure?" pause.
 */
export const MessageViewer: React.FC<MessageViewerProps> = ({ sender, replyTo, subject, body, level }) => {
  const [pending, setPending] = useState<string | null>(null);
  const guarded = level !== 'LOW';

  const open = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <section aria-labelledby="viewer-heading" className="rounded-2xl border-2 border-line bg-card">
      <div className="border-b-2 border-line p-5 sm:p-6">
        <h2 id="viewer-heading" className="text-2xl font-extrabold">
          The message you checked
        </h2>
        <dl className="mt-3 space-y-1 text-lg">
          {subject && (
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-bold">Subject:</dt>
              <dd className="break-words">{subject}</dd>
            </div>
          )}
          {sender && (
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-bold">From:</dt>
              <dd className="break-all">{sender}</dd>
            </div>
          )}
          {replyTo && (
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-bold">Replies go to:</dt>
              <dd className="break-all">{replyTo}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="whitespace-pre-wrap break-words p-5 text-lg leading-relaxed sm:p-6">
        {body.split(URL_SPLIT).map((part, i) => {
          if (!/^https?:\/\//.test(part)) return <React.Fragment key={i}>{part}</React.Fragment>;
          if (!guarded) {
            return (
              <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="break-all font-semibold text-brand underline">
                {part}
              </a>
            );
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => setPending(part)}
              title="This link has warning signs. Clicking asks you to pause first."
              className="my-1 inline cursor-pointer break-all rounded-md border-2 border-danger bg-danger-soft px-2 py-0.5 text-left font-bold text-danger underline"
            >
              {part}
            </button>
          );
        })}
      </div>

      {pending && (
        <Dialog labelledBy="link-pause-title" describedBy="link-pause-desc" onClose={() => setPending(null)} tone="warn">
          <h2 id="link-pause-title" className="text-2xl font-extrabold text-danger">
            ✋ Hold on, this link is part of a message with warning signs
          </h2>
          <p id="link-pause-desc" className="mt-3 text-lg">
            Links in messages like this often lead to fake pages that steal passwords and card numbers. A real company’s
            website is safest to reach by typing its address yourself.
          </p>
          <p className="mt-4 break-all rounded-xl border-2 border-line bg-paper p-3 font-mono text-base">{pending}</p>
          <div className="mt-6 flex flex-col gap-3">
            <BigButton data-autofocus onClick={() => setPending(null)} full>
              Go back (recommended)
            </BigButton>
            <BigButton
              variant="quiet"
              onClick={() => {
                open(pending);
                setPending(null);
              }}
              full
            >
              I understand the risk, open it anyway
            </BigButton>
          </div>
        </Dialog>
      )}
    </section>
  );
};
