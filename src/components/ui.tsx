import React from 'react';
import { ArrowLeft, Info, OctagonAlert, TriangleAlert, LucideIcon } from 'lucide-react';
import { RiskLevel, RISK_LABEL } from '../services/shieldSignals';

/** Risk level -> callout style, text color and icon. Icons are paired with words, never alone. */
export const LEVEL: Record<RiskLevel, { callout: string; text: string; Icon: LucideIcon }> = {
  LOW: { callout: 'callout-ok', text: 'text-ok', Icon: Info },
  CAREFUL: { callout: 'callout-warn', text: 'text-warn', Icon: TriangleAlert },
  HIGH: { callout: 'callout-danger', text: 'text-danger', Icon: OctagonAlert },
};

export const RiskLabel: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const { Icon, text } = LEVEL[level];
  return (
    <span className={`risk-label ${text}`}>
      <Icon size={18} aria-hidden="true" />
      {RISK_LABEL[level]}
    </span>
  );
};

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  full?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', full, className = '', type = 'button', ...rest }, ref) => (
    <button
      ref={ref}
      type={type}
      className={`${variant === 'link' ? 'btn-link' : `btn btn-${variant}`} ${full ? 'w-full' : ''} ${className}`}
      {...rest}
    />
  )
);
Button.displayName = 'Button';

/** A link that looks like a secondary button (for mailto: and sms: actions). */
export const ButtonLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({ className = '', ...rest }) => (
  <a className={`btn btn-secondary ${className}`} {...rest} />
);

export const PageHeader: React.FC<{ title: string; lead?: string; meta?: string }> = ({ title, lead, meta }) => (
  <header className="mb-6 border-b border-line pb-5" style={{ borderBottomWidth: 'var(--bw)' }}>
    {meta && <p className="t-meta mb-1">{meta}</p>}
    <h1 id="page-title" tabIndex={-1} className="t-page focus:outline-none">
      {title}
    </h1>
    {lead && <p className="t-lead mt-2">{lead}</p>}
  </header>
);

/** A titled block separated from the previous one by a thin rule. */
export const Section: React.FC<{
  title?: string;
  id?: string;
  first?: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ title, id, first, children, className = '' }) => (
  <section id={id} aria-labelledby={title && id ? `${id}-title` : undefined} className={`${first ? '' : 'section'} ${className}`}>
    {title && (
      <h2 id={id ? `${id}-title` : undefined} className="t-section mb-3">
        {title}
      </h2>
    )}
    {children}
  </section>
);

export const Callout: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { tone?: 'neutral' | 'info' | 'ok' | 'warn' | 'danger' }
> = ({ tone = 'neutral', className = '', ...rest }) => (
  <div className={`callout ${tone === 'neutral' ? '' : `callout-${tone}`} ${className}`} {...rest} />
);

export const Bullets: React.FC<{ items: string[]; className?: string }> = ({ items, className = '' }) => (
  <ul className={`bullets ${className}`}>
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

export const Steps: React.FC<{ items: string[]; className?: string }> = ({ items, className = '' }) => (
  <ol className={`steps ${className}`}>
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ol>
);

export const BackLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button type="button" onClick={onClick} className="btn-link mb-3 inline-flex items-center gap-1.5 no-underline">
    <ArrowLeft size={18} aria-hidden="true" />
    <span className="underline underline-offset-4">{children}</span>
  </button>
);
