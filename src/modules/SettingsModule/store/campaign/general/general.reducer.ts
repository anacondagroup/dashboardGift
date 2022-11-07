import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';
import { TErrors } from '@alycecom/services';

import {
  campaignGeneralSetSendAsLoadFail,
  campaignGeneralSetSendAsLoadRequest,
  campaignGeneralSetSendAsLoadSuccess,
  campaignGeneralSettingsLoadFail,
  campaignGeneralSettingsLoadRequest,
  campaignGeneralSettingsLoadSuccess,
  campaignGiftResearchOptionsSaveFail,
  campaignGiftResearchOptionsSaveRequest,
  campaignGiftResearchOptionsSaveSuccess,
  campaignLinkExpirationDateSaveFail,
  campaignLinkExpirationDateSaveRequest,
  campaignLinkExpirationDateSaveSuccess,
  campaignNameSaveFail,
  campaignNameSaveRequest,
  campaignNameSaveSuccess,
  campaignNotificationSaveFail,
  campaignNotificationSaveRequest,
  campaignNotificationSaveSuccess,
  campaignNotificationUpdate,
  campaignSettingsOwnerSaveFail,
  campaignSettingsOwnerSaveRequest,
  campaignSettingsOwnerSaveSuccess,
  setDisableCampaign,
  setDisableCampaignFail,
  setDisableCampaignSuccess,
  updateCampaignPurposeFail,
  updateCampaignPurposeRequest,
  updateCampaignPurposeSuccess,
  updateCampaignSpecificTeamMembers,
} from './general.actions';
import { IGeneralCampaignSettings } from './general.types';

export interface IGeneralCampaignSettingsState {
  status: StateStatus;
  campaign: IGeneralCampaignSettings;
  errors: TErrors;
}

export const initialGeneralCampaignSettingsState: IGeneralCampaignSettingsState = {
  status: StateStatus.Idle,
  campaign: {
    id: NaN,
    name: '',
    type: '',
    notifications: {},
    countryIds: [],
  },
  errors: {},
};

export const general = createReducer({}, initialGeneralCampaignSettingsState)
  .on(campaignGeneralSettingsLoadRequest, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(campaignGeneralSettingsLoadSuccess, (state, payload) => ({
    ...state,
    status: StateStatus.Fulfilled,
    campaign: {
      ...payload.campaign,
      gift_research_option: 'instant',
      // TODO: Create enum for gift_research_option
    },
  }))
  .on(campaignGeneralSettingsLoadFail, (state, payload) => ({
    ...state,
    status: StateStatus.Rejected,
    errors: payload,
  }))

  .on(campaignGeneralSetSendAsLoadRequest, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(campaignGeneralSetSendAsLoadSuccess, (state, payload) => ({
    ...state,
    status: StateStatus.Fulfilled,
    campaign: {
      ...payload.campaign,
      gift_research_option: 'instant',
    },
  }))
  .on(campaignGeneralSetSendAsLoadFail, (state, payload) => ({
    ...state,
    status: StateStatus.Rejected,
    errors: payload,
  }))

  .on(campaignNameSaveRequest, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(campaignNameSaveSuccess, (state, payload) => ({
    ...state,
    status: StateStatus.Fulfilled,
    campaign: {
      ...state.campaign,
      name: payload.campaignName,
    },
    error: {},
  }))
  .on(campaignNameSaveFail, (state, payload) => ({
    ...state,
    status: StateStatus.Rejected,
    errors: payload,
  }))

  .on(campaignNotificationUpdate, (state, payload) => ({
    ...state,
    campaign: {
      ...state.campaign,
      notifications: {
        ...state.campaign.notifications,
        [payload.status]: {
          ...state.campaign.notifications[payload.status],
          [payload.type]: payload.value,
        },
      },
    },
  }))

  .on(campaignNotificationSaveRequest, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(campaignNotificationSaveSuccess, state => ({
    ...state,
    status: StateStatus.Fulfilled,
  }))
  .on(campaignNotificationSaveFail, (state, payload) => ({
    ...state,
    status: StateStatus.Rejected,
    errors: payload,
  }))

  .on(campaignGiftResearchOptionsSaveRequest, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(campaignGiftResearchOptionsSaveSuccess, (state, payload) => ({
    ...state,
    status: StateStatus.Fulfilled,
    campaign: {
      ...state.campaign,
      research_flow: payload.option,
    },
    errors: {},
  }))
  .on(campaignGiftResearchOptionsSaveFail, (state, payload) => ({
    ...state,
    status: StateStatus.Rejected,
    errors: payload,
  }))

  .on(setDisableCampaign, (state, payload) => ({
    ...state,
    status: StateStatus.Pending,
    campaign: {
      ...state.campaign,
      is_disabled: payload.isDisabled,
    },
  }))
  .on(setDisableCampaignSuccess, state => ({
    ...state,
    status: StateStatus.Fulfilled,
    errors: {},
  }))
  .on(setDisableCampaignFail, (state, payload) => ({
    ...state,
    status: StateStatus.Rejected,
    errors: payload,
  }))

  .on(campaignSettingsOwnerSaveRequest, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(campaignSettingsOwnerSaveSuccess, state => ({
    ...state,
    status: StateStatus.Fulfilled,
    errors: {},
  }))
  .on(campaignSettingsOwnerSaveFail, (state, payload) => ({
    ...state,
    status: StateStatus.Rejected,
    errors: payload,
  }))

  .on(campaignLinkExpirationDateSaveRequest, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(campaignLinkExpirationDateSaveSuccess, (state, payload) => ({
    ...state,
    status: StateStatus.Fulfilled,
    campaign: {
      ...state.campaign,
      expirationDate: payload.expirationDate,
    },
    errors: {},
  }))
  .on(campaignLinkExpirationDateSaveFail, (state, payload) => ({
    ...state,
    status: StateStatus.Rejected,
    errors: payload,
  }))

  .on(updateCampaignPurposeRequest, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(updateCampaignPurposeSuccess, (state, payload) => ({
    ...state,
    status: StateStatus.Fulfilled,
    campaign: {
      ...state.campaign,
      campaignPurpose: payload.purpose,
      numberOfRecipients: payload.numberOfRecipients,
    },
  }))
  .on(updateCampaignPurposeFail, state => ({
    ...state,
    status: StateStatus.Rejected,
  }))
  .on(updateCampaignSpecificTeamMembers.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(updateCampaignSpecificTeamMembers.fulfilled, state => ({
    ...state,
    status: StateStatus.Fulfilled,
  }))
  .on(updateCampaignSpecificTeamMembers.rejected, state => ({
    ...state,
    status: StateStatus.Rejected,
  }));
