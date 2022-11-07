import {
  CREATE_CAMPAIGN_SIDEBAR_CLOSE,
  CREATE_CAMPAIGN_SIDEBAR_SWAG_SELECT,
  CREATE_CAMPAIGN_SIDEBAR_CHOOSE_CAMPAIGN,
  CREATE_CAMPAIGN_SIDEBAR_LOADING_DATA,
  CREATE_CAMPAIGN_SIDEBAR_SWAG_DIGITAL_CODES,
  CREATE_CAMPAIGN_SIDEBAR_SWAG_PHYSICAL_CODES,
} from './createCampaignSidebar.types';

export const createCampaignSidebarSwagSelect = () => ({
  type: CREATE_CAMPAIGN_SIDEBAR_SWAG_SELECT,
});

export const createCampaignSidebarAddSwagDigitalCodes = () => ({
  type: CREATE_CAMPAIGN_SIDEBAR_SWAG_DIGITAL_CODES,
});

export const createCampaignSidebarAddSwagPhysicalCodes = () => ({
  type: CREATE_CAMPAIGN_SIDEBAR_SWAG_PHYSICAL_CODES,
});

export const createCampaignSidebarChooseCampaign = () => ({
  type: CREATE_CAMPAIGN_SIDEBAR_CHOOSE_CAMPAIGN,
});

export const createCampaignSidebarLoadingData = () => ({
  type: CREATE_CAMPAIGN_SIDEBAR_LOADING_DATA,
});

export const createCampaignSidebarClose = payload => ({
  type: CREATE_CAMPAIGN_SIDEBAR_CLOSE,
  payload,
});
