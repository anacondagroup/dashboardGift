import { createReducer } from 'redux-act';
import { createEntityAdapter, StateStatus } from '@alycecom/utils';
import { IOffsetPagination } from '@alycecom/services';
import { uniq, without } from 'ramda';

import { ICampaignBreakdownListItem, ICampaignBreakdownResponseMeta } from './campaignsBreakdown.types';
import {
  archiveCampaigns,
  unArchiveCampaigns,
  discardActivateDraftById,
  duplicateCampaign,
  setStandardCampaignExpired,
  fetchCampaignsFail,
  fetchCampaignsRequest,
  fetchCampaignsSuccess,
  toggleSelection,
  resetSelection,
  duplicateProspectingCampaign,
  discardProspectingDraftById,
} from './campaignsBreakdown.actions';

export interface IAdditionalCampaignManagementState {
  status: StateStatus;
  pagination: IOffsetPagination;
  meta: ICampaignBreakdownResponseMeta;
  selected: ICampaignBreakdownListItem[];
}

export const campaignsManagementAdapter = createEntityAdapter<ICampaignBreakdownListItem>();

export const initialState = campaignsManagementAdapter.getInitialState<IAdditionalCampaignManagementState>({
  status: StateStatus.Idle,
  pagination: {
    total: 0,
    offset: 0,
    limit: 0,
  },
  meta: {
    totalAll: NaN,
    totalDrafts: NaN,
    totalActive: NaN,
    totalExpired: NaN,
    totalArchived: NaN,
  },
  selected: [],
});

export type ICampaignManagementState = typeof initialState;

export const campaignsBreakdown = createReducer({}, initialState)
  .on(fetchCampaignsRequest, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(fetchCampaignsSuccess, (state, payload) => ({
    ...state,
    ...campaignsManagementAdapter.setAll(payload.campaigns, state),
    status: StateStatus.Fulfilled,
    pagination: payload.pagination,
    meta: payload.meta,
  }))
  .on(fetchCampaignsFail, state => ({
    ...state,
    status: StateStatus.Rejected,
  }))

  .on(duplicateCampaign.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(duplicateCampaign.fulfilled, state => ({
    ...state,
    status: StateStatus.Fulfilled,
  }))
  .on(duplicateCampaign.rejected, state => ({
    ...state,
    status: StateStatus.Rejected,
  }))

  .on(setStandardCampaignExpired.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(setStandardCampaignExpired.fulfilled, state => ({
    ...state,
    status: StateStatus.Fulfilled,
  }))
  .on(setStandardCampaignExpired.rejected, state => ({
    ...state,
    status: StateStatus.Rejected,
  }))

  .on(discardActivateDraftById.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(discardActivateDraftById.fulfilled, state => ({
    ...state,
    status: StateStatus.Fulfilled,
  }))
  .on(discardActivateDraftById.rejected, state => ({
    ...state,
    status: StateStatus.Rejected,
  }))

  .on(archiveCampaigns.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(archiveCampaigns.fulfilled, state => ({
    ...state,
    status: StateStatus.Fulfilled,
  }))
  .on(archiveCampaigns.rejected, state => ({
    ...state,
    status: StateStatus.Rejected,
  }))

  .on(unArchiveCampaigns.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(unArchiveCampaigns.fulfilled, state => ({
    ...state,
    status: StateStatus.Fulfilled,
  }))
  .on(unArchiveCampaigns.rejected, state => ({
    ...state,
    status: StateStatus.Rejected,
  }))

  .on(toggleSelection, (state, payload) => ({
    ...state,
    selected: payload.checked
      ? uniq([...state.selected, ...payload.campaigns])
      : without(payload.campaigns, state.selected),
  }))
  .on(resetSelection, state => ({
    ...state,
    selected: [],
  }))

  .on(duplicateProspectingCampaign.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(duplicateProspectingCampaign.fulfilled, state => ({
    ...state,
    status: StateStatus.Fulfilled,
  }))
  .on(duplicateProspectingCampaign.rejected, state => ({
    ...state,
    status: StateStatus.Rejected,
  }))

  .on(discardProspectingDraftById.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(discardProspectingDraftById.fulfilled, state => ({
    ...state,
    status: StateStatus.Fulfilled,
  }))
  .on(discardProspectingDraftById.rejected, state => ({
    ...state,
    status: StateStatus.Rejected,
  }));
