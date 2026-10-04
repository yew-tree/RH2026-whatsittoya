import React, { useState } from 'react';
import { Check, Copy, Mail, MessageSquare } from 'lucide-react';
import { buildMailtoUrl, buildSmsUrl, buildTrustedMessage, copyText, TrustedMessageContext } from '../services/trustedContact';
import { Button, ButtonLink, Callout, Section } from './ui';

interface TrustedVerificationProps {
  id?: string;
  context: Omit<TrustedMessageContext, 'recipientName'>;
  first?: boolean;
}

export const TrustedVerification: React.FC<TrustedVerificationProps> = ({ id = 'wity-trusted', context, first }) => {
  const [name, setName] = useState('');
  const [edited, setEdited] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const message = edited ?? buildTrustedMessage({ ...context, recipientName: name });

  const handleCopy = async () => {
    const ok = await copyText(message);
    setCopyState(ok ? 'copied' : 'failed');
    window.setTimeout(() => setCopyState('idle'), 4000);
  };

  return (
    <Section id={id} title="Ask someone you trust" first={first}>
      <p className="mb-4 max-w-2xl">
        When something feels urgent, another person can help you slow down and verify it. Scammers often ask you to keep
        things secret, so talking to someone is one of the most effective steps you can take.
      </p>

      <Callout tone="info" role="note" className="mb-5 max-w-2xl">
        <strong>How this works:</strong> WhatsItToYa? writes a message for you to share. It does not contact anyone or send
        anything. You choose how and when to send it.
      </Callout>

      <div className="max-w-2xl space-y-4">
        <div>
          <label htmlFor={`${id}-name`} className="t-label">
            Who will you ask? <span className="t-small font-normal">(optional)</span>
          </label>
          <input
            id={`${id}-name`}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setEdited(null);
            }}
            placeholder="For example, Sarah"
            autoComplete="off"
            className="field sm:max-w-xs"
          />
        </div>

        <div>
          <label htmlFor={`${id}-message`} className="t-label">
            Message <span className="t-small font-normal">(you can edit it)</span>
          </label>
          <textarea
            id={`${id}-message`}
            value={message}
            onChange={(e) => setEdited(e.target.value)}
            rows={7}
            className="field"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button onClick={handleCopy}>
            {copyState === 'copied' ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
            {copyState === 'copied' ? 'Copied' : 'Copy message'}
          </Button>
          <ButtonLink href={buildMailtoUrl(message)}>
            <Mail size={18} aria-hidden="true" />
            Open in email app
          </ButtonLink>
          <ButtonLink href={buildSmsUrl(message)}>
            <MessageSquare size={18} aria-hidden="true" />
            Open in text app
          </ButtonLink>
        </div>

        <div role="status" aria-live="polite" className="-mt-2 empty:hidden">
          {copyState === 'copied' && <span className="text-ok">Copied. Paste it into a text or email to someone you trust.</span>}
          {copyState === 'failed' && (
            <span className="text-danger">Your browser blocked copying. Select the message above and copy it manually.</span>
          )}
        </div>

        <p className="t-small">
          The email and text buttons only open your own app with this message filled in. You still choose the recipient and
          press send.
        </p>
      </div>
    </Section>
  );
};
