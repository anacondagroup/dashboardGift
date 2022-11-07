import * as R from 'ramda';
import { createSelector } from 'reselect';

import {
  SS_CAMPAIGN_TYPE_STEP,
  SS_CAMPAIGN_NAME_STEP,
  SS_OWNERSHIP_STEP,
  SS_BUDGET_STEP,
  SS_MARKETPLACE_STEP,
  SS_LANDING_PAGE_STEP,
  SS_REQUIRED_ACTIONS_STEP,
  SS_GENERATE_CODES_STEP,
  SS_CARD_CONFIGURATOR_STEP,
  SS_CARD_ORDER_OPTIONS_STEP,
  defaultRecipientRequiredActions,
} from '../../../../../constants/swagSelect.constants';

const pathToSwagSelectState = R.path(['settings', 'campaign', 'swagSelect']);

export const getSwagSelectCampaignId = createSelector(pathToSwagSelectState, swagSelect => swagSelect.campaignId);

export const getSwagSelectCampaignSteps = createSelector(pathToSwagSelectState, swagSelect => swagSelect.steps);

export const getSwagSelectCampaignCreationData = createSelector(pathToSwagSelectState, ({ steps }) => {
  const { campaignType } = steps[SS_CAMPAIGN_TYPE_STEP].data;
  const { campaignName } = steps[SS_CAMPAIGN_NAME_STEP].data;
  const { data } = steps[SS_OWNERSHIP_STEP];
  return {
    campaignType: `swag ${R.toLower(campaignType)}`,
    campaignName,
    ownerId: data.owner.id,
    teamId: data.team.id,
  };
});

export const getSwagSelectCampaignType = createSelector(
  pathToSwagSelectState,
  ({ steps }) => steps[SS_CAMPAIGN_TYPE_STEP].data.campaignType,
);

export const getSwagSelectCampaignName = createSelector(pathToSwagSelectState, ({ steps }) => {
  const { data } = steps[SS_CAMPAIGN_NAME_STEP];
  return data;
});

export const getSwagSelectCampaignOwnershipData = createSelector(pathToSwagSelectState, ({ steps }) => {
  const { data } = steps[SS_OWNERSHIP_STEP];
  return { ownerId: data.owner.id, teamId: data.team.id };
});

export const getSwagSelectCampaignBudgetData = createSelector(pathToSwagSelectState, ({ steps }) => {
  const { data } = steps[SS_BUDGET_STEP] || {};
  return data;
});

export const getSwagSelectCampaignMarketplaceData = createSelector(pathToSwagSelectState, ({ steps }) => {
  const { data } = steps[SS_MARKETPLACE_STEP] || {};
  return data;
});

export const getSwagSelectCampaignLandingData = createSelector(pathToSwagSelectState, ({ steps }) => {
  const { data } = steps[SS_LANDING_PAGE_STEP];
  return data;
});

export const getSwagSelectRecipientActionData = createSelector(pathToSwagSelectState, ({ steps }) => {
  const { data } = steps[SS_REQUIRED_ACTIONS_STEP];
  const actions = R.mergeRight(defaultRecipientRequiredActions, data.actions);
  return { ...actions };
});

export const getSwagSelectGenerateCodesData = createSelector(pathToSwagSelectState, ({ steps }) => {
  const { data } = steps[SS_GENERATE_CODES_STEP];
  const { codesBatchName, codesAmount, codesExpirationDate } = data;
  return {
    codesBatchName,
    codesAmount,
    codesExpirationDate,
  };
});

export const getSwagSelectPhysicalCardData = createSelector(
  pathToSwagSelectState,
  ({ steps }) => steps[SS_CARD_CONFIGURATOR_STEP].data,
);

export const getSwagSelectCardsOrderData = createSelector(
  pathToSwagSelectState,
  ({ steps }) => steps[SS_CARD_ORDER_OPTIONS_STEP].data,
);
