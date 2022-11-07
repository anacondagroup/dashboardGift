import { StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';

import { createSwagCampaignByDraftId } from './finalize.actions';

export type TFinalizeState = {
  status: StateStatus;
};

export const initialState: TFinalizeState = {
  status: StateStatus.Idle,
};

export const finalize = createReducer({}, initialState);

finalize
  .on(createSwagCampaignByDraftId.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(createSwagCampaignByDraftId.fulfilled, state => ({
    ...state,
    status: StateStatus.Fulfilled,
  }))
  .on(createSwagCampaignByDraftId.rejected, state => ({
    ...state,
    status: StateStatus.Rejected,
  }));
