import React, { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { EXAMPLES } from '../data/examples';
import { MessageChecker } from '../hooks/useMessageChecker';
import { ResultPanel } from './ResultPanel';
import { Button, PageHeader, Section } from './ui';

interface CheckPageProps {
  checker: MessageChecker;
  onOpenLearn: (scamId?: string) => void;
}

export const CheckPage: React.FC<CheckPageProps> = ({ checker, onOpenLearn }) => {
  const { text, setText, sender, setSender, replyTo, setReplyTo, loading, error, result, run, loadExample, clear } = checker;
  const hadResult = useRef(false);

  // When results arrive, start at the top of the assessment.
  useEffect(() => {
    if (result && !hadResult.current) window.scrollTo({ top: 0 });
    hadResult.current = Boolean(result);
  }, [result]);

  if (result && !loading) {
    return (
      <ResultPanel
        key={result.analysis.analyzedAt + result.input.body.length}
        result={result}
        onOpenLearn={onOpenLearn}
        onCheckAnother={() => {
          clear();
          window.scrollTo({ top: 0 });
          window.setTimeout(() => document.getElementById('message-text')?.focus(), 30);
        }}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Check a Message"
        lead="Paste an email or text message you are unsure about. We will explain what we notice and what you can do next."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void run();
        }}
        noValidate
      >
        <label htmlFor="message-text" className="t-label">
          Message
        </label>
        <textarea
          id="message-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={11}
          aria-describedby={error ? 'paste-help paste-error' : 'paste-help'}
          aria-invalid={Boolean(error)}
          placeholder="Paste the message here"
          className="field"
        />
        <p id="paste-help" className="t-small mt-2">
          Paste a whole email, including the From and Subject lines, or just the text of a message. Nothing is sent to
          anyone.
        </p>

        {error && (
          <p id="paste-error" role="alert" className="callout callout-danger mt-3 font-semibold">
            {error}
          </p>
        )}

        <details className="mt-5">
          <summary className="btn-link cursor-pointer">Sender information (optional)</summary>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="t-small">
                If you pasted the From line above, you can skip this. Adding the sender helps us check whether the address
                matches who the message claims to be.
              </p>
            </div>
            <div>
              <label htmlFor="sender-field" className="t-label">
                Sender name or email address
              </label>
              <input id="sender-field" type="text" value={sender} onChange={(e) => setSender(e.target.value)} autoComplete="off" className="field" />
            </div>
            <div>
              <label htmlFor="replyto-field" className="t-label">
                Reply-to address
              </label>
              <input id="replyto-field" type="text" value={replyTo} onChange={(e) => setReplyTo(e.target.value)} autoComplete="off" className="field" />
            </div>
          </div>
        </details>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={loading}>
            {loading && <span className="wity-spinner" aria-hidden="true" />}
            {loading ? 'Checking…' : 'Check message'}
          </Button>
          {text && !loading && (
            <Button variant="secondary" onClick={clear}>
              Clear
            </Button>
          )}
          <span role="status" aria-live="polite" className="t-small">
            {loading ? 'Looking at the wording, the links, and who sent it.' : ''}
          </span>
        </div>
      </form>

      <Section id="examples" title="Try an example">
        <p className="t-small mb-3 max-w-2xl">These are made-up messages. Select one to see how WhatsItToYa? responds.</p>
        <ul className="divided rounded-md border border-line" style={{ borderWidth: 'var(--bw)' }}>
          {EXAMPLES.map((ex) => (
            <li key={ex.id}>
              <button
                type="button"
                onClick={() => loadExample(ex.raw)}
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="min-w-0">
                  <span className="block font-semibold">{ex.title}</span>
                  <span className="t-small block">
                    {ex.kind}. {ex.description}
                  </span>
                </span>
                <ChevronRight size={20} className="flex-shrink-0 text-muted" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
};
