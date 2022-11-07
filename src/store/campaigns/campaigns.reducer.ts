import { createReducer } from 'redux-act';

import { ICampaign } from './campaigns.types';
import { loadCampaignsFail, loadCampaignsRequest, loadCampaignsSuccess } from './campaigns.actions';

export interface ICampaignsState {
  campaigns: ICampaign[];
  isLoading: boolean;
}

export const initialState: ICampaignsState = {
  campaigns: [],
  isLoading: false,
};

export default createReducer({}, initialState)
  .on(loadCampaignsRequest, state => ({
    ...state,
    isLoading: true,
  }))
  .on(loadCampaignsSuccess, (state, payload) => ({
    ...initialState,
    isLoading: false,
    campaigns: payload,
  }))
  .on(loadCampaignsFail, () => ({
    ...initialState,
    isLoading: false,
  }));
