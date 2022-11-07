import { StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';

import { createProspectingCampaignByDraftId } from './finalize.actions';

export type TFinalizeState = {
  status: StateStatus;
};

export const initialState: TFinalizeState = {
  status: StateStatus.Idle,
};

export const finalize = createReducer({}, initialState);

finalize
  .on(createProspectingCampaignByDraftId.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(createProspectingCampaignByDraftId.fulfilled, state => ({
    ...state,
    status: StateStatus.Fulfilled,
  }))
  .on(createProspectingCampaignByDraftId.rejected, state => ({
    ...state,
    status: StateStatus.Rejected,
  }));
