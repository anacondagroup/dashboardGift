import { createReducer } from 'redux-act';

import { ICampaign } from '../../../../../store/campaigns/campaigns.types';

import {
  setCurrentActionCampaign,
  setEmail,
  setReportModalDisplay,
  setUnClaimedGiftsCount,
} from './dashboardSingleCampaign.actions';

export type TDashboardSingleCampaignState = {
  email: string;
  isReportModalDisplay: boolean;
  currentActionCampaign: ICampaign | null;
  unClaimedGiftsCount: number;
};

export const dashboardSingleCampaignInitialState = {
  email: '',
  isReportModalDisplay: false,
  currentActionCampaign: null,
  unClaimedGiftsCount: 0,
};

export const dashboardSingleCampaign = createReducer<TDashboardSingleCampaignState>(
  {},
  dashboardSingleCampaignInitialState,
);

dashboardSingleCampaign
  .on(setEmail, (state, email) => ({
    ...state,
    email,
  }))
  .on(setReportModalDisplay, (state, isReportModalDisplay) => ({
    ...state,
    isReportModalDisplay,
  }))
  .on(setCurrentActionCampaign, (state, currentActionCampaign) => ({
    ...state,
    currentActionCampaign,
  }))
  .on(setUnClaimedGiftsCount, (state, unClaimedGiftsCount) => ({
    ...state,
    unClaimedGiftsCount,
  }));
