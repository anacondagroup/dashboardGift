import {
  CAPTURE_AFFIDAVIT,
  CAPTURE_DATE,
  CAPTURE_EMAIL,
  CAPTURE_PHONE,
  CAPTURE_QUESTION,
  GIFTER_AFFIDAVIT,
  GIFTER_QUESTION,
} from '../modules/SettingsModule/constants/recipientActions.constants';

export const SWAG_DIGITAL = 'swag digital';
export const SWAG_PHYSICAL = 'swag physical';

export const SWAG_SELECT_FLOW_STATES = {
  ACTIVE: 'ACTIVE',
  UNTOUCHED: 'UNTOUCHED',
  SKIPPED: 'SKIPPED',
  COMPLETED: 'COMPLETED',
};

// FLOW STEP NAMES
export const SS_CAMPAIGN_TYPE_STEP = 'campaignType';
export const SS_CAMPAIGN_NAME_STEP = 'campaignName';
export const SS_OWNERSHIP_STEP = 'owner';
export const SS_BUDGET_STEP = 'budget';
export const SS_MARKETPLACE_STEP = 'marketplace';
export const SS_LANDING_PAGE_STEP = 'landingPage';
export const SS_REQUIRED_ACTIONS_STEP = 'requiredActions';
export const SS_GENERATE_CODES_STEP = 'giftCodes';

export const SS_CARD_CONFIGURATOR_STEP = 'physicalCard';
export const SS_CARD_ORDER_OPTIONS_STEP = 'physicalCardOrder';
export const SS_CARD_ORDER_REVIEW_STEP = 'reviewData';
export const SS_ORDER_STATUS_FINAL_STEP = 'orderStatus';

// PHYSICAL CARD STYLES
export const CARD_STANDARD_STYLE = 'standard';
export const CARD_MOO_STYLE = 'moo-size';
export const CARD_SQUARE_STYLE = 'square';

// Default required actions
export const defaultRecipientRequiredActions = {
  [CAPTURE_PHONE]: false,
  [CAPTURE_EMAIL]: false,
  [CAPTURE_DATE]: false,
  [CAPTURE_QUESTION]: false,
  [GIFTER_QUESTION]: '',
  [CAPTURE_AFFIDAVIT]: false,
  [GIFTER_AFFIDAVIT]: '',
};

// Physical cards amounts array
export const codesAmountValues = [50, 100, 150, 200, 400, 600, 800, 1000];

// address formatting helper
export const addressToString = ({ addressLine1, addressLine2, state, city, zip }) =>
  [addressLine1, addressLine2, state, city, zip].filter(Boolean).join(', ');

export const SWAG_FILTER_TYPES = {
  ALL_PRODUCTS: 1,
  AVAILABLE_PRODUCTS: 2,
  RESTRICTED_PRODUCTS: 3,
};

// SECTIONS MAPPING
const ChooseSwagCampaignTypeSection = {
  title: 'Before we begin, let’s check out the overview!',
  status: SWAG_SELECT_FLOW_STATES.ACTIVE,
  data: {
    campaignType: undefined,
  },
};

const CampaignNameSection = {
  title: 'What are we calling this campaign?',
  status: SWAG_SELECT_FLOW_STATES.UNTOUCHED,
  isLoading: false,
  data: {
    campaignName: '',
  },
};

const ChooseCampaignOwnerSection = {
  title: 'Who will own this campaign?',
  status: SWAG_SELECT_FLOW_STATES.UNTOUCHED,
  isLoading: false,
  data: {
    team: undefined,
    owner: undefined,
  },
};

const SwagRangeAmountsSection = {
  title: 'What are your gift options?',
  status: SWAG_SELECT_FLOW_STATES.UNTOUCHED,
  isLoading: false,
  data: {},
};

const SwagMarketplaceOptionsSection = {
  title: 'What is the leading gift for this campaign? ',
  status: SWAG_SELECT_FLOW_STATES.UNTOUCHED,
  isLoading: false,
  data: {
    restrictedProductIds: undefined,
  },
};

const LandingPageMessageSection = {
  title: 'What is the gift redemption page messaging?',
  status: SWAG_SELECT_FLOW_STATES.UNTOUCHED,
  isLoading: false,
  data: {
    header: undefined,
    message: undefined,
  },
};

const SelectRecipientActionsSection = {
  title: 'Would you like to configure recipient actions?',
  status: SWAG_SELECT_FLOW_STATES.UNTOUCHED,
  isLoading: false,
  data: {},
};

const GiftCardConfiguratorSection = {
  title: 'What should your physical cards look like?',
  status: SWAG_SELECT_FLOW_STATES.UNTOUCHED,
  isLoading: false,
  data: {
    cardLogo: undefined,
    cardType: undefined,
    cardColor: undefined,
    cardCopyFirstLine: undefined,
    cardCopySecondLine: undefined,
    cardCopyThirdLine: undefined,
  },
};

const PhysicalCardsOptionsSection = {
  title: 'What are the other details about the card order?',
  status: SWAG_SELECT_FLOW_STATES.UNTOUCHED,
  isLoading: false,
  data: {
    codesBatchName: undefined,
    codesAmount: undefined,
    codesExpirationDate: undefined,
    contactName: undefined,
    deliveryAddress: undefined,
  },
};

const ReviewCardOptionsSection = {
  title: 'Review card for printing',
  status: SWAG_SELECT_FLOW_STATES.UNTOUCHED,
  isLoading: false,
  data: {
    orderId: undefined,
    codesBatchOwnerId: undefined,
    deliveryAddress: undefined,
    isConfirmed: false,
  },
};

const OrderCardsStatusSection = {
  title: 'Your Gift Redemption Card order has been submitted',
  status: SWAG_SELECT_FLOW_STATES.UNTOUCHED,
  isLoading: false,
  data: {},
};

const SetDetailsAndDownloadSection = {
  title: 'What are the other details about the codes?',
  status: SWAG_SELECT_FLOW_STATES.UNTOUCHED,
  isLoading: false,
  data: {
    codesBatchName: undefined,
    codesAmount: undefined,
    codesExpirationDate: undefined,
    codesCreationRequestId: undefined,
    codesBatchId: undefined,
    isFinished: false,
    codesCsvFileUrl: undefined,
  },
};

export const SWAG_SELECT_FLOW = {
  [SS_CAMPAIGN_TYPE_STEP]: ChooseSwagCampaignTypeSection,
  [SS_CAMPAIGN_NAME_STEP]: CampaignNameSection,
  [SS_OWNERSHIP_STEP]: ChooseCampaignOwnerSection,
  [SS_BUDGET_STEP]: SwagRangeAmountsSection,
  [SS_MARKETPLACE_STEP]: SwagMarketplaceOptionsSection,
  [SS_LANDING_PAGE_STEP]: LandingPageMessageSection,
  [SS_REQUIRED_ACTIONS_STEP]: SelectRecipientActionsSection,
};

export const ENDING_SWAG_SELECT_DIGITAL = {
  [SS_GENERATE_CODES_STEP]: SetDetailsAndDownloadSection,
};

export const ENDING_SWAG_SELECT_PHYSICAL = {
  [SS_CARD_CONFIGURATOR_STEP]: GiftCardConfiguratorSection,
  [SS_CARD_ORDER_OPTIONS_STEP]: PhysicalCardsOptionsSection,
  [SS_CARD_ORDER_REVIEW_STEP]: ReviewCardOptionsSection,
  [SS_ORDER_STATUS_FINAL_STEP]: OrderCardsStatusSection,
};

export const ExchangeOptions = {
  Budget: 'budget',
  CustomMarketplace: 'customMarketplace',
};
