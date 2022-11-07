import { createAction } from 'redux-act';
import { createAsyncAction } from '@alycecom/utils';

import {
  ICampaignTypeRestrictionsPayload,
  ICampaignVendorRestrictionsPayload,
  IGiftInvitesCampaignSettings,
  IGiftType,
  IGiftVendor,
  IUpdateGiftBudgetPayload,
  IUpdateRedirectPayload,
  IUpdateRequiredActionsPayload,
  IUpdateVideoMessagePayload,
} from './giftInvites.types';

const PREFIX = 'SETTINGS/CAMPAIGN';

export const campaignGiftInvitesSettingsLoadRequest = createAction<number>(`${PREFIX}/LOAD_GIFT_INVITES_REQUEST`);
export const campaignGiftInvitesSettingsLoadSuccess = createAction<IGiftInvitesCampaignSettings>(
  `${PREFIX}/LOAD_GIFT_INVITES_SUCCESS`,
);
export const campaignGiftInvitesSettingsLoadFail = createAction<Record<string, unknown>>(
  `${PREFIX}/LOAD_GIFT_INVITES_REQUEST`,
);

export const campaignGiftUpdateBudgetRequest = createAction<IUpdateGiftBudgetPayload>(`${PREFIX}/SAVE_BUDGET_REQUEST`);
export const campaignGiftUpdateBudgetSuccess = createAction<IUpdateGiftBudgetPayload>(`${PREFIX}/SAVE_BUDGET_SUCCESS`);
export const campaignGiftUpdateBudgetFail = createAction<Record<string, unknown>>(`${PREFIX}/SAVE_BUDGET_FAIL`);

export const set1t1CampaignCustomMarketplaceId = createAsyncAction<
  {
    campaignId: number;
    customMarketplaceId: number | null;
  },
  { customMarketplaceId: number | null },
  void
>(`${PREFIX}/SET_1_TO_1_CAMPAIGN_CUSTOM_MARKETPLACE_ID`);

export const campaignGiftUpdateExpirationRequest = createAction<{ campaignId: number; period: number }>(
  `${PREFIX}/SAVE_GIFT_EXPIRATION_REQUEST`,
);
export const campaignGiftUpdateExpirationSuccess = createAction<{ campaignId: number; period: number }>(
  `${PREFIX}/SAVE_GIFT_EXPIRATION_SUCCESS`,
);
export const campaignGiftUpdateExpirationFail = createAction<Record<string, unknown>>(
  `${PREFIX}/SAVE_GIFT_EXPIRATION_FAIL`,
);

export const campaignGiftUpdateRequiredActionsRequest = createAction<IUpdateRequiredActionsPayload>(
  `${PREFIX}/SAVE_REQUIRED_ACTIONS_REQUEST`,
);
export const campaignGiftUpdateRequiredActionsSuccess = createAction<IUpdateRequiredActionsPayload>(
  `${PREFIX}/SAVE_REQUIRED_ACTIONS_SUCCESS`,
);
export const campaignGiftUpdateRequiredActionsFail = createAction<Record<string, unknown>>(
  `${PREFIX}/SAVE_REQUIRED_ACTIONS_FAIL`,
);

export const campaignGiftUpdateRedirectRequest = createAction<IUpdateRedirectPayload>(
  `${PREFIX}/SAVE_GIFT_REDIRECT_REQUEST`,
);
export const campaignGiftUpdateRedirectSuccess = createAction<IUpdateRedirectPayload>(
  `${PREFIX}/SAVE_GIFT_REDIRECT_SUCCESS`,
);
export const campaignGiftUpdateRedirectFail = createAction<Record<string, unknown>>(
  `${PREFIX}/SAVE_GIFT_REDIRECT_FAIL`,
);

export const campaignGiftUpdateVideoMessageRequest = createAction<IUpdateVideoMessagePayload>(
  `${PREFIX}/SAVE_GIFT_VIDEO_MESSAGE_REQUEST`,
);
export const campaignGiftUpdateVideoMessageSuccess = createAction<IUpdateVideoMessagePayload>(
  `${PREFIX}/SAVE_GIFT_VIDEO_MESSAGE_SUCCESS`,
);
export const campaignGiftUpdateVideoMessageFail = createAction<Record<string, unknown>>(
  `${PREFIX}/SAVE_GIFT_VIDEO_MESSAGE_FAIL`,
);
export const campaignGiftUpdateVideoMessageCleanErrors = createAction<Record<string, unknown>>(
  `${PREFIX}/SAVE_GIFT_VIDEO_MESSAGE_CLEAN_ERROR`,
);

export const loadCampaignVendorsRequest = createAction<number>(`${PREFIX}/LOAD_VENDORS_REQUEST`);
export const loadCampaignVendorsSuccess = createAction<{
  vendors: IGiftVendor[];
  availableProductsCount: number;
}>(`${PREFIX}/LOAD_VENDORS_SUCCESS`);
export const loadCampaignVendorsFail = createAction(`${PREFIX}/LOAD_VENDORS_FAIL`);
export const setRestrictedCampaignVendors = createAction<IGiftVendor[]>(`${PREFIX}/SET_RESTRICTED_VENDORS`);
export const saveCampaignVendorRestrictionsRequest = createAction<ICampaignVendorRestrictionsPayload>(
  `${PREFIX}/SAVE_VENDOR_RESTRICTIONS_REQUEST`,
);
export const saveCampaignVendorRestrictionsSuccess = createAction<{
  vendors: IGiftVendor[];
  availableProductsCount: number;
}>(`${PREFIX}/SAVE_VENDOR_RESTRICTIONS_SUCCESS`);
export const saveCampaignVendorRestrictionsFail = createAction<Record<string, unknown>>(
  `${PREFIX}/SAVE_VENDOR_RESTRICTIONS_FAIL`,
);

export const loadCampaignTypesRequest = createAction<number>(`${PREFIX}/LOAD_TYPES_REQUEST`);
export const loadCampaignTypesSuccess = createAction<IGiftType[]>(`${PREFIX}/LOAD_TYPES_SUCCESS`);
export const loadCampaignTypesFail = createAction(`${PREFIX}/LOAD_TYPES_FAIL`);
export const setRestrictedCampaignTypes = createAction<IGiftType[]>(`${PREFIX}/SET_RESTRICTED_TYPES`);
export const saveCampaignTypeRestrictionsRequest = createAction<ICampaignTypeRestrictionsPayload>(
  `${PREFIX}/SAVE_TYPE_RESTRICTIONS_REQUEST`,
);
export const saveCampaignTypeRestrictionsSuccess = createAction<IGiftType[]>(
  `${PREFIX}/SAVE_TYPE_RESTRICTIONS_SUCCESS`,
);
export const saveCampaignTypeRestrictionsFail = createAction<Record<string, unknown>>(
  `${PREFIX}/SAVE_TYPE_RESTRICTIONS_FAIL`,
);
