import { createAsyncAction } from '@alycecom/utils';
import { createAction } from 'redux-act';

import {
  TGiftLimitsFilters,
  TProspectingCampaignMember,
  TUpdateGiftLimitsRequest,
  TUpdateRemainingGiftLimitsRequest,
} from './giftLimits.types';

const prefix = 'PROSPECTING_CAMPAIGN/STEPS/INVITES';

export const fetchProspectingGiftLimitsByDraftId = createAsyncAction<number, TProspectingCampaignMember[]>(
  `${prefix}/FETCH_BY_DRAFT_ID`,
);
export const updateProspectingGiftLimitsByDraftId = createAsyncAction<
  TUpdateGiftLimitsRequest & { draftId: number },
  TUpdateGiftLimitsRequest
>(`${prefix}/UPDATE_BY_DRAFT_ID`);
export const editBulkProspectingGiftLimitsByDraftId = createAsyncAction<
  TUpdateGiftLimitsRequest & { draftId: number },
  TUpdateGiftLimitsRequest
>(`${prefix}/BULK_EDIT_GIFT_LIMITS_BY_DRAFT_ID`);

export const fetchProspectingGiftLimitsById = createAsyncAction<number, TProspectingCampaignMember[]>(
  `${prefix}/FETCH_BY_ID`,
);
export const updateProspectingGiftLimitsById = createAsyncAction<
  TUpdateGiftLimitsRequest & { campaignId: number },
  TUpdateGiftLimitsRequest
>(`${prefix}/UPDATE_BY_ID`);
export const updateProspectingGiftingLimitsRemainingById = createAsyncAction<
  TUpdateRemainingGiftLimitsRequest & { campaignId: number },
  TUpdateRemainingGiftLimitsRequest
>(`${prefix}/UPDATE_REMAINING_BY_ID`);

export const setGiftLimitsSearchFilter = createAction<TGiftLimitsFilters['search']>(`${prefix}/SET_SEARCH_FILTER`);
export const setGiftLimitsSortFilter = createAction<TGiftLimitsFilters['sort']>(`${prefix}/SET_SORT_FILTER`);
export const resetGiftLimitsFilter = createAction(`${prefix}/RESET_FILTERS`);
export const setFilteredGiftLimits = createAction<TProspectingCampaignMember[]>(`${prefix}/SET_FILTERED_GIFT_LIMITS`);
