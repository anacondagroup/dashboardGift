import { action } from '@alycecom/utils';

import {
  LOAD_CAMPAIGN_SWAG_INVITES_SETTINGS,
  UPDATE_SWAG_CAMPAIGN_BUDGET_SETTINGS,
  UPDATE_SWAG_CAMPAIGN_REQUIRED_ACTIONS_SETTINGS,
  UPDATE_SWAG_CAMPAIGN_PRODUCT_TYPES,
  LOAD_SWAG_CAMPAIGN_PRODUCT_TYPES,
} from './swagInvites.types';

export const campaignSwagInvitesSettingsLoadRequest = campaignId =>
  action(LOAD_CAMPAIGN_SWAG_INVITES_SETTINGS.REQUEST, campaignId);
export const campaignSwagInvitesSettingsLoadSuccess = campaign =>
  action(LOAD_CAMPAIGN_SWAG_INVITES_SETTINGS.SUCCESS, campaign);
export const campaignSwagInvitesSettingsLoadFail = error => action(LOAD_CAMPAIGN_SWAG_INVITES_SETTINGS.FAIL, error);

export const campaignSwagUpdateBudgetRequest = payload => action(UPDATE_SWAG_CAMPAIGN_BUDGET_SETTINGS.REQUEST, payload);
export const campaignSwagUpdateBudgetSuccess = budget => action(UPDATE_SWAG_CAMPAIGN_BUDGET_SETTINGS.SUCCESS, budget);
export const campaignSwagUpdateBudgetFail = errors => action(UPDATE_SWAG_CAMPAIGN_BUDGET_SETTINGS.FAIL, errors);

export const loadCampaignSwagProductTypesRequest = types => action(LOAD_SWAG_CAMPAIGN_PRODUCT_TYPES.REQUEST, types);
export const loadCampaignSwagProductTypesSuccess = types => action(LOAD_SWAG_CAMPAIGN_PRODUCT_TYPES.SUCCESS, types);
export const loadCampaignSwagProductTypesFail = errors => action(LOAD_SWAG_CAMPAIGN_PRODUCT_TYPES.FAIL, errors);
export const updateCampaignSwagProductTypesRequest = types => action(UPDATE_SWAG_CAMPAIGN_PRODUCT_TYPES.REQUEST, types);
export const updateCampaignSwagProductTypesSuccess = types => action(UPDATE_SWAG_CAMPAIGN_PRODUCT_TYPES.SUCCESS, types);
export const updateCampaignSwagProductTypesFail = errors => action(UPDATE_SWAG_CAMPAIGN_PRODUCT_TYPES.FAIL, errors);

export const campaignGiftUpdateRequiredActionsRequest = payload =>
  action(UPDATE_SWAG_CAMPAIGN_REQUIRED_ACTIONS_SETTINGS.REQUEST, payload);
export const campaignGiftUpdateRequiredActionsSuccess = actions =>
  action(UPDATE_SWAG_CAMPAIGN_REQUIRED_ACTIONS_SETTINGS.SUCCESS, actions);
export const campaignGiftUpdateRequiredActionsFail = errors =>
  action(UPDATE_SWAG_CAMPAIGN_REQUIRED_ACTIONS_SETTINGS.FAIL, errors);
