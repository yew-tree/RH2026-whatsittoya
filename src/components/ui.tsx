import React from 'react';
import { RiskLevel, RISK_LABEL } from '../services/shieldSignals';

export const LEVEL_STYLE: Record<RiskLevel, { box: string; badge: string; icon: string; text: string }> = {
  LOW: {
    box: 'bg-ok-soft border-ok text-ink',
    badge: 'bg-ok text-white',
    icon: '✔',
    text: 'text-ok',
  },
  CAREFUL: {
    box: 'bg-warn-soft border-warn text-ink',
    badge: 'bg-warn text-white',
    icon: '⚠',
    text: 'text-warn',
  },
  HIGH: {
    box: 'bg-danger-soft border-danger text-ink',
    badge: 'bg-danger text-white',
    icon: '✋',
    text: 'text-danger',
  },
};

export const RiskBadge: React.FC<{ level: RiskLevel; large?: boolean }> = ({ level, large }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full font-extrabold tracking-wide ${LEVEL_STYLE[level].badge} ${
      large ? 'px-5 py-2 text-xl' : 'px-3 py-1 text-sm'
    }`}
  >
    <span aria-hidden="true">{LEVEL_STYLE[level].icon}</span>
    {RISK_LABEL[level]}
  </span>
);

export const Card: React.FC<
  React.HTMLAttributes<HTMLElement> & { as?: 'section' | 'div' | 'article'; tone?: 'plain' | 'brand' | 'warn' | 'danger' | 'ok' }
> = ({ as: Tag = 'section', tone = 'plain', className = '', children, ...rest }) => {
  const tones = {
    plain: 'bg-card border-line',
    brand: 'bg-brand-soft border-brand',
    warn: 'bg-warn-soft border-warn',
    danger: 'bg-danger-soft border-danger',
    ok: 'bg-ok-soft border-ok',
  };
  return (
    <Tag className={`rounded-2xl border-2 p-5 sm:p-7 ${tones[tone]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
};

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'quiet';

const BUTTON_STYLE: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-on-brand border-brand hover:bg-brand-dark',
  secondary: 'bg-card text-brand border-brand hover:bg-brand-soft',
  danger: 'bg-danger text-white border-danger hover:opacity-90',
  quiet: 'bg-transparent text-ink border-line hover:bg-brand-soft',
};

interface BigButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  full?: boolean;
}

export const BigButton = React.forwardRef<HTMLButtonElement, BigButtonProps>(
  ({ variant = 'primary', full, className = '', children, type = 'button', ...rest }, ref) => (
    <button
      ref={ref}
      type={type}
      className={`inline-flex min-h-[3.5rem] cursor-pointer items-center justify-center gap-2 rounded-xl border-2 px-6 py-3 text-center text-lg font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_STYLE[variant]} ${
        full ? 'w-full' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
);
BigButton.displayName = 'BigButton';

export const PageTitle: React.FC<{ title: string; subtitle?: string; icon?: string }> = ({ title, subtitle, icon }) => (
  <div className="mb-6">
    <h1 id="page-title" tabIndex={-1} className="text-3xl font-extrabold leading-tight text-ink focus:outline-none sm:text-4xl">
      {icon && (
        <span aria-hidden="true" className="mr-3">
          {icon}
        </span>
      )}
      {title}
    </h1>
    {subtitle && <p className="mt-2 max-w-3xl text-xl text-muted">{subtitle}</p>}
  </div>
);

export const SectionHeading: React.FC<{ children: React.ReactNode; id?: string; tone?: string }> = ({ children, id, tone = 'text-ink' }) => (
  <h2 id={id} className={`mb-3 text-2xl font-extrabold ${tone}`}>
    {children}
  </h2>
);

export const BulletList: React.FC<{ items: string[]; marker?: string; className?: string }> = ({ items, marker = '•', className = '' }) => (
  <ul className={`space-y-2 ${className}`}>
    {items.map((item, i) => (
      <li key={i} className="flex gap-3">
        <span aria-hidden="true" className="mt-0.5 font-bold text-brand">
          {marker}
        </span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export const NumberedList: React.FC<{ items: string[] }> = ({ items }) => (
  <ol className="space-y-3">
    {items.map((item, i) => (
      <li key={i} className="flex gap-3">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand text-base font-extrabold text-on-brand"
        >
          {i + 1}
        </span>
        <span className="pt-0.5">{item}</span>
      </li>
    ))}
  </ol>
);

export const BackButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="mb-4 inline-flex min-h-[3rem] cursor-pointer items-center gap-2 rounded-xl border-2 border-line bg-card px-4 py-2 text-lg font-bold text-brand hover:bg-brand-soft"
  >
    <span aria-hidden="true">←</span>
    {children}
  </button>
);
