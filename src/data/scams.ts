import { TechniqueId } from './techniques';

export interface ScamType {
  id: string;
  name: string;
  icon: string;
  /** One friendly sentence for the card. */
  summary: string;
  looksLike: string;
  wants: string;
  signs: string[];
  doThis: string[];
  verify: string[];
  techniques: TechniqueId[];
}

export const SCAM_TYPES: ScamType[] = [
  {
    id: 'phishing-email',
    name: 'Phishing emails',
    icon: '📧',
    summary: 'A message that looks like it is from a company you use, with a link to a fake sign-in page.',
    looksLike:
      'An email that appears to come from PayPal, Amazon, Microsoft, or another company. It says there is a problem with your account and gives you a button to “fix” it.',
    wants: 'Your password, card number, or personal details, typed into a fake website.',
    signs: [
      'It rushes you with a deadline.',
      'The sender address is slightly off (like paypa1 instead of paypal).',
      'It says “Dear Customer” instead of using your name.',
      'The link goes to a different website than the one it claims.',
    ],
    doThis: [
      'Do not click the link or open attachments.',
      'Delete the message, or report it as spam.',
      'If you are worried, sign in the way you normally do and look for notices there.',
    ],
    verify: [
      'Type the company’s website address into your browser yourself.',
      'Or use the company’s official app.',
      'Call the number on your statement or card.',
    ],
    techniques: ['urgency', 'fear', 'authority'],
  },
  {
    id: 'bank-alert',
    name: 'Fake bank alerts',
    icon: '🏦',
    summary: 'A call, text, or email saying your bank account is in danger and you must act now.',
    looksLike:
      'A text: “Suspicious activity on your account. Reply YES or call this number.” Or a caller who says they are from your bank’s fraud team and asks you to move your money to a “safe account”.',
    wants: 'Your online banking login, a verification code, or a transfer of your money.',
    signs: [
      'They ask for a one-time code that was just texted to you.',
      'They tell you to move money to keep it safe.',
      'They say not to tell the bank staff or your family.',
      'Caller ID shows your bank’s name (this can be faked).',
    ],
    doThis: [
      'Hang up or ignore the message.',
      'Never share a code. A real bank will not ask for one.',
      'Do not move money because someone told you to.',
    ],
    verify: [
      'Call the number printed on the back of your bank card.',
      'Or open your bank’s official app.',
      'Tell the real bank what happened.',
    ],
    techniques: ['urgency', 'fear', 'authority', 'secrecy', 'payment'],
  },
  {
    id: 'tech-support',
    name: 'Tech support scams',
    icon: '💻',
    summary: 'A pop-up or caller says your computer has a virus and offers to “fix” it.',
    looksLike:
      'A loud pop-up that says “VIRUS DETECTED, call Microsoft now”, or a phone call from someone who says they are from Microsoft or Apple.',
    wants: 'Remote access to your computer, a payment for “repairs”, or your banking details.',
    signs: [
      'They contacted you first.',
      'A pop-up gives a phone number to call.',
      'They ask you to install software so they can “see” your screen.',
      'They ask for payment in gift cards or crypto.',
    ],
    doThis: [
      'Close the pop-up. If it will not close, restart the computer.',
      'Hang up the phone.',
      'Never let a stranger control your computer.',
    ],
    verify: [
      'Real tech companies do not cold-call about viruses.',
      'Contact the company through its official website if you are worried.',
      'Ask a trusted family member or a local repair shop.',
    ],
    techniques: ['fear', 'authority', 'urgency', 'payment'],
  },
  {
    id: 'family-emergency',
    name: 'Family emergency (grandparent) scams',
    icon: '👵',
    summary: 'Someone pretends to be a grandchild or relative in trouble and needs money right now.',
    looksLike:
      'A call at night: “Grandma, it’s me. I’m in trouble. Please don’t tell Mom and Dad.” Then a “lawyer” or “police officer” asks for bail money.',
    wants: 'Cash, a wire transfer, gift cards, or crypto, sent quickly and secretly.',
    signs: [
      'They ask you to keep it secret.',
      'They ask for gift cards, wire transfers, or cash by courier.',
      'The voice sounds a little different (“I have a cold”).',
      'They will not let you hang up and call back.',
    ],
    doThis: [
      'Stay calm. Hang up.',
      'Do not send anything yet.',
      'Tell another family member.',
    ],
    verify: [
      'Call your grandchild or relative on the number you already have.',
      'Call another family member to confirm.',
      'Set up a family code word that only real family would know.',
    ],
    techniques: ['trust', 'emotion', 'secrecy', 'urgency', 'payment'],
  },
  {
    id: 'government',
    name: 'Government impersonation',
    icon: '🏛️',
    summary: 'Someone claims to be from the IRS, Social Security, or the police and threatens you.',
    looksLike:
      'A call or text: “This is the IRS. A warrant has been issued for your arrest unless you pay today.” They may give a badge number.',
    wants: 'Immediate payment (often gift cards, crypto, or wire) or your Social Security number.',
    signs: [
      'They threaten arrest, deportation, or lost benefits.',
      'They demand payment by gift card, crypto, or wire.',
      'They tell you not to hang up or talk to anyone.',
      'They contacted you out of the blue.',
    ],
    doThis: [
      'Hang up. Real agencies do not threaten you this way.',
      'Do not pay, and do not share your Social Security number.',
      'Tell someone you trust.',
    ],
    verify: [
      'Look up the agency’s phone number on its official .gov website.',
      'Call that number and ask if they contacted you.',
      'Agencies usually contact you first by mail.',
    ],
    techniques: ['authority', 'fear', 'urgency', 'payment', 'secrecy'],
  },
  {
    id: 'romance',
    name: 'Romance scams',
    icon: '💌',
    summary: 'Someone builds a close online relationship, then asks for money.',
    looksLike:
      'A friendly person online who says they love you, but can never video chat. Then there is a sudden emergency: a hospital bill, a customs fee, a plane ticket.',
    wants: 'Money for emergencies, often by gift cards, wire, or crypto, and often again and again.',
    signs: [
      'They move quickly to talk about love.',
      'They always have an excuse not to meet or video chat.',
      'They ask for money for an emergency.',
      'They ask you to keep the relationship private.',
    ],
    doThis: [
      'Pause and talk it through with a friend or relative.',
      'Never send money to someone you have not met in person.',
      'You have done nothing to be ashamed of. These scammers are very skilled.',
    ],
    verify: [
      'Ask for a live video call.',
      'Search their photos online to see if they appear under other names.',
      'Ask a trusted person what they think.',
    ],
    techniques: ['emotion', 'trust', 'secrecy', 'payment'],
  },
  {
    id: 'investment',
    name: 'Investment scams',
    icon: '📈',
    summary: 'A “can’t-lose” opportunity promising big returns with little risk.',
    looksLike:
      'A message or call from an “advisor” about a hot investment that doubles your money. Fake websites show your “profits” growing.',
    wants: 'Your savings, sent to a fake investment platform.',
    signs: [
      'Guaranteed high returns.',
      'Pressure to “get in now” before the chance is gone.',
      'They ask you to pay in crypto or by wire.',
      'You cannot withdraw your “profits” without paying more.',
    ],
    doThis: [
      'Slow down. Real investments never have guaranteed returns.',
      'Do not send money to someone who contacted you out of the blue.',
      'Talk to a family member or a licensed advisor you already know.',
    ],
    verify: [
      'Check the advisor on your country’s official regulator website, typed in yourself.',
      'Ask for written details and have someone you trust review them.',
    ],
    techniques: ['urgency', 'scarcity', 'authority', 'payment'],
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency scams',
    icon: '🪙',
    summary: 'Someone asks you to pay or invest using crypto, or to use a crypto ATM.',
    looksLike:
      'A caller says your account is “compromised” and tells you to deposit cash into a Bitcoin ATM to “protect” it.',
    wants: 'Cash converted into crypto and sent to the scammer’s wallet, which cannot be reversed.',
    signs: [
      'They tell you to use a Bitcoin ATM.',
      'They give you a wallet address to send to.',
      'They say crypto is the only way to fix the problem.',
    ],
    doThis: [
      'Stop. No real bank, agency, or company will ask for crypto to fix a problem.',
      'Do not go to a crypto ATM because someone told you to.',
    ],
    verify: [
      'Contact the real organization using official contact details you find yourself.',
      'Talk to someone you trust before moving any money.',
    ],
    techniques: ['payment', 'urgency', 'authority'],
  },
  {
    id: 'gift-cards',
    name: 'Gift card scams',
    icon: '🎁',
    summary: 'Someone insists you pay with gift cards and read them the numbers on the back.',
    looksLike:
      'A “boss”, “agent”, or “grandchild” asks you to buy several gift cards, scratch off the back, and send the codes.',
    wants: 'The gift card codes, which work like cash and cannot be traced.',
    signs: [
      'Any request to pay a bill, fine, or fee with gift cards.',
      'They stay on the phone while you shop.',
      'They tell the cashier a cover story is needed.',
    ],
    doThis: [
      'Stop. Legitimate organizations never demand payment in gift cards.',
      'If you already shared codes, contact the card company right away.',
    ],
    verify: [
      'Call the real organization using details you find yourself.',
      'Ask a store employee. They see these scams often.',
    ],
    techniques: ['payment', 'urgency', 'authority', 'secrecy'],
  },
  {
    id: 'boss-impersonation',
    name: 'Boss and coworker impersonation',
    icon: '💼',
    summary: 'An email that looks like it is from your boss asking for a quick favor or payment.',
    looksLike:
      '“Are you at your desk? I’m in a meeting and can’t talk. I need you to buy gift cards for a client. Keep this between us.”',
    wants: 'Money, gift card codes, or employee information.',
    signs: [
      'The email comes from a personal or strange address.',
      'It says the boss cannot take calls.',
      'It asks you to skip normal approvals.',
      'It asks you to keep it confidential.',
    ],
    doThis: [
      'Do not reply with money or codes.',
      'Report it to your manager or IT team.',
    ],
    verify: [
      'Contact the boss by phone or in person.',
      'Follow your company’s normal payment approval steps.',
    ],
    techniques: ['authority', 'urgency', 'secrecy', 'trust'],
  },
  {
    id: 'delivery',
    name: 'Fake delivery messages',
    icon: '📦',
    summary: 'A text or email says a package could not be delivered and asks for a small fee.',
    looksLike:
      '“We could not deliver your package. Pay a $2.49 redelivery fee within 24 hours.” The link goes to a fake page.',
    wants: 'Your card number, address, and personal details.',
    signs: [
      'You were not expecting a package.',
      'A tiny fee with a short deadline.',
      'A shortened or strange link.',
    ],
    doThis: [
      'Do not click the link.',
      'Delete the message.',
    ],
    verify: [
      'Check your real orders in the store’s official app or website.',
      'Use the carrier’s official site and your own tracking number.',
    ],
    techniques: ['urgency', 'scarcity', 'authority'],
  },
  {
    id: 'account-takeover',
    name: 'Account takeover attempts',
    icon: '🔑',
    summary: 'Someone tries to get your login or code so they can sign in as you.',
    looksLike:
      'You get a text with a code you did not request, then a call from “security” asking you to read it back to them.',
    wants: 'Your password or the one-time code that lets them into your account.',
    signs: [
      'A code arrives that you did not ask for.',
      'Someone asks you to read the code to them.',
      'A “reset your password” link you did not request.',
    ],
    doThis: [
      'Never share a code with anyone.',
      'Change your password by signing in the normal way.',
      'Turn on two-step verification if you can.',
    ],
    verify: [
      'Sign in to your account by typing the website yourself.',
      'Check recent activity in your account settings.',
    ],
    techniques: ['authority', 'urgency', 'fear'],
  },
  {
    id: 'fake-prize',
    name: 'Fake prize scams',
    icon: '🏆',
    summary: 'You “won” something you never entered, but must pay a fee or share details to claim it.',
    looksLike:
      '“Congratulations! You have been selected to receive a $1,000 gift card. Claim now before it expires.”',
    wants: 'A “processing fee”, your card details, or personal information.',
    signs: [
      'You never entered a contest.',
      'You must pay to receive a prize.',
      'A short deadline to claim it.',
    ],
    doThis: [
      'Do not pay or share any details.',
      'Delete the message.',
    ],
    verify: [
      'Look up the company’s official contact details yourself.',
      'Remember: real prizes are free.',
    ],
    techniques: ['emotion', 'scarcity', 'urgency'],
  },
  {
    id: 'payment-scams',
    name: 'Payment app scams',
    icon: '💸',
    summary: 'Someone sends you money “by mistake” or asks for a quick payment through an app.',
    looksLike:
      '“I sent you $500 by accident. Please send it back.” Or a seller asks you to pay by Zelle, Venmo, or Cash App for something that is not real.',
    wants: 'Money sent through an app. These payments are very hard to reverse.',
    signs: [
      'Urgent “refund” requests from strangers.',
      'A buyer or seller who wants to move off the marketplace.',
      'A price that seems too good to be true.',
    ],
    doThis: [
      'Pause. Do not send money to anyone you do not know.',
      'Check your bank account. The “accidental” deposit may later be reversed.',
    ],
    verify: [
      'Contact your bank directly, using the number on your card.',
      'Only pay people you know, and only for things you have confirmed.',
    ],
    techniques: ['urgency', 'trust', 'payment'],
  },
];
