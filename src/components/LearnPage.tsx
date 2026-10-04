import React, { useEffect, useState } from 'react';
import { SCAM_TYPES } from '../data/scams';
import { TECHNIQUE_LIST, TECHNIQUES } from '../data/techniques';
import { PageId } from './SiteHeader';
import { BackButton, BigButton, BulletList, Card, PageTitle, SectionHeading } from './ui';

interface LearnPageProps {
  /** Scam to open straight away (for example, from a result page). */
  initialScamId?: string;
  onNavigate: (page: PageId) => void;
}

type Tab = 'scams' | 'tactics';

export const LearnPage: React.FC<LearnPageProps> = ({ initialScamId, onNavigate }) => {
  const [tab, setTab] = useState<Tab>('scams');
  const [openId, setOpenId] = useState<string | null>(initialScamId ?? null);

  useEffect(() => {
    if (initialScamId) {
      setTab('scams');
      setOpenId(initialScamId);
    }
  }, [initialScamId]);

  const open = openId ? SCAM_TYPES.find((s) => s.id === openId) : undefined;

  const show = (id: string | null) => {
    setOpenId(id);
    window.scrollTo({ top: 0 });
    window.setTimeout(() => document.getElementById('page-title')?.focus(), 30);
  };

  if (open) {
    return (
      <article className="space-y-6">
        <BackButton onClick={() => show(null)}>Back to all scams</BackButton>
        <PageTitle icon={open.icon} title={open.name} subtitle={open.summary} />

        <Card aria-labelledby="looks-heading">
          <SectionHeading id="looks-heading">What it looks like</SectionHeading>
          <p className="text-xl">{open.looksLike}</p>
        </Card>

        <Card aria-labelledby="wants-heading" tone="warn">
          <SectionHeading id="wants-heading">What the scammer wants</SectionHeading>
          <p className="text-xl">{open.wants}</p>
        </Card>

        <Card aria-labelledby="signs-heading">
          <SectionHeading id="signs-heading">Warning signs</SectionHeading>
          <BulletList items={open.signs} marker="⚠" className="text-xl" />
          <p className="mt-5 text-lg font-bold">Tricks used:</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {open.techniques.map((t) => (
              <li key={t} className="rounded-full border-2 border-brand bg-brand-soft px-3 py-1 text-base font-bold text-brand">
                <span aria-hidden="true" className="mr-1">
                  {TECHNIQUES[t].icon}
                </span>
                {TECHNIQUES[t].name}
              </li>
            ))}
          </ul>
        </Card>

        <Card aria-labelledby="todo-heading" tone="danger">
          <SectionHeading id="todo-heading">What to do</SectionHeading>
          <BulletList items={open.doThis} marker="✔" className="text-xl" />
        </Card>

        <Card aria-labelledby="verify-heading" tone="brand">
          <SectionHeading id="verify-heading">How to verify safely</SectionHeading>
          <BulletList items={open.verify} marker="➜" className="text-xl" />
          <p className="mt-4 text-lg font-bold">Never use the phone number, email address, or link from the suspicious message.</p>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row">
          <BigButton onClick={() => onNavigate('practice')}>🎯 Practice spotting scams</BigButton>
          <BigButton variant="secondary" onClick={() => show(null)}>
            Back to all scams
          </BigButton>
        </div>
      </article>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle
        icon="📘"
        title="Learn to Spot a Scam"
        subtitle="Short, plain guides. Scammers are professionals at manipulation, so there is no shame in learning their tricks."
      />

      <div role="tablist" aria-label="Learning topics" className="flex flex-col gap-3 sm:flex-row">
        {([
          ['scams', 'Types of scams'],
          ['tactics', 'How scammers trick you'],
        ] as Array<[Tab, string]>).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            type="button"
            onClick={() => setTab(id)}
            className={`min-h-[3.5rem] flex-1 cursor-pointer rounded-xl border-2 px-5 py-3 text-xl font-extrabold ${
              tab === id ? 'border-brand bg-brand text-on-brand' : 'border-line bg-card text-ink hover:bg-brand-soft'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'scams' ? (
        <div id="panel-scams" role="tabpanel" aria-labelledby="tab-scams" className="grid gap-4 md:grid-cols-2">
          {SCAM_TYPES.map((s) => (
            <Card key={s.id} as="article" className="flex flex-col">
              <h2 className="text-2xl font-extrabold">
                <span aria-hidden="true" className="mr-2">
                  {s.icon}
                </span>
                {s.name}
              </h2>
              <p className="mb-4 mt-2 flex-1 text-lg text-muted">{s.summary}</p>
              <BigButton variant="secondary" onClick={() => show(s.id)} aria-label={`Read about ${s.name}`}>
                Read more →
              </BigButton>
            </Card>
          ))}
        </div>
      ) : (
        <div id="panel-tactics" role="tabpanel" aria-labelledby="tab-tactics" className="space-y-4">
          <p className="text-xl text-muted">
            Almost every scam, whether it is an email, a call, or a text, uses the same few tricks. Learn these and you can
            spot almost any of them.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {TECHNIQUE_LIST.map((t) => (
              <Card key={t.id} as="article">
                <h2 className="text-2xl font-extrabold text-brand">
                  <span aria-hidden="true" className="mr-2">
                    {t.icon}
                  </span>
                  {t.name}
                </h2>
                <p className="mt-2 text-xl font-semibold">“{t.tagline}”</p>
                <p className="mt-3 text-lg">{t.explain}</p>
                <p className="mt-3 text-lg font-bold">What helps: {t.counter}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
