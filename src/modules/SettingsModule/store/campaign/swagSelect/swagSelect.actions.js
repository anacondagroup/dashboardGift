import {
  SWAG_SELECT_CHANGE_STEP,
  SWAG_SELECT_CLEAR_DATA_ON_CLOSE_SIDEBAR,
  SWAG_SELECT_CREATE_CAMPAIGN_FAIL,
  SWAG_SELECT_CREATE_CAMPAIGN_REQUEST,
  SWAG_SELECT_CREATE_CAMPAIGN_SUCCESS,
  SWAG_SELECT_GENERATE_CODES_FAIL,
  SWAG_SELECT_GENERATE_CODES_REQUEST,
  SWAG_SELECT_GENERATE_CODES_SUCCESS,
  SWAG_SELECT_GENERATION_CODES_PROGRESS_FAIL,
  SWAG_SELECT_GENERATION_CODES_PROGRESS_FINISH,
  SWAG_SELECT_GENERATION_CODES_PROGRESS_REQUEST,
  SWAG_SELECT_GENERATION_CODES_PROGRESS_SUCCESS,
  SWAG_SELECT_LOAD_CAMPAIGN_REQUEST,
  SWAG_SELECT_SAVE_PHYSICAL_CARD_FAIL,
  SWAG_SELECT_SAVE_PHYSICAL_CARD_REQUEST,
  SWAG_SELECT_SAVE_PHYSICAL_CARD_SUCCESS,
  SWAG_SELECT_SEND_ORDER_TO_PROCESSING_FAIL,
  SWAG_SELECT_SEND_ORDER_TO_PROCESSING_REQUEST,
  SWAG_SELECT_SEND_ORDER_TO_PROCESSING_SUCCESS,
  SWAG_SELECT_SET_CAMPAIGN_TYPE,
  SWAG_SELECT_SET_STEP_DATA,
  SWAG_SELECT_SKIP_STEP,
  SWAG_SELECT_UPDATE_CAMPAIGN_BUDGET_FAIL,
  SWAG_SELECT_UPDATE_CAMPAIGN_BUDGET_REQUEST,
  SWAG_SELECT_UPDATE_CAMPAIGN_BUDGET_SUCCESS,
  SWAG_SELECT_UPDATE_CAMPAIGN_LANDING_FAIL,
  SWAG_SELECT_UPDATE_CAMPAIGN_LANDING_REQUEST,
  SWAG_SELECT_UPDATE_CAMPAIGN_LANDING_SUCCESS,
  SWAG_SELECT_UPDATE_CAMPAIGN_NAME_FAIL,
  SWAG_SELECT_UPDATE_CAMPAIGN_NAME_REQUEST,
  SWAG_SELECT_UPDATE_CAMPAIGN_NAME_SUCCESS,
  SWAG_SELECT_UPDATE_CAMPAIGN_OWNERSHIP_FAIL,
  SWAG_SELECT_UPDATE_CAMPAIGN_OWNERSHIP_REQUEST,
  SWAG_SELECT_UPDATE_CAMPAIGN_OWNERSHIP_SUCCESS,
  SWAG_SELECT_UPDATE_CAMPAIGN_VENDOR_FAIL,
  SWAG_SELECT_UPDATE_CAMPAIGN_VENDOR_REQUEST,
  SWAG_SELECT_UPDATE_CAMPAIGN_VENDOR_SUCCESS,
  SWAG_SELECT_UPDATE_CARDS_ORDER_DATA_FAIL,
  SWAG_SELECT_UPDATE_CARDS_ORDER_DATA_REQUEST,
  SWAG_SELECT_UPDATE_CARDS_ORDER_DATA_SUCCESS,
  SWAG_SELECT_UPDATE_RECIPIENT_ACTIONS_FAIL,
  SWAG_SELECT_UPDATE_RECIPIENT_ACTIONS_REQUEST,
  SWAG_SELECT_UPDATE_RECIPIENT_ACTIONS_SUCCESS,
  SWAG_SELECT_UPDATE_RESTRICTED_PRODUCTS_FAIL,
  SWAG_SELECT_UPDATE_RESTRICTED_PRODUCTS_REQUEST,
  SWAG_SELECT_UPDATE_RESTRICTED_PRODUCTS_SUCCESS,
  SWAG_SELECT_WIZARD_INIT,
} from './swagSelect.types';

