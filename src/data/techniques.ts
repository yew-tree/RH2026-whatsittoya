export type TechniqueId =
  | 'urgency'
  | 'fear'
  | 'authority'
  | 'secrecy'
  | 'emotion'
  | 'payment'
  | 'scarcity'
  | 'trust';

export interface Technique {
  id: TechniqueId;
  name: string;
  icon: string;
  tagline: string;
  /** Plain-language explanation shown when this tactic is found in a message. */
  explain: string;
  /** What the person can do about it. */
  counter: string;
}

export const TECHNIQUES: Record<TechniqueId, Technique> = {
  urgency: {
    id: 'urgency',
    name: 'Urgency',
    icon: '⏱️',
    tagline: 'They want you to act before you have time to think.',
    explain:
      'This message is pressuring you to act immediately. Scammers often create urgency because slowing down gives you time to notice warning signs.',
    counter: 'Real banks and agencies can wait while you call them back on a number you trust.',
  },
  fear: {
    id: 'fear',
    name: 'Fear',
    icon: '😨',
    tagline: 'They may threaten account closure, arrest, fees, or other consequences.',
    explain:
      'This message is trying to frighten you with a threat. Fear makes it hard to think clearly, which is exactly what scammers count on.',
    counter: 'A real problem can be checked. Close the message and contact the organization yourself.',
  },
  authority: {
    id: 'authority',
    name: 'Authority',
    icon: '🏛️',
    tagline: 'They may pretend to be a bank, government agency, police officer, boss, company, or tech support.',
    explain:
      'This message claims to come from someone official. Scammers borrow trusted names and titles because most of us are used to cooperating with them.',
    counter: 'Look up the real contact details yourself. Never use the phone number or link they give you.',
  },
  secrecy: {
    id: 'secrecy',
    name: 'Secrecy',
    icon: '🤫',
    tagline: 'They may tell you not to speak with family, bank staff, coworkers, or anyone else.',
    explain:
      'This message pushes you to keep things quiet or avoid checking. Scammers isolate people because family, friends, and bank staff are the ones most likely to spot the trick.',
    counter: 'Do the opposite: tell someone you trust, right away.',
  },
  emotion: {
    id: 'emotion',
    name: 'Emotional pressure',
    icon: '💔',
    tagline: 'They may use love, panic, sympathy, excitement, embarrassment, or fear.',
    explain:
      'This message pulls on your feelings (worry, sympathy, or excitement) so that you react instead of think.',
    counter: 'A strong feeling is a signal to pause. Breathe, wait, and talk to someone you trust.',
  },
  payment: {
    id: 'payment',
    name: 'Unusual payment',
    icon: '💳',
    tagline: 'Gift cards, cryptocurrency, wire transfers, and "safe account" transfers are major warning signs.',
    explain:
      'This message asks for money in a way that is hard to trace and almost impossible to get back. Real organizations do not demand gift cards or crypto, and they never ask you to move money to a "safe account".',
    counter: 'Never pay this way because someone contacted you. Verify independently first.',
  },
  scarcity: {
    id: 'scarcity',
    name: 'Running out of time',
    icon: '⌛',
    tagline: 'They may claim you have only a few minutes to act.',
    explain:
      'This message says time is running out or you will lose something. A ticking clock is a classic way to stop you from checking.',
    counter: 'Real deadlines survive a phone call. Take the time to verify.',
  },
  trust: {
    id: 'trust',
    name: 'Pretending to be someone you know',
    icon: '🎭',
    tagline: 'They may pretend to be someone you already know.',
    explain:
      'This message leans on a name, voice, or relationship you trust. Scammers can copy names, logos, and even voices.',
    counter: 'Contact the real person using a number you already have, not the one in the message.',
  },
};

export const TECHNIQUE_LIST: Technique[] = Object.values(TECHNIQUES);
