import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';
import { createAsyncAction, EntityId } from '@alycecom/utils';

import { CAMPAIGN_STATUS, CAMPAIGN_TYPES } from '../../../../../../constants/campaignSettings.constants';

import {
  ICampaignBreakdownListItem,
  ICampaignBreakdownListRequestPayload,
  ICampaignBreakdownListSuccessPayload,
} from './campaignsBreakdown.types';

const PREFIX = 'CAMPAIGN_MANAGEMENT/BREAKDOWN';

export const fetchCampaignsRequest = createAction<ICampaignBreakdownListRequestPayload>(
  `${PREFIX}/FETCH_CAMPAIGNS_REQUEST`,
);
export const fetchCampaignsSuccess = createAction<ICampaignBreakdownListSuccessPayload>(
  `${PREFIX}/FETCH_CAMPAIGNS_SUCCESS`,
);
export const fetchCampaignsFail = createAction(`${PREFIX}/FETCH_CAMPAIGNS_FAIL`);

export const duplicateCampaign = createAsyncAction<{ id: number; teamId?: number | null }, void, TErrors>(
  `${PREFIX}/DUPLICATE_CAMPAIGN_REQUEST`,
);

export const setStandardCampaignExpired = createAsyncAction<{ campaignId: number; isExpired: boolean }, void, TErrors>(
  `${PREFIX}/EXPIRE_STANDARD_CAMPAIGN`,
);

export const expireActivateOrSwagCampaigns = createAsyncAction<{ campaignIds: EntityId[] }, void, TErrors>(
  `${PREFIX}/EXPIRE_ACTIVATE_OR_SWAG_CAMPAIGNS`,
);

export const unExpireActivateOrSwagCampaigns = createAsyncAction<
  { campaignIds: EntityId[] },
  { campaignIds: EntityId[] },
  TErrors
>(`${PREFIX}/UNEXPIRE_ACTIVATE_OR_SWAG_CAMPAIGNS`);

export const discardActivateDraftById = createAsyncAction<number, void>(`${PREFIX}/DISCARD_ACTIVATE_DRAFT`);

export const archiveCampaigns = createAsyncAction<
  { campaigns: { id: number; name: string; type: CAMPAIGN_TYPES; status: CAMPAIGN_STATUS }[] },
  { campaigns: { id: number; name: string; type: CAMPAIGN_TYPES; status: CAMPAIGN_STATUS }[] },
  void
>(`${PREFIX}/ARCHIVE_CAMPAIGN`);

export const unArchiveCampaigns = createAsyncAction<
  { campaigns: { id: number; name: string; type: CAMPAIGN_TYPES; status: CAMPAIGN_STATUS }[] },
  { campaigns: { id: number; name: string; type: CAMPAIGN_TYPES; status: CAMPAIGN_STATUS }[] },
  void
>(`${PREFIX}/UNARCHIVE_CAMPAIGN`);

export const toggleSelection = createAction<{ campaigns: ICampaignBreakdownListItem[]; checked: boolean }>(
  `${PREFIX}/TOGGLE_SELECTION`,
);

export const resetSelection = createAction(`${PREFIX}/RESET_SELECTION`);

export const duplicateProspectingCampaign = createAsyncAction<{ id: number }, void>(
  `${PREFIX}/DUPLICATE_PROSPECTING_CAMPAIGN`,
);

export const discardProspectingDraftById = createAsyncAction<number, void>(`${PREFIX}/DISCARD_PROSPECTING_DRAFT`);

export const duplicate1ToManyCampaign = createAsyncAction<{ id: number }, void>(`${PREFIX}/DUPLICATE_1TOMANY_CAMPAIGN`);