export const swagSelectWizardInit = payload => ({
  type: SWAG_SELECT_WIZARD_INIT,
  payload,
});

export const swagSelectChangeStep = payload => ({
  type: SWAG_SELECT_CHANGE_STEP,
  payload,
});

export const swagSelectSkipStep = payload => ({
  type: SWAG_SELECT_SKIP_STEP,
  payload,
});

export const swagSelectSetStepData = payload => ({
  type: SWAG_SELECT_SET_STEP_DATA,
  payload,
});

export const swagSelectCreateCampaignRequest = payload => ({
  type: SWAG_SELECT_CREATE_CAMPAIGN_REQUEST,
  payload,
});

export const swagSelectCreateCampaignSuccess = payload => ({
  type: SWAG_SELECT_CREATE_CAMPAIGN_SUCCESS,
  payload,
});

export const swagSelectCreateCampaignFail = payload => ({
  type: SWAG_SELECT_CREATE_CAMPAIGN_FAIL,
  payload,
});

export const swagSelectLoadCampaignRequest = (payload, openSidebar = true) => ({
  type: SWAG_SELECT_LOAD_CAMPAIGN_REQUEST,
  payload,
  meta: openSidebar,
});

export const swagSelectSetCampaignType = payload => ({
  type: SWAG_SELECT_SET_CAMPAIGN_TYPE,
  payload,
});

// Update Campaign Name

export const swagSelectUpdateCampaignNameRequest = payload => ({
  type: SWAG_SELECT_UPDATE_CAMPAIGN_NAME_REQUEST,
  payload,
});

export const swagSelectUpdateCampaignNameSuccess = payload => ({
  type: SWAG_SELECT_UPDATE_CAMPAIGN_NAME_SUCCESS,
  payload,
});

export const swagSelectUpdateCampaignNameFail = payload => ({
  type: SWAG_SELECT_UPDATE_CAMPAIGN_NAME_FAIL,
  payload,
});

// UPDATE CAMPAIGN OWNERSHIP

export const swagSelectUpdateCampaignOwnershipRequest = payload => ({
  type: SWAG_SELECT_UPDATE_CAMPAIGN_OWNERSHIP_REQUEST,
  payload,
});

export const swagSelectUpdateCampaignOwnershipSuccess = payload => ({
  type: SWAG_SELECT_UPDATE_CAMPAIGN_OWNERSHIP_SUCCESS,
  payload,
});

export const swagSelectUpdateCampaignOwnershipFail = payload => ({
  type: SWAG_SELECT_UPDATE_CAMPAIGN_OWNERSHIP_FAIL,
  payload,
});

// UPDATE SWAG VENDOR TYPE

export const swagSelectUpdateVendorTypeRequest = payload => ({
  type: SWAG_SELECT_UPDATE_CAMPAIGN_VENDOR_REQUEST,
  payload,
});

export const swagSelectUpdateVendorTypeSuccess = payload => ({
  type: SWAG_SELECT_UPDATE_CAMPAIGN_VENDOR_SUCCESS,
  payload,
});

export const swagSelectUpdateVendorTypeFail = payload => ({
  type: SWAG_SELECT_UPDATE_CAMPAIGN_VENDOR_FAIL,
  payload,
});

// ON CLOSE SIDEBAR

export const swagSelectClearDataOnCloseSidebar = () => ({
  type: SWAG_SELECT_CLEAR_DATA_ON_CLOSE_SIDEBAR,
});

// UPDATE BUDGET

export const swagSelectUpdateCampaignBudgetRequest = payload => ({
  type: SWAG_SELECT_UPDATE_CAMPAIGN_BUDGET_REQUEST,
  payload,
});

export const swagSelectUpdateCampaignBudgetSuccess = payload => ({
  type: SWAG_SELECT_UPDATE_CAMPAIGN_BUDGET_SUCCESS,
  payload,
});

export const swagSelectUpdateCampaignBudgetFail = payload => ({
  type: SWAG_SELECT_UPDATE_CAMPAIGN_BUDGET_FAIL,
  payload,
});

// UPDATE MARKETPLACE

export const swagSelectUpdateRestrictedProductsRequest = payload => ({
  type: SWAG_SELECT_UPDATE_RESTRICTED_PRODUCTS_REQUEST,
  payload,
});

