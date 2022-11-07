export const GENERATE_SWAG_PHYSICAL_STATES = {
  ACTIVE: 'ACTIVE',
  UNTOUCHED: 'UNTOUCHED',
  COMPLETED: 'COMPLETED',
};

export const GSP_STEP_1 = 'GSP_STEP_1';
export const GSP_STEP_2 = 'GSP_STEP_2';
export const GSP_STEP_3 = 'GSP_STEP_3';
export const GSP_STEP_4 = 'GSP_STEP_4';

const ChooseCampaignOwnerSection = {
  title: 'Who will own this campaign?',
  status: GENERATE_SWAG_PHYSICAL_STATES.ACTIVE,
  isLoading: false,
  data: {
    owner: undefined,
    codesBatchName: undefined,
  },
};

const PhysicalCardsOptionsSection = {
  title: 'What are the other details about the card order?',
  status: GENERATE_SWAG_PHYSICAL_STATES.UNTOUCHED,
  isLoading: false,
  data: {
    codesAmount: undefined,
    codesExpirationDate: undefined,
    contactName: undefined,
    deliveryAddress: undefined,
  },
};

const ReviewCardOptionsSection = {
  title: 'Review card for printing',
  status: GENERATE_SWAG_PHYSICAL_STATES.UNTOUCHED,
  isLoading: false,
  data: {
    isConfirmed: false,
  },
};

const OrderCardsStatusSection = {
  title: 'Your Gift Redemption Card order has been submitted',
  status: GENERATE_SWAG_PHYSICAL_STATES.UNTOUCHED,
  isLoading: false,
  data: {},
};

export const GENERATE_SWAG_PHYSICAL_CARDS_FLOW = {
  [GSP_STEP_1]: ChooseCampaignOwnerSection,
  [GSP_STEP_2]: PhysicalCardsOptionsSection,
  [GSP_STEP_3]: ReviewCardOptionsSection,
  [GSP_STEP_4]: OrderCardsStatusSection,
};
