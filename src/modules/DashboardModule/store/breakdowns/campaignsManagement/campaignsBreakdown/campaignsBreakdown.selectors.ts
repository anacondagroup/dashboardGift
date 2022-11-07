import { intersection, pipe, prop } from 'ramda';
import { createSelector } from 'reselect';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../../store/root.types';

import { campaignsManagementAdapter, ICampaignManagementState } from './campaignsBreakdown.reducer';

const getCampaignsManagementState = (state: IRootState): ICampaignManagementState =>
  state.dashboard.breakdowns.campaignsManagement.campaignsBreakdown;

const selectors = campaignsManagementAdapter.getSelectors(getCampaignsManagementState);

export const getCampaignsList = selectors.getAll;

export const getCampaignsIds = selectors.getIds;

export const getCampaignsListLoadingStatus = pipe(getCampaignsManagementState, prop('status'));

export const getCampaignsListTotalAmount = pipe(getCampaignsManagementState, state => state.pagination.total);

export const getAllCampaignsListAmount = pipe(getCampaignsManagementState, state => state.meta.totalAll);

export const getActiveCampaignsListAmount = pipe(getCampaignsManagementState, state => state.meta.totalActive);

export const getDraftCampaignsListAmount = pipe(getCampaignsManagementState, state => state.meta.totalDrafts);

export const getArchivedCampaignsListAmount = pipe(getCampaignsManagementState, state => state.meta.totalArchived);

export const getExpiredCampaignsListAmount = pipe(getCampaignsManagementState, state => state.meta.totalExpired);

export const getIsCampaignsListLoading = createSelector(
  getCampaignsListLoadingStatus,
  campaignsListLoadingStatus => campaignsListLoadingStatus === StateStatus.Pending,
);

export const getSelectedCampaigns = pipe(getCampaignsManagementState, state => state.selected);

export const getPageSelectedCampaignsCount = createSelector(
  getCampaignsIds,
  getSelectedCampaigns,
  (pageIds, selectedIds) => {
    const pageSelectedIds = intersection(
      pageIds,
      selectedIds.map(({ id }) => id),
    );
    return pageSelectedIds.length;
  },
);
