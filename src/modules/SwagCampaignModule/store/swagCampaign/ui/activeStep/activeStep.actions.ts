import { createAction } from 'redux-act';

import { SwagCampaignBuilderStep } from '../../../../routePaths';

const prefix = 'SWAG_CAMPAIGN/UI/ACTIVE_STEP';

export const goToNextStep = createAction(`${prefix}/GO_NEXT`);

export const goToPrevStep = createAction(`${prefix}/GO_BACK`);

export const setActiveStep = createAction<
  SwagCampaignBuilderStep,
  { replace: boolean } | void,
  SwagCampaignBuilderStep,
  { replace: boolean }
>(
  `${prefix}/SET`,
  step => step,
  (_, meta = { replace: false }) => meta,
);
