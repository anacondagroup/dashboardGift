import * as R from 'ramda';
import { createSelector } from 'reselect';

import { GSP_STEP_1, GSP_STEP_2 } from '../../../../../constants/swagPhysical.constants';

const pathToSwagPhysicalCodes = R.path(['settings', 'campaign', 'swagPhysicalCodes']);

export const getSwagPhysicalCodesCampaignId = createSelector(
  pathToSwagPhysicalCodes,
  swagPhysical => swagPhysical.campaignId,
);

export const getSwagPhysicalCodesTeamId = createSelector(pathToSwagPhysicalCodes, swagPhysical => swagPhysical.teamId);

export const getSwagPhysicalCodesSections = createSelector(pathToSwagPhysicalCodes, swagPhysical => swagPhysical.steps);

export const getSwagPhysicalOrderData = createSelector(
  pathToSwagPhysicalCodes,
  swagPhysical => swagPhysical.steps[GSP_STEP_2].data,
);

export const getSwagSelectPreviewImages = createSelector(pathToSwagPhysicalCodes, ({ frontPreview, backPreview }) => ({
  frontPreview,
  backPreview,
}));

export const getSwagPhysicalGenerateCodesData = createSelector(pathToSwagPhysicalCodes, ({ steps }) => {
  const { codesBatchName, owner } = steps[GSP_STEP_1].data;
  const { codesAmount, codesExpirationDate, contactName, deliveryAddress } = steps[GSP_STEP_2].data;
  return {
    codesBatchOwnerId: owner.id,
    codesBatchName,
    codesAmount,
    codesExpirationDate,
    contactName,
    deliveryAddress,
  };
});
