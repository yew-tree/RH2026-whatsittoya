import { SampleEmail } from '../types/analyzer';

export const SAMPLE_EMAILS: SampleEmail[] = [
  {
    id: 'sample-1',
    title: 'The Fake PayPal Emergency (Rushing you with links)',
    category: 'phishing_urgent',
    categoryLabel: 'Urgent Alert',
    badgeColor: 'rose',
    keywordFlag: '* Possibly Fraudulent',
    sender: 'PayPal Customer Support <service-alert@paypa1-security-verification.com>',
    replyTo: 'billing-disputes@mail-tracker92.info',
    subject: 'URGENT: Your PayPal account will be closed in 12 hours',
    body: `Dear Customer,

We noticed unusual sign-in activity on your account from a computer far away.

YOUR ACCOUNT HAS BEEN TEMPORARILY SUSPENDED.

You must verify your billing information within 12 hours of receiving this email, or your balance will be permanently frozen and sent to collections.

Click below right away to secure your account:
https://www.paypal.com/verify-account-identity-now

If you do not complete this immediately, we are legally required to stop your banking services.

PayPal Customer Protection Team`,
    description: 'Notice how this email tries to cause panic with a 12-hour countdown. That rush is meant to make you click without checking!'
  },
  {
    id: 'sample-2',
    title: 'The Fake Microsoft Password Warning',
    category: 'link_deception',
    categoryLabel: 'Password Expiry',
    badgeColor: 'amber',
    keywordFlag: '* Possibly Fraudulent',
    sender: 'IT Administrator <admin@portal-office365-auth-sync.net>',
    subject: 'Action Required: Your email password expires today',
    body: `Hello Team Member,

Your email password will expire in 2 hours.

If you do not renew it today, you will lose access to your email and documents immediately.

Please click here to keep your current password:
http://185.220.101.45/m365-login/auth.php?user=employee

Thank you,
IT Support Helpdesk`,
    description: 'This email tries to trick you into typing your password into an unfamiliar website that is not Microsoft.'
  },
  {
    id: 'sample-3',
    title: 'The Fake Apple Receipt (Sent from a free Gmail account)',
    category: 'lookalike_spoof',
    categoryLabel: 'Order Confirmation',
    badgeColor: 'purple',
    keywordFlag: '* Possibly Fraudulent',
    sender: 'Apple Billing Support <apple.support.billing.dept991@gmail.com>',
    replyTo: 'refunds-apple-center@hotmail.com',
    subject: 'Receipt: Your order #APL-882910 for iPhone 16 ($1,199.00) has shipped',
    body: `Dear Customer,

Thank you for your order! Your purchase of Apple iPhone 16 ($1,199.00) has been charged to your card.

If you DID NOT buy this, please click below immediately to stop the shipment and get your money back:
http://apple-secure-account-dispute.top/cancel-order

Apple Inc., 1 Apple Park Way, Cupertino, CA.`,
    description: 'Scammers send fake bills hoping you get alarmed and click to "cancel" it. Notice it came from a random @gmail.com address!'
  },
  {
    id: 'sample-4',
    title: 'The Urgent Boss or Friend Wire Request',
    category: 'ceo_fraud',
    categoryLabel: 'Confidential Request',
    badgeColor: 'red',
    keywordFlag: '* Possibly Fraudulent',
    sender: 'Jonathan Vance <ceo-desk@office-cloud-executive-direct.com>',
    subject: 'STRICTLY CONFIDENTIAL: Immediate transfer needed today',
    body: `Hi,

Are you near a bank right now? I am in an all-day confidential meeting and cannot take phone calls.

We need to send a deposit of $4,500 before 3:00 PM today to avoid a late fee.

Please keep this just between us for now. Reply to this email right away so I can send you the bank information.

Thanks,
Jonathan`,
    description: 'Pretends to be someone in authority asking for quick money while claiming they cannot speak on the phone.'
  },
  {
    id: 'sample-5',
    title: 'The Fake Package Delivery Fee',
    category: 'link_deception',
    categoryLabel: 'Package Tracking',
    badgeColor: 'amber',
    keywordFlag: '* Possibly Fraudulent',
    sender: 'Package Delivery Team <tracking-update@dhl-parcel-notification.biz>',
    subject: 'We could not deliver your package #US-99214',
    body: `Hello,

We tried to deliver your package this morning, but your street number was missing and there is a small $2.49 redelivery fee.

To schedule your package delivery to your door, please update your address and pay the fee within 24 hours:
https://bit.ly/dhl-urgent-redelivery-fee-portal

Unclaimed packages will be returned after 48 hours.

Thank you!`,
    description: 'Very common text and email trick asking for just $2 or $3, but the fake website secretly steals your credit card number.'
  },
  {
    id: 'sample-6',
    title: 'An ordinary notice from GitHub',
    category: 'legit_security',
    categoryLabel: 'Standard Notice',
    badgeColor: 'emerald',
    keywordFlag: '',
    sender: 'GitHub <support@github.com>',
    subject: '[GitHub] Your personal access token will expire in 30 days',
    body: `Hi,

We are writing to let you know that your personal access token will expire in 30 days on November 2, 2026.

If you still need this token, you can view your settings here:
https://github.com/settings/tokens

If you no longer need it, no action is needed.

Thanks,
The GitHub Team`,
    description: 'A calm, ordinary email: no pressure, plenty of time (30 days), and a sender address that matches github.com. We would still find no major warning signs, but we cannot promise any message is genuine.'
  }
];
