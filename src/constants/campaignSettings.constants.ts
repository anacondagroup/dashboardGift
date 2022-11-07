import { reduce, assoc } from 'ramda';

export enum CAMPAIGN_TYPES {
  ACTIVATE = 'activate',
  SWAG = 'swag',
  STANDARD = 'standard',
  A4M = 'a4m',
  SWAG_DIGITAL = 'swag digital',
  SWAG_PHYSICAL = 'swag physical',
  PROSPECTING = 'prospecting',
}

export const CAMPAIGN_TYPE_NAMES = {
  [CAMPAIGN_TYPES.STANDARD]: 'Personal Gifting',
  [CAMPAIGN_TYPES.ACTIVATE]: 'Activate - All locations',
  [CAMPAIGN_TYPES.SWAG]: 'Gift Code Redemption',
  [CAMPAIGN_TYPES.A4M]: '1:Many',
  [CAMPAIGN_TYPES.PROSPECTING]: 'Prospecting Campaign',
};

export enum CAMPAIGN_STATUS {
  ACTIVE = 'active',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
  EXPIRED = 'expired',
  DISABLED = 'disabled',
}

export const CAPTURE_PHONE = 'capture_phone';
export const CAPTURE_EMAIL = 'capture_email';
export const CAPTURE_DATE = 'capture_date';
export const CAPTURE_QUESTION = 'capture_question';
export const CAPTURE_AFFIDAVIT = 'capture_affidavit';

export const REQUIRED_ACTIONS = [
  {
    id: CAPTURE_PHONE,
    title: 'Phone number',
    description: 'This will require the gift recipients to give the sender their phone number.',
  },
  {
    id: CAPTURE_EMAIL,
    title: 'Email',
    description: 'This will require the gift recipients to give the sender their email address.',
  },
  {
    id: CAPTURE_DATE,
    title: 'Calendar invite',
    description:
      'This will require the gift recipients to accept a time to talk to the sender. This meeting will be automatically added to both the recipient and senders calendar.',
  },
  {
    id: CAPTURE_QUESTION,
    title: 'Questions to ask',
    description: 'This will require the recipient to answer the predefined questions you add below.',
  },
  {
    id: CAPTURE_AFFIDAVIT,
    title: 'Terms to agree to',
    description: 'This will require the recipient to agree to the predefined terms you add below.',
  },
];

export const videoHostValidationRule = {
  'youtube.com': 'https://www.youtube.com/embed/',
  'wistia.net': ['https://fast.wistia.net/embed/', 'https://fast.wistia.com/embed/'],
  'wistia.com': ['https://fast.wistia.net/embed/', 'https://fast.wistia.com/embed/'],
  'vidyard.com': 'https://play.vidyard.com/',
  'vimeo.com': 'https://player.vimeo.com/',
};

// @ts-ignore
const transformRequiredActions = reduce((acc, action) => assoc(action.id, action.title, acc), {});

export const REQUIRED_ACTIONS_FIELDS = transformRequiredActions(REQUIRED_ACTIONS);

export const GIFT_EXPIRATION_PERIODS = [15, 30, 45, 60, 75, 90];
