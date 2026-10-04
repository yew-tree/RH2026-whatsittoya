import { TechniqueId } from './techniques';

export interface ScenarioChoice {
  id: string;
  label: string;
  safe: boolean;
  /** Gentle feedback shown after the person picks this option. */
  feedback: string;
}

export interface Scenario {
  id: string;
  /** How it arrived, e.g. "Text message". */
  channel: string;
  icon: string;
  title: string;
  /** The fictional message or call, shown in a quote card. */
  message: string;
  question: string;
  choices: ScenarioChoice[];
  warningSigns: string[];
  techniques: TechniqueId[];
  doInstead: string[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'locked-account',
    channel: 'Text message',
    icon: '💬',
    title: 'The locked bank account',
    message:
      'FIRSTBANK ALERT: Your bank account has been locked. Click here immediately to restore access: http://firstbank-unlock.example/verify',
    question: 'You get this text. What would you do?',
    choices: [
      {
        id: 'a',
        label: 'Tap the link to unlock my account',
        safe: false,
        feedback:
          'That is what the sender hopes for, and it is an easy mistake because the message is built to feel urgent. The link would lead to a copy of a bank sign-in page.',
      },
      {
        id: 'b',
        label: 'Reply STOP to make it go away',
        safe: false,
        feedback:
          'Replying tells the scammer that your number is active, which can bring more messages. It is better not to reply at all.',
      },
      {
        id: 'c',
        label: 'Ignore the text, and call the number on the back of my bank card',
        safe: true,
        feedback:
          'Exactly right. The number on your card connects to your real bank, and they can tell you if anything is actually wrong.',
      },
    ],
    warningSigns: [
      'A rushed request: “immediately”.',
      'A link instead of your bank’s normal app or website.',
      'No personal details. It could be sent to thousands of people.',
    ],
    techniques: ['urgency', 'fear', 'authority'],
    doInstead: [
      'Do not tap the link.',
      'Open your bank’s official app or call the number on your card.',
      'Delete the text.',
    ],
  },
  {
    id: 'grandson',
    channel: 'Phone call',
    icon: '📞',
    title: 'The grandchild in trouble',
    message:
      '“Grandma? It’s me. I’ve been arrested and I need $2,000 for bail right now. Please don’t tell Mom and Dad, I’m so embarrassed. A lawyer will call you to explain how to send it.”',
    question: 'The caller sounds upset. What would you do?',
    choices: [
      {
        id: 'a',
        label: 'Send the money quickly so they are not in jail for long',
        safe: false,
        feedback:
          'Of course you want to help. That love is exactly what this scam targets. Real bail is never arranged this way, so pause before sending anything.',
      },
      {
        id: 'b',
        label: 'Hang up, then call my grandchild on the number I already have',
        safe: true,
        feedback:
          'Perfect. Calling back on a number you know is the fastest way to find out the truth, and it takes the pressure off.',
      },
      {
        id: 'c',
        label: 'Ask the caller to prove who they are by telling me their full name',
        safe: false,
        feedback:
          'Good instinct to ask, but scammers often learn names from social media or just fish for them. Hanging up and calling the real person is more reliable.',
      },
      {
        id: 'd',
        label: 'Wait for the “lawyer” to call and see what they say',
        safe: false,
        feedback:
          'Waiting keeps you in the scammer’s plan. The “lawyer” is part of the script. It is better to contact the family yourself.',
      },
    ],
    warningSigns: [
      'An emergency that needs money right now.',
      'Asking you to keep it from other family members.',
      'A “lawyer” who will call to arrange payment.',
    ],
    techniques: ['trust', 'emotion', 'urgency', 'secrecy'],
    doInstead: [
      'Hang up and call your grandchild or another relative.',
      'Use a family code word if you have one.',
      'Never send cash, gift cards, or wire transfers to someone who called you.',
    ],
  },
  {
    id: 'boss-gift-cards',
    channel: 'Email',
    icon: '📧',
    title: 'The boss who needs a favor',
    message:
      'From: Diane Morris (CEO)\n\n“Are you at your desk? I’m in meetings all day and can’t take calls. I need you to buy $500 in gift cards for a client today. Scratch off the backs and send me the codes. I’ll reimburse you. Keep this between us for now.”',
    question: 'The email looks like it is from your boss. What would you do?',
    choices: [
      {
        id: 'a',
        label: 'Buy the gift cards and send the codes',
        safe: false,
        feedback:
          'This is very common, and it works because we want to help our boss. Real managers do not ask for gift card codes by email.',
      },
      {
        id: 'b',
        label: 'Reply and ask what the gift cards are for',
        safe: false,
        feedback:
          'Replying goes to the scammer, who will have an answer ready. It is better to check with your boss another way.',
      },
      {
        id: 'c',
        label: 'Contact my boss by phone or in person, and tell IT about the email',
        safe: true,
        feedback:
          'That is the right move. A quick real conversation settles it, and reporting the email can protect your coworkers too.',
      },
    ],
    warningSigns: [
      'The boss says they cannot take calls.',
      'The request involves gift cards.',
      'A request to keep it secret.',
      'A time limit: “today”.',
    ],
    techniques: ['authority', 'urgency', 'secrecy', 'payment'],
    doInstead: [
      'Verify through a different channel you already trust.',
      'Report it to your IT or security team.',
      'Never buy gift cards on an email request.',
    ],
  },
  {
    id: 'tech-support',
    channel: 'Phone call',
    icon: '💻',
    title: 'The “Microsoft” technician',
    message:
      '“Hello, this is Microsoft Technical Support. Our system shows that your computer has a serious virus and your bank information is at risk. I need you to give me remote access right now so I can remove it.”',
    question: 'The caller sounds professional. What would you do?',
    choices: [
      {
        id: 'a',
        label: 'Follow their instructions to give them access',
        safe: false,
        feedback:
          'It is understandable to worry about a virus. But once someone has remote access, they can see your accounts and passwords.',
      },
      {
        id: 'b',
        label: 'Hang up',
        safe: true,
        feedback:
          'Correct. Microsoft does not call people about viruses. Hanging up is the safest response, and it is not rude.',
      },
      {
        id: 'c',
        label: 'Ask for their phone number so I can call them back',
        safe: false,
        feedback:
          'A callback number from the caller will connect you right back to the scammer. If you are worried, find the company’s official support yourself.',
      },
    ],
    warningSigns: [
      'An unexpected call about a virus.',
      'A request for remote access.',
      'Fear: “your bank information is at risk”.',
    ],
    techniques: ['authority', 'fear', 'urgency'],
    doInstead: [
      'Hang up.',
      'If you are concerned, ask a trusted person or a local repair shop.',
      'Never give remote access to someone who contacted you.',
    ],
  },
  {
    id: 'romance',
    channel: 'Online chat',
    icon: '💌',
    title: 'The friend who needs help',
    message:
      '“I hate asking you this, my love. My bag was stolen at the airport and I can’t pay for my hotel or flight home. Can you send $1,500 in Bitcoin? I’ll pay you back as soon as I see you. Please don’t tell anyone, they won’t understand us.”',
    question: 'You have chatted with this person for months. What would you do?',
    choices: [
      {
        id: 'a',
        label: 'Send the money. They really seem to care about me',
        safe: false,
        feedback:
          'Feeling cared for is real, and these scammers are patient. But asking for money in crypto, secretly, is a major warning sign.',
      },
      {
        id: 'b',
        label: 'Ask them for a live video call first',
        safe: false,
        feedback:
          'Good idea, and it is a useful test. Still, do not send money while you wait. Talking to a trusted friend or family member is the next step.',
      },
      {
        id: 'c',
        label: 'Pause, tell a trusted friend or family member, and do not send money',
        safe: true,
        feedback:
          'This is the strongest move. Sharing it breaks the secrecy the scammer depends on. There is nothing embarrassing about asking for a second opinion.',
      },
    ],
    warningSigns: [
      'A sudden emergency that needs money.',
      'Payment in Bitcoin.',
      'A request to keep it secret.',
      'They have never met you in person.',
    ],
    techniques: ['emotion', 'trust', 'secrecy', 'payment'],
    doInstead: [
      'Talk to someone you trust.',
      'Never send money to someone you have not met in person.',
      'Report the profile to the website or app.',
    ],
  },
  {
    id: 'government',
    channel: 'Phone call',
    icon: '🏛️',
    title: 'The government agent',
    message:
      '“This is Agent Collins from the Social Security Administration. Your number has been linked to criminal activity and a warrant will be issued for your arrest today unless you pay a fine with gift cards. Do not hang up and do not speak to anyone.”',
    question: 'The caller says there is a warrant. What would you do?',
    choices: [
      {
        id: 'a',
        label: 'Do what they say to avoid being arrested',
        safe: false,
        feedback:
          'The fear is the point. These calls are designed to make smart people panic. No agency collects fines in gift cards.',
      },
      {
        id: 'b',
        label: 'Hang up, and find the agency’s real number on its official website',
        safe: true,
        feedback:
          'Exactly. You can check for yourself in a few minutes, and the real agency will confirm they did not call.',
      },
      {
        id: 'c',
        label: 'Stay on the line and ask them questions',
        safe: false,
        feedback:
          'Staying on the line gives them more chances to pressure you. Hanging up is the best option.',
      },
    ],
    warningSigns: [
      'A threat of arrest.',
      'Payment demanded in gift cards.',
      '“Do not hang up” and “do not speak to anyone”.',
    ],
    techniques: ['authority', 'fear', 'secrecy', 'payment', 'urgency'],
    doInstead: [
      'Hang up and talk to someone you trust.',
      'Look up the agency’s official number yourself.',
      'Never pay a fine with gift cards.',
    ],
  },
];
