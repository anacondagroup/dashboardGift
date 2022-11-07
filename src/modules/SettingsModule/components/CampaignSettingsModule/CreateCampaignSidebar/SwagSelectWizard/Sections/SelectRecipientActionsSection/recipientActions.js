export const CAPTURE_PHONE = 'capturePhone';
export const CAPTURE_EMAIL = 'captureEmail';
export const CAPTURE_DATE = 'captureDate';
export const CAPTURE_QUESTION = 'captureQuestion';
export const CAPTURE_AFFIDAVIT = 'captureAffidavit';
export const GIFTER_QUESTION = 'gifterQuestion';
export const GIFTER_AFFIDAVIT = 'gifterAffidavit';

export const RECIPIENT_REQUIRED_ACTIONS = [
  {
    name: CAPTURE_PHONE,
    title: 'Phone number',
    description: 'Require recipients to give the sender their phone number.',
  },
  {
    name: CAPTURE_EMAIL,
    title: 'Email',
    description: 'Require recipients to give the sender their email address.',
  },
  {
    name: CAPTURE_DATE,
    title: 'Calendar invite',
    description:
      'Require recipients to accept a time to talk to the sender. The meeting will be added to both the recipient and senders calendar.',
  },
  {
    name: CAPTURE_QUESTION,
    title: 'Questions to ask',
    description: 'Require recipients to answer the predefined questions you add below.',
    textField: {
      name: GIFTER_QUESTION,
      placeholder: 'Your question',
    },
  },
  {
    name: CAPTURE_AFFIDAVIT,
    title: 'Terms to agree to',
    description: 'Require recipients to agree the predefined terms you add below.',
    textField: {
      name: GIFTER_AFFIDAVIT,
      placeholder: 'Your terms',
    },
  },
];
