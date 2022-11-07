import { createEntityAdapter, StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';

import { resetProspectingCampaign } from '../../prospectingCampaign.actions';

import { TGiftLimitsFilters, TProspectingCampaignMember } from './giftLimits.types';
import {
  editBulkProspectingGiftLimitsByDraftId,
  fetchProspectingGiftLimitsByDraftId,
  fetchProspectingGiftLimitsById,
  resetGiftLimitsFilter,
  setFilteredGiftLimits,
  setGiftLimitsSearchFilter,
  setGiftLimitsSortFilter,
  updateProspectingGiftingLimitsRemainingById,
  updateProspectingGiftLimitsByDraftId,
  updateProspectingGiftLimitsById,
} from './giftLimits.actions';

export const giftLimitsAdapter = createEntityAdapter<TProspectingCampaignMember>({
  getId: entity => entity.userId,
});

export const initialState = giftLimitsAdapter.getInitialState<{
  status: StateStatus;
  bulkStatus: StateStatus;
  filteringStatus: StateStatus.Idle | StateStatus.Pending;
  filters: TGiftLimitsFilters;
  filteredGiftLimits: TProspectingCampaignMember[];
}>({
  status: StateStatus.Idle,
  bulkStatus: StateStatus.Idle,
  filteringStatus: StateStatus.Idle,
  filters: {
    search: '',
    sort: {},
  },
  filteredGiftLimits: [],
});

export type TGiftLimitsState = typeof initialState;

export const giftLimits = createReducer<TGiftLimitsState>({}, initialState);

giftLimits
  .on(fetchProspectingGiftLimitsByDraftId.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(fetchProspectingGiftLimitsByDraftId.fulfilled, (state, payload) => ({
    ...state,
    ...giftLimitsAdapter.upsertMany(payload, state),
    status: StateStatus.Fulfilled,
  }))
  .on(fetchProspectingGiftLimitsByDraftId.rejected, state => ({
    ...state,
    status: StateStatus.Rejected,
  }));

giftLimits
  .on(updateProspectingGiftLimitsByDraftId.pending, state => ({
    ...state,
    bulkStatus: StateStatus.Pending,
  }))
  .on(updateProspectingGiftLimitsByDraftId.fulfilled, (state, payload) => ({
    ...state,
    ...giftLimitsAdapter.updateMany(
      payload.giftLimits.map(({ userId, ...changes }) => ({ id: userId, changes })),
      state,
    ),
    bulkStatus: StateStatus.Fulfilled,
  }))
  .on(updateProspectingGiftLimitsByDraftId.rejected, state => ({
    ...state,
    bulkStatus: StateStatus.Rejected,
  }));

giftLimits
  .on(editBulkProspectingGiftLimitsByDraftId.pending, state => ({
    ...state,
    bulkStatus: StateStatus.Pending,
  }))
  .on(editBulkProspectingGiftLimitsByDraftId.fulfilled, (state, payload) => ({
    ...state,
    ...giftLimitsAdapter.updateMany(
      payload.giftLimits.map(({ userId, ...changes }) => ({ id: userId, changes })),
      state,
    ),
    bulkStatus: StateStatus.Fulfilled,
  }))
  .on(editBulkProspectingGiftLimitsByDraftId.rejected, state => ({
    ...state,
    bulkStatus: StateStatus.Rejected,
  }));

giftLimits
  .on(fetchProspectingGiftLimitsById.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(fetchProspectingGiftLimitsById.fulfilled, (state, payload) => ({
    ...state,
    ...giftLimitsAdapter.upsertMany(payload, state),
    status: StateStatus.Fulfilled,
  }))
  .on(fetchProspectingGiftLimitsById.rejected, state => ({
    ...state,
    status: StateStatus.Fulfilled,
  }));

giftLimits
  .on(updateProspectingGiftLimitsById.pending, state => ({
    ...state,
    bulkStatus: StateStatus.Pending,
  }))
  .on(updateProspectingGiftLimitsById.fulfilled, (state, payload) => ({
    ...state,
    ...giftLimitsAdapter.updateMany(
      payload.giftLimits.map(({ userId, period, limit }) => ({
        id: userId,
        changes: { period, limit, remaining: limit },
      })),
      state,
    ),
    bulkStatus: StateStatus.Fulfilled,
  }))
  .on(updateProspectingGiftLimitsById.rejected, state => ({
    ...state,
    bulkStatus: StateStatus.Rejected,
  }));

giftLimits
  .on(updateProspectingGiftingLimitsRemainingById.pending, state => ({
    ...state,
    bulkStatus: StateStatus.Pending,
  }))
  .on(updateProspectingGiftingLimitsRemainingById.fulfilled, (state, payload) => ({
    ...state,
    ...giftLimitsAdapter.updateMany(
      payload.userIds.map(userId => ({ id: userId, changes: { remaining: payload.remaining } })),
      state,
    ),
    bulkStatus: StateStatus.Fulfilled,
  }))
  .on(updateProspectingGiftingLimitsRemainingById.rejected, state => ({
    ...state,
    bulkStatus: StateStatus.Rejected,
  }));

giftLimits
  .on(setGiftLimitsSearchFilter, (state, payload) => ({
    ...state,
    filteringStatus: StateStatus.Pending,
    filters: {
      ...state.filters,
      search: payload,
    },
    filteredGiftLimits: [],
  }))
  .on(setGiftLimitsSortFilter, (state, payload) => ({
    ...state,
    filteringStatus: StateStatus.Pending,
    filters: {
      ...state.filters,
      sort: payload,
    },
    filteredGiftLimits: [],
  }))
  .on(resetGiftLimitsFilter, state => ({
    ...state,
    filteringStatus: StateStatus.Idle,
    filters: initialState.filters,
    filteredGiftLimits: [],
  }))
  .on(setFilteredGiftLimits, (state, payload) => ({
    ...state,
    filteringStatus: StateStatus.Idle,
    filteredGiftLimits: payload,
  }));

giftLimits.on(resetProspectingCampaign, () => initialState);
