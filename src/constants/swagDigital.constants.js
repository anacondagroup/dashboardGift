export const GENERATE_SWAG_DIGITAL_STATES = {
  ACTIVE: 'ACTIVE',
  UNTOUCHED: 'UNTOUCHED',
  COMPLETED: 'COMPLETED',
};

export const GSD_STEP_1 = 'GSD_STEP_1';
export const GSD_STEP_2 = 'GSD_STEP_2';

const ChooseCampaignOwnerSection = {
  order: 1,
  title: 'Who will own this batch of codes?',
  status: GENERATE_SWAG_DIGITAL_STATES.ACTIVE,
  isLoading: false,
  data: {
    owner: undefined,
    codesBatchName: undefined,
  },
};

const SetDetailsAndDownloadSection = {
  order: 2,
  title: 'What are the other details about the codes?',
  status: GENERATE_SWAG_DIGITAL_STATES.UNTOUCHED,
  isLoading: false,
  data: {
    codesAmount: undefined,
    codesExpirationDate: undefined,
    codesCreationRequestId: undefined,
    codesBatchId: undefined,
    isFinished: false,
    codesCsvFileUrl: undefined,
  },
};

export const GENERATE_SWAG_DIGITAL_FLOW = {
  GSD_STEP_1: ChooseCampaignOwnerSection,
  GSD_STEP_2: SetDetailsAndDownloadSection,
};
