import React, { useState } from 'react';
import { RiskLevel } from '../services/shieldSignals';
import { Dialog } from './Dialog';
import { Button, Section } from './ui';

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
 * are not real links: clicking one first shows a second "are you sure?" pause.
 */
export const MessageViewer: React.FC<MessageViewerProps> = ({ sender, replyTo, subject, body, level }) => {
  const [pending, setPending] = useState<string | null>(null);
  const guarded = level !== 'LOW';

  const open = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <Section id="wity-message" title="The message you checked">
      {guarded && (
        <p className="t-small mb-3">Links in this message are paused. Selecting one asks you to confirm first.</p>
      )}
      <div className="rounded-md border border-line bg-subtle" style={{ borderWidth: 'var(--bw)' }}>
        {(subject || sender || replyTo) && (
          <dl className="divided text-[0.95rem]">
            {subject && (
              <div className="flex flex-wrap gap-x-3 px-4 py-2">
                <dt className="w-24 flex-shrink-0 font-semibold text-muted">Subject</dt>
                <dd className="min-w-0 flex-1 break-words">{subject}</dd>
              </div>
            )}
            {sender && (
              <div className="flex flex-wrap gap-x-3 px-4 py-2">
                <dt className="w-24 flex-shrink-0 font-semibold text-muted">From</dt>
                <dd className="min-w-0 flex-1 break-all">{sender}</dd>
              </div>
            )}
            {replyTo && (
              <div className="flex flex-wrap gap-x-3 px-4 py-2">
                <dt className="w-24 flex-shrink-0 font-semibold text-muted">Replies to</dt>
                <dd className="min-w-0 flex-1 break-all">{replyTo}</dd>
              </div>
            )}
          </dl>
        )}
        <div
          className={`whitespace-pre-wrap break-words px-4 py-4 text-[0.97rem] leading-relaxed ${
            subject || sender || replyTo ? 'border-t border-line' : ''
          }`}
          style={{ borderTopWidth: 'var(--bw)' }}
        >
          {body.split(URL_SPLIT).map((part, i) => {
            if (!/^https?:\/\//.test(part)) return <React.Fragment key={i}>{part}</React.Fragment>;
            if (!guarded) {
              return (
                <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="break-all text-brand underline">
                  {part}
                </a>
              );
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => setPending(part)}
                title="This link is paused. Selecting it asks you to confirm first."
                className="inline cursor-pointer break-all text-left font-semibold text-danger underline underline-offset-2"
              >
                {part}
              </button>
            );
          })}
        </div>
      </div>

      {pending && (
        <Dialog labelledBy="link-pause-title" describedBy="link-pause-desc" onClose={() => setPending(null)} tone="warn">
          <h2 id="link-pause-title" className="text-[1.3rem] font-bold leading-tight">
            This link is part of a message with warning signs
          </h2>
          <p id="link-pause-desc" className="mt-2">
            Links in messages like this often lead to fake pages that collect passwords and card numbers. The safest way to
            reach a company’s website is to type its address yourself.
          </p>
          <p className="mt-4 break-all rounded-md border border-line bg-subtle p-3 font-mono text-[0.9rem]" style={{ borderWidth: 'var(--bw)' }}>
            {pending}
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button data-autofocus onClick={() => setPending(null)} full>
              Go back (recommended)
            </Button>
            <Button
              variant="link"
              className="self-start"
              onClick={() => {
                open(pending);
                setPending(null);
              }}
            >
              Open the link anyway
            </Button>
          </div>
        </Dialog>
      )}
    </Section>
  );
};
