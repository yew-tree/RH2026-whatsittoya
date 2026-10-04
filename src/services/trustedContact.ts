/**
 * Trusted verification (PROTOTYPE).
 *
 * WhatsItToYa? does NOT send anything on its own. It writes a short, calm message the
 * person can copy, or open in their own email or text app and send themselves.
 *
 * To add real notifications later, implement TrustedContactNotifier (for example with an
 * SMS or email provider and a saved contact list) and call it from the TrustedVerification
 * component. Nothing else in the app needs to change.
 */
import { Signal, describeAsks } from './shieldSignals';

export interface TrustedMessageContext {
  recipientName?: string;
  /** e.g. "a bank or card company". Omit when unknown. */
  claimedFrom?: string;
  /** e.g. ["send or move money"] */
  asks: string[];
  /** First-person reasons, e.g. ["it rushes me to act"] */
  reasons: string[];
}

export interface TrustedContactNotifier {
  id: string;
  label: string;
  /** Resolves with a note describing exactly what happened. */
  send(message: string, recipient?: { name?: string; phone?: string; email?: string }): Promise<{ delivered: boolean; note: string }>;
}

const REASON_PHRASES: Record<string, string> = {
  urgency: 'it rushes me to act',
  scarcity: 'it says I am running out of time',
  threat: 'it threatens me',
  authority: 'it claims to be an official source',
  secrecy: 'it asks me to keep this secret',
  bypass: 'it makes it hard for me to double-check',
  'gift-cards': 'it asks for gift cards',
  crypto: 'it asks for cryptocurrency',
  wire: 'it asks me to send or move money',
  'pay-fee': 'it asks me to pay a fee',
  codes: 'it asks for a verification code',
  password: 'it asks for a password',
  'personal-info': 'it asks for personal details',
  'remote-access': 'it asks for control of my device',
  'family-emergency': 'it plays on a family emergency',
  emotional: 'it pulls on my feelings',
  'too-good': 'it offers a prize or refund',
  'link-risky': 'the link does not look real',
  'link-click': 'it wants me to click a link',
  'sender-mismatch': 'the sender does not match who they say they are',
  'sender-lookalike': 'the sending address looks made up',
  'reply-to': 'replies would go to a different address',
  'phone-number': 'it gives me a phone number to call',
  attachment: 'it pushes me to open an attachment',
  language: 'the wording looks unusual',
};

export function reasonsFromSignals(signals: Signal[], max = 4): string[] {
  // The message already says what is being asked for, so prefer the pressure tactics as "reasons".
  const pressure = signals.filter((s) => !s.isAsk);
  const chosen = pressure.length > 0 ? pressure : signals;
  return chosen.slice(0, max).map((s) => REASON_PHRASES[s.id] || s.title.toLowerCase());
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

export function buildTrustedMessage(ctx: TrustedMessageContext): string {
  const greeting = ctx.recipientName?.trim() ? `Hi ${ctx.recipientName.trim()},` : 'Hi,';
  const from = ctx.claimedFrom ? `claims to be from ${ctx.claimedFrom}` : 'seems suspicious';
  const ask = ctx.asks.length > 0 ? ` and it wants me to ${joinList(ctx.asks)}` : '';
  const reasons =
    ctx.reasons.length > 0
      ? ` WhatsItToYa? noticed some warning signs: ${joinList(ctx.reasons)}.`
      : ' WhatsItToYa? helped me notice some warning signs.';
  return (
    `${greeting} I got a message that ${from}${ask}.${reasons} ` +
    `I have not sent any money or shared any information. ` +
    `Can you help me check whether this is real before I do anything? ` +
    `I will contact the organization using official details I find myself, not the ones in the message.`
  );
}

export function asksFromSignals(signals: Signal[]): string[] {
  return describeAsks(signals);
}

export function buildMailtoUrl(message: string, to = ''): string {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent('Can you help me check something?')}&body=${encodeURIComponent(message)}`;
}

export function buildSmsUrl(message: string): string {
  return `sms:?&body=${encodeURIComponent(message)}`;
}

/** Copies text to the clipboard. Returns false if the browser blocks it. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}
