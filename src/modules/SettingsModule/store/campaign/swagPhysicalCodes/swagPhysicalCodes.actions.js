import {
  SWAG_PHYSICAL_CAMPAIGN_DATA_FAIL,
  SWAG_PHYSICAL_CAMPAIGN_DATA_REQUEST,
  SWAG_PHYSICAL_CAMPAIGN_DATA_SUCCESS,
  SWAG_PHYSICAL_CODES_CHANGE_STEP,
  SWAG_PHYSICAL_CODES_GENERATE_FLOW_WIZARD_REQUEST,
  SWAG_PHYSICAL_CODES_SET_STEP_DATA,
  SWAG_PHYSICAL_GENERATE_CODES_FAIL,
  SWAG_PHYSICAL_GENERATE_CODES_REQUEST,
  SWAG_PHYSICAL_GENERATE_CODES_SUCCESS,
} from './swagPhysicalCodes.types';

export const swagPhysicalCodesGenerateFlowWizardRequest = payload => ({
  type: SWAG_PHYSICAL_CODES_GENERATE_FLOW_WIZARD_REQUEST,
  payload,
});

export const swagPhysicalCodesChangeStep = payload => ({
  type: SWAG_PHYSICAL_CODES_CHANGE_STEP,
  payload,
});

export const swagPhysicalCodesSetStep = payload => ({
  type: SWAG_PHYSICAL_CODES_SET_STEP_DATA,
  payload,
});

export const swagPhysicalCampaignDataRequest = payload => ({
  type: SWAG_PHYSICAL_CAMPAIGN_DATA_REQUEST,
  payload,
});

export const swagPhysicalCampaignDataSuccess = payload => ({
  type: SWAG_PHYSICAL_CAMPAIGN_DATA_SUCCESS,
  payload,
});

export const swagPhysicalCampaignDataFail = payload => ({
  type: SWAG_PHYSICAL_CAMPAIGN_DATA_FAIL,
  payload,
});

export const swagPhysicalGenerateCodesRequest = payload => ({
  type: SWAG_PHYSICAL_GENERATE_CODES_REQUEST,
  payload,
});

export const swagPhysicalGenerateCodesSuccess = payload => ({
  type: SWAG_PHYSICAL_GENERATE_CODES_SUCCESS,
  payload,
});

export const swagPhysicalGenerateCodesFail = payload => ({
  type: SWAG_PHYSICAL_GENERATE_CODES_FAIL,
  payload,
});
