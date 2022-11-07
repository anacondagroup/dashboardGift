import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';
import { createAsyncAction } from '@alycecom/utils';

import { TNumberOfRecipientsOption, TPurposeOption } from '../purposes/purposes.types';

import { IGeneralCampaignSettings, ICampaignNotifications, INotificationSettings } from './general.types';

const PREFIX = 'SETTINGS/CAMPAIGN/GENERAL';

export const campaignGeneralSettingsLoadRequest = createAction<number>(`${PREFIX}/LOAD_GENERAL_SETTINGS_REQUEST`);
export const campaignGeneralSettingsLoadSuccess = createAction<{ campaign: IGeneralCampaignSettings }>(
  `${PREFIX}/LOAD_GENERAL_SETTINGS_SUCCESS`,
);
export const campaignGeneralSettingsLoadFail = createAction<TErrors>(`${PREFIX}/LOAD_GENERAL_SETTINGS_FAIL`);

export const campaignGeneralSetSendAsLoadRequest = createAction<{
  campaignId: number;
  userId: number;
  canOverrideFrom: boolean;
}>(`${PREFIX}/UPDATE_SEND_AS_REQUEST`);
export const campaignGeneralSetSendAsLoadSuccess = createAction<{ campaign: IGeneralCampaignSettings }>(
  `${PREFIX}/UPDATE_SEND_AS_SUCCESS`,
);
export const campaignGeneralSetSendAsLoadFail = createAction<TErrors>(`${PREFIX}/UPDATE_SEND_AS_FAIL`);

export const campaignNameSaveRequest = createAction<{ campaignId: number; campaignName: string }>(
  `${PREFIX}/UPDATE_NAME_REQUEST`,
);
export const campaignNameSaveSuccess = createAction<{ campaignName: string }>(`${PREFIX}/UPDATE_NAME_SUCCESS`);
export const campaignNameSaveFail = createAction<TErrors>(`${PREFIX}/UPDATE_NAME_FAIL`);

export const updateCampaignSpecificTeamMembers = createAsyncAction<
  { campaignId: number; teamMemberIds: string[] },
  void
>(`${PREFIX}/UPDATE_CAMPAIGN_SPECIFIC_TEAM_MEMBERS`);

export const campaignNotificationUpdate = createAction<{
  status: keyof ICampaignNotifications;
  type: keyof INotificationSettings;
  value: boolean;
}>(`${PREFIX}/SET_NOTIFICATIONS`);

export const campaignNotificationSaveRequest = createAction<{
  campaignId: number;
  notifications: ICampaignNotifications;
}>(`${PREFIX}/UPDATE_NOTIFICATIONS_REQUEST`);
export const campaignNotificationSaveSuccess = createAction(`${PREFIX}/UPDATE_NOTIFICATIONS_SUCCESS`);
export const campaignNotificationSaveFail = createAction<TErrors>(`${PREFIX}/UPDATE_NOTIFICATIONS_FAIL`);

export const campaignGiftResearchOptionsSaveRequest = createAction<{ campaignId: number; option: string }>(
  `${PREFIX}/UPDATE_RESEARCH_FLOW_REQUEST`,
);
export const campaignGiftResearchOptionsSaveSuccess = createAction<{ option: string }>(
  `${PREFIX}/UPDATE_RESEARCH_FLOW_SUCCESS`,
);
export const campaignGiftResearchOptionsSaveFail = createAction<TErrors>(`${PREFIX}/UPDATE_RESEARCH_FLOW_FAIL`);

export const setDisableCampaign = createAction<{ campaignId: number; isDisabled: boolean }>(
  `${PREFIX}/UPDATE_DISABLE_CAMPAIGN_REQUEST`,
);
export const setDisableCampaignSuccess = createAction(`${PREFIX}/UPDATE_DISABLE_CAMPAIGN_SUCCESS`);
export const setDisableCampaignFail = createAction<TErrors>(`${PREFIX}/UPDATE_DISABLE_CAMPAIGN_FAIL`);

export const campaignSettingsOwnerSaveRequest = createAction<{ campaignId: number; ownerId: number }>(
  `${PREFIX}/UPDATE_OWNER_REQUEST`,
);
export const campaignSettingsOwnerSaveSuccess = createAction(`${PREFIX}/UPDATE_OWNER_SUCCESS`);
export const campaignSettingsOwnerSaveFail = createAction<TErrors>(`${PREFIX}/UPDATE_OWNER_FAIL`);

export const campaignLinkExpirationDateSaveRequest = createAction<{ campaignId: number; expirationDate: string }>(
  `${PREFIX}/UPDATE_LINK_EXPIRATION_DATE_REQUEST`,
);
export const campaignLinkExpirationDateSaveSuccess = createAction<{ expirationDate: string }>(
  `${PREFIX}/UPDATE_LINK_EXPIRATION_DATE_SUCCESS`,
);
export const campaignLinkExpirationDateSaveFail = createAction<TErrors>(`${PREFIX}/UPDATE_LINK_EXPIRATION_DATE_FAIL`);

export const updateCampaignPurposeRequest = createAction<{
  campaignId: number;
  purpose: TPurposeOption;
  numberOfRecipients: TNumberOfRecipientsOption;
}>(`${PREFIX}/UPDATE_PURPOSE_REQUEST`);
export const updateCampaignPurposeSuccess = createAction<{
  purpose: TPurposeOption;
  numberOfRecipients: TNumberOfRecipientsOption;
}>(`${PREFIX}/UPDATE_PURPOSE_SUCCESS`);
export const updateCampaignPurposeFail = createAction(`${PREFIX}/UPDATE_PURPOSE_FAIL`);
