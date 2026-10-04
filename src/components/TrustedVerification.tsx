import React, { useState } from 'react';
import { buildMailtoUrl, buildSmsUrl, buildTrustedMessage, copyText, TrustedMessageContext } from '../services/trustedContact';
import { BigButton, Card, SectionHeading } from './ui';

interface TrustedVerificationProps {
  id?: string;
  context: Omit<TrustedMessageContext, 'recipientName'>;
  /** Shown in a calmer, quieter style when the risk is low. */
  compact?: boolean;
}

export const TrustedVerification: React.FC<TrustedVerificationProps> = ({ id = 'wity-trusted', context, compact }) => {
  const [name, setName] = useState('');
  const [edited, setEdited] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const generated = buildTrustedMessage({ ...context, recipientName: name });
  const message = edited ?? generated;

  const handleCopy = async () => {
    const ok = await copyText(message);
    setCopyState(ok ? 'copied' : 'failed');
    window.setTimeout(() => setCopyState('idle'), 4000);
  };

  return (
    <Card tone={compact ? 'plain' : 'brand'} aria-labelledby={`${id}-heading`} id={id}>
      <SectionHeading id={`${id}-heading`}>
        <span aria-hidden="true" className="mr-2">
          🤝
        </span>
        Ask Someone I Trust
      </SectionHeading>
      <p className="mb-4 text-lg">
        Scammers want you to feel alone and rushed. Talking to someone you trust breaks that spell. Here is a message you
        can send to a family member or friend.
      </p>

      <p
        role="note"
        className="mb-4 rounded-xl border-2 border-warn bg-warn-soft p-3 text-base font-semibold text-ink"
      >
        Prototype note: WhatsItToYa? does not send anything for you. It writes the message, and you choose how to send it.
      </p>

      <label htmlFor={`${id}-name`} className="mb-1 block text-lg font-bold">
        Who will you ask? (optional)
      </label>
      <input
        id={`${id}-name`}
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setEdited(null);
        }}
        placeholder="For example: Sarah"
        autoComplete="off"
        className="mb-4 min-h-[3.25rem] w-full rounded-xl border-2 border-line bg-card px-4 text-lg"
      />

      <label htmlFor={`${id}-message`} className="mb-1 block text-lg font-bold">
        Your message (you can change it)
      </label>
      <textarea
        id={`${id}-message`}
        value={message}
        onChange={(e) => setEdited(e.target.value)}
        rows={7}
        className="mb-4 w-full rounded-xl border-2 border-line bg-card p-4 text-lg leading-relaxed"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <BigButton onClick={handleCopy}>{copyState === 'copied' ? '✔ Copied!' : '📋 Copy message'}</BigButton>
        <a
          href={buildMailtoUrl(message)}
          className="inline-flex min-h-[3.5rem] items-center justify-center gap-2 rounded-xl border-2 border-brand bg-card px-6 py-3 text-lg font-bold text-brand hover:bg-brand-soft"
        >
          ✉️ Open in my email app
        </a>
        <a
          href={buildSmsUrl(message)}
          className="inline-flex min-h-[3.5rem] items-center justify-center gap-2 rounded-xl border-2 border-brand bg-card px-6 py-3 text-lg font-bold text-brand hover:bg-brand-soft"
        >
          💬 Open in my text app
        </a>
      </div>

      <div role="status" aria-live="polite" className="mt-3 min-h-[1.75rem] text-lg font-semibold">
        {copyState === 'copied' && <span className="text-ok">Copied. Now paste it into a text or email to someone you trust.</span>}
        {copyState === 'failed' && (
          <span className="text-danger">Your browser blocked copying. Please select the message above and copy it by hand.</span>
        )}
      </div>

      <p className="mt-2 text-base text-muted">
        The email and text buttons only open your own app with the message filled in. You still choose who gets it and
        press send yourself.
      </p>
    </Card>
  );
};
