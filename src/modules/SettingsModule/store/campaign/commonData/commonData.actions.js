import {
  COMMON_CAMPAIGN_SETTINGS_DATA_REQUEST,
  COMMON_CAMPAIGN_SETTINGS_DATA_SUCCESS,
  COMMON_CAMPAIGN_SETTINGS_DATA_FAIL,
  COMMON_CAMPAIGN_SETTINGS_CLEAR_DATA,
  COMMON_CAMPAIGN_SETTINGS_SET_ALLOW_EDIT_TEMPLATE,
} from './commonData.types';

export const commonCampaignSettingsDataRequest = payload => ({
  type: COMMON_CAMPAIGN_SETTINGS_DATA_REQUEST,
  payload,
});

export const commonCampaignSettingsDataSuccess = payload => ({
  type: COMMON_CAMPAIGN_SETTINGS_DATA_SUCCESS,
  payload,
});

export const commonCampaignSettingsDataFail = payload => ({
  type: COMMON_CAMPAIGN_SETTINGS_DATA_FAIL,
  payload,
});

export const commonCampaignSettingsClearData = () => ({
  type: COMMON_CAMPAIGN_SETTINGS_CLEAR_DATA,
});

export const commonCampaignSettingsSetAllowEditTemplate = payload => ({
  type: COMMON_CAMPAIGN_SETTINGS_SET_ALLOW_EDIT_TEMPLATE,
  payload,
});
