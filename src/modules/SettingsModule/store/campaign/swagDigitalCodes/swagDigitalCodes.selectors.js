import * as R from 'ramda';
import { createSelector } from 'reselect';

import { GSD_STEP_1, GSD_STEP_2 } from '../../../../../constants/swagDigital.constants';

const pathToSwagSelectState = R.path(['settings', 'campaign', 'swagDigitalCodes']);

export const getSwagDigitalCodesCampaignId = createSelector(
  pathToSwagSelectState,
  swagDigital => swagDigital.campaignId,
);

export const getSwagDigitalCodesTeamId = createSelector(pathToSwagSelectState, swagDigital => swagDigital.teamId);

export const getSwagDigitalCodesSteps = createSelector(pathToSwagSelectState, swagDigital => swagDigital.steps);

export const getSwagDigitalGenerateCodesData = createSelector(pathToSwagSelectState, ({ steps }) => {
  const { codesBatchName, owner } = steps[GSD_STEP_1].data;
  const { codesAmount, codesExpirationDate } = steps[GSD_STEP_2].data;
  return {
    codesBatchOwnerId: owner.id,
    codesBatchName,
    codesAmount,
    codesExpirationDate,
  };
});
