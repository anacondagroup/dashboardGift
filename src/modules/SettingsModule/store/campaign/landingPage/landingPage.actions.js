import { action } from '@alycecom/utils';

import { LOAD_CAMPAIGN_LANDING_PAGE_MESSAGE, UPDATE_CAMPAIGN_LANDING_PAGE_MESSAGE } from './landingPage.types';

export const campaignLandingPageMessageLoadRequest = campaignId =>
  action(LOAD_CAMPAIGN_LANDING_PAGE_MESSAGE.REQUEST, campaignId);
export const campaignSwagLandingPageMessageLoadSuccess = ({ header, message }) =>
  action(LOAD_CAMPAIGN_LANDING_PAGE_MESSAGE.SUCCESS, { header, message });
export const campaignSwagLandingPageMessageLoadFail = ({ header, message }) =>
  action(LOAD_CAMPAIGN_LANDING_PAGE_MESSAGE.FAIL, { header, message });

export const updateCampaignLandingPageMessageRequest = ({ campaignId, header, message }) =>
  action(UPDATE_CAMPAIGN_LANDING_PAGE_MESSAGE.REQUEST, { campaignId, header, message });
export const updateCampaignLandingPageMessageSuccess = () => action(UPDATE_CAMPAIGN_LANDING_PAGE_MESSAGE.SUCCESS);
export const updateCampaignLandingPageMessageFail = error => action(UPDATE_CAMPAIGN_LANDING_PAGE_MESSAGE.FAIL, error);
