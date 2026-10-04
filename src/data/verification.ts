export type ClaimType =
  | 'bank'
  | 'family'
  | 'government'
  | 'techsupport'
  | 'employer'
  | 'delivery'
  | 'shopping'
  | 'romance'
  | 'prize'
  | 'generic';

export interface VerificationGuide {
  type: ClaimType;
  /** Short button label: "They say they are..." */
  label: string;
  headline: string;
  steps: string[];
  avoid: string[];
  /** Matching Learn page scam id, when there is one. */
  learnId?: string;
}

export const VERIFICATION_GUIDES: Record<ClaimType, VerificationGuide> = {
  bank: {
    type: 'bank',
    label: 'My bank or card company',
    headline: 'How to check with your bank safely',
    steps: [
      'Do not reply. Close the message or hang up.',
      'Call the phone number printed on the back of your bank card.',
      'Or open your bank’s official app, or type the bank’s website into your browser yourself.',
      'Ask them: “Did you contact me about a problem with my account?”',
    ],
    avoid: [
      'Do not call the number in the message.',
      'Do not click its link.',
      'Do not move money to a “safe account”. A real bank never asks you to.',
    ],
    learnId: 'bank-alert',
  },
  family: {
    type: 'family',
    label: 'A family member or friend',
    headline: 'How to check on a family member safely',
    steps: [
      'Stop and take a breath. Do not send anything yet.',
      'Call that person on the number you already have saved.',
      'If you cannot reach them, call another relative or friend who would know.',
      'Ask a question only the real person could answer, or use a family code word.',
    ],
    avoid: [
      'Do not trust caller ID or a “new number”. Both can be faked.',
      'Do not keep it secret, even if they ask you to.',
      'Do not send money, gift cards, or codes until you have spoken to the real person.',
    ],
    learnId: 'family-emergency',
  },
  government: {
    type: 'government',
    label: 'A government agency',
    headline: 'How to check with a government agency safely',
    steps: [
      'Remember: real agencies do not demand gift cards, crypto, or wire transfers.',
      'They also do not threaten arrest by text or phone call.',
      'Find the agency’s official phone number yourself, on its official website.',
      'Call and ask whether they really contacted you.',
    ],
    avoid: [
      'Do not give your Social Security number to someone who contacted you.',
      'Do not pay anything because of a threat.',
      'Do not use the phone number or link in the message.',
    ],
    learnId: 'government',
  },
  techsupport: {
    type: 'techsupport',
    label: 'Tech support (Microsoft, Apple, etc.)',
    headline: 'How to check a tech support claim safely',
    steps: [
      'Know this: real tech companies do not cold-call or pop up warnings with a phone number.',
      'Close the pop-up, or hang up the phone.',
      'If you are worried about your device, contact the company through its official website.',
      'Ask a family member or a local repair shop you trust to take a look.',
    ],
    avoid: [
      'Do not allow remote access to your computer.',
      'Do not install anything they tell you to install.',
      'Do not pay with gift cards or crypto.',
    ],
    learnId: 'tech-support',
  },
  employer: {
    type: 'employer',
    label: 'My boss, coworker, or IT department',
    headline: 'How to check a work request safely',
    steps: [
      'Contact the person another way: call, walk over, or use your company chat.',
      'Ask your manager or IT team whether the request is real.',
      'Follow your company’s normal approval process for payments.',
      'Report the message to IT. Others may have received it too.',
    ],
    avoid: [
      'Do not buy gift cards or send money because of an email.',
      'Do not skip approvals because someone says they are too busy.',
      'Do not reply with the contact details the message gives you.',
    ],
    learnId: 'boss-impersonation',
  },
  delivery: {
    type: 'delivery',
    label: 'A delivery company',
    headline: 'How to check a delivery message safely',
    steps: [
      'Go to the carrier’s official website or app yourself.',
      'Type in the tracking number from your own order confirmation.',
      'Check your order history in the store’s official app or website.',
      'If there is truly a problem, it will show up there.',
    ],
    avoid: [
      'Do not click the link in the message.',
      'Do not pay a small “redelivery fee”. That is how card numbers get stolen.',
    ],
    learnId: 'delivery',
  },
  shopping: {
    type: 'shopping',
    label: 'A store or payment company (PayPal, Amazon, etc.)',
    headline: 'How to check with a company safely',
    steps: [
      'Do not click anything in the message.',
      'Open the company’s official app, or type its website address yourself.',
      'Look for the same notice inside your account.',
      'Or call the number on your statement or the company’s official website.',
    ],
    avoid: [
      'Do not sign in through a link in the message.',
      'Do not share codes or passwords with anyone who contacts you.',
    ],
    learnId: 'phishing-email',
  },
  romance: {
    type: 'romance',
    label: 'Someone I met online',
    headline: 'How to check on an online friend safely',
    steps: [
      'Pause. Real affection can wait while you check.',
      'Tell a friend or family member everything, even if it feels embarrassing.',
      'Ask for a live video call. Scammers usually have excuses.',
      'Search their name and photos online to see if they appear elsewhere.',
    ],
    avoid: [
      'Do not send money, gift cards, or crypto to someone you have not met in person.',
      'Do not keep the relationship a secret.',
    ],
    learnId: 'romance',
  },
  prize: {
    type: 'prize',
    label: 'A prize, refund, or giveaway',
    headline: 'How to check a prize or refund safely',
    steps: [
      'Ask yourself: did I really enter this contest or expect a refund?',
      'Real prizes never ask you to pay a fee first.',
      'Look up the company on its official website, typed in yourself.',
      'Tell someone you trust about it.',
    ],
    avoid: [
      'Do not pay a “fee” or “tax” to claim a prize.',
      'Do not share bank or card details to receive a prize.',
    ],
    learnId: 'fake-prize',
  },
  generic: {
    type: 'generic',
    label: 'Someone else',
    headline: 'How to check any unexpected request safely',
    steps: [
      'Do not reply, click, or pay yet. A real request can wait.',
      'Find the organization’s official contact details yourself, not from the message.',
      'Contact them and ask whether they really reached out to you.',
      'Talk it over with someone you trust before you do anything.',
    ],
    avoid: [
      'Do not use any phone number, email address, or link inside the suspicious message.',
      'Do not send money, codes, or passwords to someone who contacted you first.',
    ],
  },
};

export const CLAIM_TYPE_ORDER: ClaimType[] = [
  'bank',
  'family',
  'government',
  'techsupport',
  'employer',
  'delivery',
  'shopping',
  'romance',
  'prize',
  'generic',
];
