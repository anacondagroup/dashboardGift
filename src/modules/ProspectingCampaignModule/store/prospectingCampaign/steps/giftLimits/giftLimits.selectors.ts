import { converge, equals, pipe, prop } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../../store/root.types';

import { giftLimitsAdapter } from './giftLimits.reducer';

const getGiftLimitsState = (state: IRootState) => state.prospectingCampaign.steps.giftLimits;

export const {
  getById: makeGetGiftLimitByUserId,
  getIds: getGiftLimitIds,
  getAll: getAllGiftLimits,
  getTotal: getTotalGiftLimits,
  getEntities: getGiftLimitEntities,
} = giftLimitsAdapter.getSelectors(getGiftLimitsState);

export const getGiftLimitsStatus = pipe(getGiftLimitsState, prop('status'));
export const getIsGiftLimitsIdle = pipe(getGiftLimitsStatus, equals(StateStatus.Idle));
export const getIsGiftLimitsPending = pipe(getGiftLimitsStatus, equals(StateStatus.Pending));
export const getIsGiftLimitsFulfilled = pipe(getGiftLimitsStatus, equals(StateStatus.Fulfilled));
export const getIsGiftLimitsRejected = pipe(getGiftLimitsStatus, equals(StateStatus.Rejected));

export const getGiftLimitsBulkStatus = pipe(getGiftLimitsState, prop('bulkStatus'));
export const getIsGiftLimitsBulkIdle = pipe(getGiftLimitsBulkStatus, equals(StateStatus.Idle));
export const getIsGiftLimitsBulkPending = pipe(getGiftLimitsBulkStatus, equals(StateStatus.Pending));
export const getIsGiftLimitsBulkFulfilled = pipe(getGiftLimitsBulkStatus, equals(StateStatus.Fulfilled));
export const getIsGiftLimitsBulkRejected = pipe(getGiftLimitsBulkStatus, equals(StateStatus.Rejected));

export const getGiftLimitsFilters = pipe(getGiftLimitsState, prop('filters'));
export const getIsGiftLimitsFiltersExist = pipe(getGiftLimitsFilters, filters => !!filters.search || !!filters.sort.by);
export const getFilteredGiftLimits = pipe(getGiftLimitsState, prop('filteredGiftLimits'));
export const getAllFilteredGiftLimits = converge(
  (isFiltersExists, all, filtered) => (isFiltersExists ? filtered : all),
  [getIsGiftLimitsFiltersExist, getAllGiftLimits, getFilteredGiftLimits],
);
export const getGiftLimitsFilteringStatus = pipe(getGiftLimitsState, prop('filteringStatus'));
export const getIsGiftLimitsFilteringPending = pipe(getGiftLimitsFilteringStatus, equals(StateStatus.Pending));
