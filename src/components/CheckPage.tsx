import React, { useEffect, useRef } from 'react';
import { EXAMPLES } from '../data/examples';
import { MessageChecker } from '../hooks/useMessageChecker';
import { ResultPanel } from './ResultPanel';
import { BigButton, Card, PageTitle } from './ui';

interface CheckPageProps {
  checker: MessageChecker;
  onOpenLearn: (scamId?: string) => void;
}

export const CheckPage: React.FC<CheckPageProps> = ({ checker, onOpenLearn }) => {
  const { text, setText, sender, setSender, replyTo, setReplyTo, loading, error, result, run, loadExample, clear } = checker;
  const resultRef = useRef<HTMLDivElement>(null);
  const hadResult = useRef(false);

  // Bring the results into view once they arrive.
  useEffect(() => {
    if (result && !hadResult.current) {
      resultRef.current?.scrollIntoView({ block: 'start' });
    }
    hadResult.current = Boolean(result);
  }, [result]);

  return (
    <div className="space-y-8">
      <PageTitle
        icon="🔍"
        title="Check a Message"
        subtitle="Paste an email or text message you are unsure about. We will show you what we noticed, and what to do next."
      />

      <Card aria-labelledby="paste-heading">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run();
          }}
          noValidate
        >
          <label id="paste-heading" htmlFor="message-text" className="mb-2 block text-2xl font-extrabold">
            Paste the message here
          </label>
          <p id="paste-help" className="mb-3 text-lg text-muted">
            You can paste a whole email, including the “From:” and “Subject:” lines, or just a text message. Nothing is
            sent to anyone.
          </p>
          <textarea
            id="message-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            aria-describedby={error ? 'paste-help paste-error' : 'paste-help'}
            aria-invalid={Boolean(error)}
            placeholder="Paste the suspicious message here…"
            className="w-full rounded-xl border-2 border-line bg-card p-4 text-lg leading-relaxed"
          />

          {error && (
            <p id="paste-error" role="alert" className="mt-3 rounded-xl border-2 border-danger bg-danger-soft p-3 text-lg font-bold text-danger">
              {error}
            </p>
          )}

          <details className="mt-4 rounded-xl border-2 border-line p-4">
            <summary className="cursor-pointer text-lg font-bold">Add who sent it (optional)</summary>
            <p className="mb-3 mt-2 text-base text-muted">
              If you pasted the “From:” line above, you can skip this. Adding the sender helps us check whether the
              address matches who they claim to be.
            </p>
            <label htmlFor="sender-field" className="mb-1 block text-lg font-bold">
              Sender (name or email address)
            </label>
            <input
              id="sender-field"
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              autoComplete="off"
              className="mb-3 min-h-[3.25rem] w-full rounded-xl border-2 border-line bg-card px-4 text-lg"
            />
            <label htmlFor="replyto-field" className="mb-1 block text-lg font-bold">
              Reply-to address (if you can see one)
            </label>
            <input
              id="replyto-field"
              type="text"
              value={replyTo}
              onChange={(e) => setReplyTo(e.target.value)}
              autoComplete="off"
              className="min-h-[3.25rem] w-full rounded-xl border-2 border-line bg-card px-4 text-lg"
            />
          </details>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <BigButton type="submit" disabled={loading} className="text-xl">
              {loading ? 'Checking…' : '🔍 Check this message'}
            </BigButton>
            {(text || result) && (
              <BigButton variant="quiet" onClick={clear} disabled={loading}>
                Clear and start over
              </BigButton>
            )}
          </div>
        </form>
      </Card>

      {!result && !loading && (
        <section aria-labelledby="examples-heading">
          <h2 id="examples-heading" className="mb-2 text-2xl font-extrabold">
            Or try an example
          </h2>
          <p className="mb-4 text-lg text-muted">These are made-up messages, safe to try. Pick one to see how it works.</p>
          <div className="grid gap-3 md:grid-cols-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => loadExample(ex.raw)}
                className="cursor-pointer rounded-2xl border-2 border-line bg-card p-4 text-left hover:border-brand hover:bg-brand-soft"
              >
                <span className="block text-sm font-extrabold uppercase tracking-wide text-muted">{ex.kind}</span>
                <span className="mt-1 block text-xl font-bold text-brand">{ex.title}</span>
                <span className="mt-1 block text-base text-muted">{ex.description}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div ref={resultRef} className="scroll-mt-4">
        {loading && (
          <Card tone="brand" role="status" aria-live="polite">
            <p className="text-2xl font-extrabold">Checking your message…</p>
            <p className="mt-2 text-lg">Looking at the wording, the links, and who sent it. This usually takes a few seconds.</p>
          </Card>
        )}
        {result && !loading && (
          <ResultPanel
            key={result.analysis.analyzedAt + result.input.body.length}
            result={result}
            onOpenLearn={onOpenLearn}
            onCheckAnother={() => {
              clear();
              window.scrollTo({ top: 0 });
              document.getElementById('message-text')?.focus();
            }}
          />
        )}
      </div>
    </div>
  );
};
