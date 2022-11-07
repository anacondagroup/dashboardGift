import { createReducer } from 'redux-act';
import { Path } from 'react-hook-form';
import { StateStatus } from '@alycecom/utils';

import { TSwagDetails } from '../../swagCampaign.types';
import { createSwagDraft, fetchSwagById, fetchSwagDraftById, resetSwagCampaign } from '../../swagCampaign.actions';

import { updateDraftSwagDetails, updateSwagDetails } from './details.actions';

export type TDetailsState = {
  status: StateStatus;
  data: TSwagDetails | null;
  errors: Partial<Record<Path<TSwagDetails>, string[]>>;
};

export const initialState = {
  status: StateStatus.Idle,
  data: null,
  errors: {},
};

export const details = createReducer<TDetailsState>({}, initialState);

details
  .on(fetchSwagDraftById.pending, () => ({
    ...initialState,
    status: StateStatus.Pending,
  }))
  .on(fetchSwagDraftById.fulfilled, (state, payload) => ({
    ...state,
    data: payload.data.details,
    status: StateStatus.Fulfilled,
  }));

details
  .on(fetchSwagById.pending, () => ({
    ...initialState,
    status: StateStatus.Pending,
  }))
  .on(fetchSwagById.fulfilled, (state, payload) => ({
    ...state,
    data: payload.data.details,
    status: StateStatus.Fulfilled,
  }))
  .on(fetchSwagById.rejected, () => ({
    ...initialState,
    status: StateStatus.Rejected,
  }));

details
  .on(createSwagDraft, () => ({
    ...initialState,
    status: StateStatus.Pending,
  }))
  .on(createSwagDraft.fulfilled, (state, payload) => ({
    ...initialState,
    data: payload.data.details,
    status: StateStatus.Fulfilled,
  }))
  .on(createSwagDraft.rejected, (state, payload) => ({
    ...state,
    errors: payload || initialState.errors,
    status: StateStatus.Rejected,
  }));

details
  .on(updateDraftSwagDetails.pending, state => ({
    ...state,
    errors: initialState.errors,
    status: StateStatus.Pending,
  }))
  .on(updateDraftSwagDetails.fulfilled, (state, payload) => ({
    ...initialState,
    data: payload,
    status: StateStatus.Fulfilled,
  }))
  .on(updateDraftSwagDetails.rejected, (state, payload) => ({
    ...state,
    errors: payload || initialState.errors,
    status: StateStatus.Rejected,
  }));

details
  .on(updateSwagDetails.pending, state => ({
    ...state,
    errors: initialState.errors,
    status: StateStatus.Pending,
  }))
  .on(updateSwagDetails.fulfilled, (state, payload) => ({
    ...state,
    data: payload,
    status: StateStatus.Fulfilled,
    errors: initialState.errors,
  }))
  .on(updateSwagDetails.rejected, (state, payload) => ({
    ...state,
    errors: payload || initialState.errors,
    status: StateStatus.Rejected,
  }));

details.on(resetSwagCampaign, () => initialState);
