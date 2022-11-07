import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import { TSwagGifting } from '../../swagCampaign.types';
import { fetchSwagById, fetchSwagDraftById, resetSwagCampaign } from '../../swagCampaign.actions';

import { updateDraftSwagGifting } from './gifting.actions';
import { TGiftingErrors } from './gifting.types';

export type TGiftingState = {
  status: StateStatus;
  data: TSwagGifting | null;
  errors: TGiftingErrors;
};

export const initialState = {
  status: StateStatus.Idle,
  data: null,
  errors: {},
};

export const gifting = createReducer<TGiftingState>({}, initialState);

gifting
  .on(fetchSwagDraftById.pending, () => ({
    ...initialState,
    status: StateStatus.Pending,
  }))
  .on(fetchSwagDraftById.fulfilled, (state, payload) => ({
    ...state,
    data: payload.data.gifting,
    status: StateStatus.Fulfilled,
  }));

gifting
  .on(fetchSwagById.pending, () => ({
    ...initialState,
    status: StateStatus.Pending,
  }))
  .on(fetchSwagById.fulfilled, (state, payload) => ({
    ...state,
    data: payload.data.gifting,
    status: StateStatus.Fulfilled,
  }));

gifting
  .on(updateDraftSwagGifting.pending, state => ({
    ...state,
    errors: initialState.errors,
    status: StateStatus.Pending,
  }))
  .on(updateDraftSwagGifting.fulfilled, (state, payload) => ({
    ...initialState,
    data: payload,
    status: StateStatus.Fulfilled,
  }))
  .on(updateDraftSwagGifting.rejected, (state, payload) => ({
    ...state,
    errors: payload || initialState.errors,
    status: StateStatus.Rejected,
  }));

gifting.on(resetSwagCampaign, () => initialState);