export const swagSelectUpdateRestrictedProductsSuccess = payload => ({
  type: SWAG_SELECT_UPDATE_RESTRICTED_PRODUCTS_SUCCESS,
  payload,
});

export const swagSelectUpdateRestrictedProductsFail = payload => ({
  type: SWAG_SELECT_UPDATE_RESTRICTED_PRODUCTS_FAIL,
  payload,
});

// UPDATE LANDING MESSAGE

export const swagSelectUpdateCampaignLandingRequest = payload => ({
  type: SWAG_SELECT_UPDATE_CAMPAIGN_LANDING_REQUEST,
  payload,
});

export const swagSelectUpdateCampaignLandingSuccess = payload => ({
  type: SWAG_SELECT_UPDATE_CAMPAIGN_LANDING_SUCCESS,
  payload,
});

export const swagSelectUpdateCampaignLandingFail = payload => ({
  type: SWAG_SELECT_UPDATE_CAMPAIGN_LANDING_FAIL,
  payload,
});

// UPDATE RECIPIENT ACTIONS

export const swagSelectUpdateRecipientActionsRequest = payload => ({
  type: SWAG_SELECT_UPDATE_RECIPIENT_ACTIONS_REQUEST,
  payload,
});

export const swagSelectUpdateRecipientActionsSuccess = payload => ({
  type: SWAG_SELECT_UPDATE_RECIPIENT_ACTIONS_SUCCESS,
  payload,
});

export const swagSelectUpdateRecipientActionsFail = payload => ({
  type: SWAG_SELECT_UPDATE_RECIPIENT_ACTIONS_FAIL,
  payload,
});

export const swagSelectGenerateCodesRequest = payload => ({
  type: SWAG_SELECT_GENERATE_CODES_REQUEST,
  payload,
});

export const swagSelectGenerateCodesSuccess = payload => ({
  type: SWAG_SELECT_GENERATE_CODES_SUCCESS,
  payload,
});

export const swagSelectGenerateCodesFail = payload => ({
  type: SWAG_SELECT_GENERATE_CODES_FAIL,
  payload,
});

export const swagSelectGenerationCodesProgressRequest = payload => ({
  type: SWAG_SELECT_GENERATION_CODES_PROGRESS_REQUEST,
  payload,
});

export const swagSelectGenerationCodesProgressSuccess = payload => ({
  type: SWAG_SELECT_GENERATION_CODES_PROGRESS_SUCCESS,
  payload,
});

export const swagSelectGenerationCodesProgressFail = payload => ({
  type: SWAG_SELECT_GENERATION_CODES_PROGRESS_FAIL,
  payload,
});

export const swagSelectGenerationCodesProgressFinish = payload => ({
  type: SWAG_SELECT_GENERATION_CODES_PROGRESS_FINISH,
  payload,
});

export const swagSelectSavePhysicalCardRequest = payload => ({
  type: SWAG_SELECT_SAVE_PHYSICAL_CARD_REQUEST,
  payload,
});

export const swagSelectSavePhysicalCardSuccess = payload => ({
  type: SWAG_SELECT_SAVE_PHYSICAL_CARD_SUCCESS,
  payload,
});

export const swagSelectSavePhysicalCardFail = payload => ({
  type: SWAG_SELECT_SAVE_PHYSICAL_CARD_FAIL,
  payload,
});

export const swagSelectUpdateCardOrderDataRequest = payload => ({
  type: SWAG_SELECT_UPDATE_CARDS_ORDER_DATA_REQUEST,
  payload,
});

export const swagSelectUpdateCardOrderDataSuccess = payload => ({
  type: SWAG_SELECT_UPDATE_CARDS_ORDER_DATA_SUCCESS,
  payload,
});

export const swagSelectUpdateCardOrderDataFail = payload => ({
  type: SWAG_SELECT_UPDATE_CARDS_ORDER_DATA_FAIL,
  payload,
});

export const swagSelectSendOrderDataToProcessingRequest = payload => ({
  type: SWAG_SELECT_SEND_ORDER_TO_PROCESSING_REQUEST,
  payload,
});

export const swagSelectSendOrderDataToProcessingSuccess = payload => ({
  type: SWAG_SELECT_SEND_ORDER_TO_PROCESSING_SUCCESS,
  payload,
});

export const swagSelectSendOrderDataToProcessingFail = payload => ({
  type: SWAG_SELECT_SEND_ORDER_TO_PROCESSING_FAIL,
  payload,
});
