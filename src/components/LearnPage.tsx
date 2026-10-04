import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { SCAM_TYPES } from '../data/scams';
import { TECHNIQUE_LIST, TECHNIQUES } from '../data/techniques';
import { PageId } from './SiteHeader';
import { BackLink, Bullets, Button, PageHeader, Section } from './ui';

interface LearnPageProps {
  /** Scam to open straight away (for example, from a result page). */
  initialScamId?: string;
  onNavigate: (page: PageId) => void;
}

type Tab = 'scams' | 'tactics';

export const LearnPage: React.FC<LearnPageProps> = ({ initialScamId, onNavigate }) => {
  const [tab, setTab] = useState<Tab>('scams');
  const [openId, setOpenId] = useState<string | null>(initialScamId ?? null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (initialScamId) {
      setTab('scams');
      setOpenId(initialScamId);
    }
  }, [initialScamId]);

  const open = openId ? SCAM_TYPES.find((s) => s.id === openId) : undefined;

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SCAM_TYPES;
    return SCAM_TYPES.filter((s) => `${s.name} ${s.summary} ${s.looksLike}`.toLowerCase().includes(q));
  }, [query]);

  const show = (id: string | null) => {
    setOpenId(id);
    window.scrollTo({ top: 0 });
    window.setTimeout(() => document.getElementById('page-title')?.focus(), 30);
  };

  if (open) {
    return (
      <article>
        <BackLink onClick={() => show(null)}>All scams</BackLink>
        <PageHeader meta="Learn to Spot a Scam" title={open.name} lead={open.summary} />

        <Section id="looks" title="What it looks like" first>
          <p className="max-w-2xl">{open.looksLike}</p>
        </Section>

        <Section id="wants" title="What the scammer wants">
          <p className="max-w-2xl">{open.wants}</p>
        </Section>

        <Section id="signs" title="Warning signs">
          <Bullets items={open.signs} className="max-w-2xl" />
          <p className="t-small mt-4">
            Tactics used: {open.techniques.map((t) => TECHNIQUES[t].name).join(', ')}.
          </p>
        </Section>

        <Section id="todo" title="What to do">
          <Bullets items={open.doThis} className="max-w-2xl" />
        </Section>

        <Section id="verify" title="How to verify safely">
          <Bullets items={open.verify} className="max-w-2xl" />
          <p className="callout callout-warn mt-4 max-w-2xl">
            <strong>Do not use the phone number, email address, or link from the suspicious message.</strong> Find the
            official contact details yourself.
          </p>
        </Section>

        <div className="section flex flex-col gap-2 sm:flex-row">
          <Button onClick={() => onNavigate('practice')}>Practice with scenarios</Button>
          <Button variant="secondary" onClick={() => show(null)}>
            Back to all scams
          </Button>
        </div>
      </article>
    );
  }

  return (
    <div>
      <PageHeader
        title="Learn to Spot a Scam"
        lead="Short, plain guides to the scams people encounter most, and the tactics behind them."
      />

      <div role="tablist" aria-label="Learning topics" className="mb-6 flex border-b border-line" style={{ borderBottomWidth: 'var(--bw)' }}>
        {([
          ['scams', 'Common scams'],
          ['tactics', 'How scammers manipulate you'],
        ] as Array<[Tab, string]>).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            type="button"
            onClick={() => setTab(id)}
            className={`-mb-px min-h-[2.9rem] cursor-pointer border-b-[3px] px-4 text-[0.97rem] ${
              tab === id ? 'border-brand font-bold text-brand' : 'border-transparent font-medium hover:border-line-strong hover:text-brand'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'scams' ? (
        <div id="panel-scams" role="tabpanel" aria-labelledby="tab-scams">
          <label htmlFor="scam-search" className="t-label">
            Search scams
          </label>
          <input
            id="scam-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="For example: bank, gift cards, grandchild"
            autoComplete="off"
            className="field mb-5 sm:max-w-md"
          />
          {matches.length === 0 ? (
            <p role="status">No guides match “{query}”. Try a shorter word, such as “bank” or “gift”.</p>
          ) : (
            <ul className="divided rounded-md border border-line" style={{ borderWidth: 'var(--bw)' }}>
              {matches.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => show(s.id)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left hover:bg-brand-soft"
                  >
                    <span>
                      <span className="block font-semibold">{s.name}</span>
                      <span className="t-small block">{s.summary}</span>
                    </span>
                    <ChevronRight size={20} className="flex-shrink-0 text-muted" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div id="panel-tactics" role="tabpanel" aria-labelledby="tab-tactics">
          <p className="mb-4 max-w-2xl">
            Nearly every scam, whether it arrives as an email, a call, or a text, relies on the same few tactics. Learn to
            recognize them and most scams become easier to spot.
          </p>
          <ul className="divided">
            {TECHNIQUE_LIST.map((t) => (
              <li key={t.id} className="py-4 first:pt-0">
                <h2 className="t-sub">{t.name}</h2>
                <p className="mt-1 max-w-2xl italic text-muted">{t.tagline}</p>
                <p className="mt-2 max-w-2xl">{t.explain}</p>
                <p className="mt-1 max-w-2xl">
                  <strong className="font-semibold">What helps:</strong> {t.counter}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
