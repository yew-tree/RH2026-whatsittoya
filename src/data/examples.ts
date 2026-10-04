import { SAMPLE_EMAILS } from './sampleEmails';
import { DEMO_MESSAGE } from './demoMessage';

export interface ExampleMessage {
  id: string;
  title: string;
  kind: 'Email' | 'Text message';
  description: string;
  /** The full text pasted into the checker (headers first for emails). */
  raw: string;
}

function toRaw(sender: string, replyTo: string | undefined, subject: string, body: string): string {
  return `From: ${sender}\n${replyTo ? `Reply-To: ${replyTo}\n` : ''}Subject: ${subject}\n\n${body}`;
}

export const EXAMPLES: ExampleMessage[] = [
  {
    id: 'demo-bank',
    title: 'Fake bank fraud alert',
    kind: 'Email',
    description: 'A “fraud team” wants a code, a password, and a transfer to a “safe account”, and says to tell no one.',
    raw: DEMO_MESSAGE,
  },
  {
    id: 'text-locked',
    title: 'Locked account text',
    kind: 'Text message',
    description: 'A short text with a link, claiming your bank account is locked.',
    raw: 'FIRSTBANK ALERT: Your bank account has been locked. Click here immediately to restore access: http://firstbank-unlock-secure.top/verify',
  },
  {
    id: 'text-grandchild',
    title: 'Grandchild in trouble',
    kind: 'Text message',
    description: 'A message pretending to be a grandchild who needs bail money and asks for secrecy.',
    raw: "Grandma it's me, I got a new phone number. I'm in jail after a car accident and need $2,000 for bail right now. Please don't tell mom and dad. The lawyer says to send it with gift cards. Please hurry!",
  },
  ...SAMPLE_EMAILS.map((s) => ({
    id: s.id,
    title: s.title,
    kind: 'Email' as const,
    description: s.description,
    raw: toRaw(s.sender, s.replyTo, s.subject, s.body),
  })),
];
