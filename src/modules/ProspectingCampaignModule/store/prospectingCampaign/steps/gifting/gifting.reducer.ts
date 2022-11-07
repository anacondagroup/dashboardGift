import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import { TProspectingGifting } from '../../prospectingCampaign.types';
import {
  fetchProspectingById,
  fetchProspectingDraftById,
  resetProspectingCampaign,
} from '../../prospectingCampaign.actions';

import { updateDraftProspectingGifting, updateProspectingGifting } from './gifting.actions';
import { TGiftingErrors } from './gifting.types';

export type TGiftingState = {
  status: StateStatus;
  data: TProspectingGifting | null;
  errors: TGiftingErrors;
};

export const initialState = {
  status: StateStatus.Idle,
  data: null,
  errors: {},
};

export const gifting = createReducer<TGiftingState>({}, initialState);

gifting
  .on(fetchProspectingDraftById.pending, () => ({
    ...initialState,
    status: StateStatus.Pending,
  }))
  .on(fetchProspectingDraftById.fulfilled, (state, payload) => ({
    ...state,
    data: payload.data.gifting,
    status: StateStatus.Fulfilled,
  }));

gifting
  .on(fetchProspectingById.pending, () => ({
    ...initialState,
    status: StateStatus.Pending,
  }))
  .on(fetchProspectingById.fulfilled, (state, payload) => ({
    ...state,
    data: payload.data.gifting,
    status: StateStatus.Fulfilled,
  }));

gifting
  .on(updateDraftProspectingGifting.pending, state => ({
    ...state,
    errors: initialState.errors,
    status: StateStatus.Pending,
  }))
  .on(updateDraftProspectingGifting.fulfilled, (state, payload) => ({
    ...initialState,
    data: payload,
    status: StateStatus.Fulfilled,
  }))
  .on(updateDraftProspectingGifting.rejected, (state, payload) => ({
    ...state,
    errors: payload || initialState.errors,
    status: StateStatus.Rejected,
  }));

gifting
  .on(updateProspectingGifting.pending, state => ({
    ...state,
    errors: initialState.errors,
    status: StateStatus.Pending,
  }))
  .on(updateProspectingGifting.fulfilled, (state, payload) => ({
    ...initialState,
    data: payload,
    status: StateStatus.Fulfilled,
  }))
  .on(updateProspectingGifting.rejected, (state, payload) => ({
    ...state,
    errors: payload || initialState.errors,
    status: StateStatus.Rejected,
  }));

gifting.on(resetProspectingCampaign, () => initialState);
