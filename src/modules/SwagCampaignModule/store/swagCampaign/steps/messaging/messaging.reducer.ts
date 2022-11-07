import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import { TSwagMessaging } from '../../swagCampaign.types';
import { fetchSwagDraftById, fetchSwagById, resetSwagCampaign } from '../../swagCampaign.actions';

import { TMessagingErrors } from './messaging.types';
import { updateDraftSwagMessaging } from './messaging.actions';

export type TMessagingState = {
  status: StateStatus;
  data: TSwagMessaging | null;
  errors: TMessagingErrors;
};

export const initialState: TMessagingState = {
  status: StateStatus.Idle,
  data: null,
  errors: {},
};

export const messaging = createReducer({}, initialState);

messaging
  .on(fetchSwagDraftById.pending, () => ({
    ...initialState,
    status: StateStatus.Pending,
  }))
  .on(fetchSwagDraftById.fulfilled, (state, { data }) => ({
    ...state,
    data: data.messaging,
    status: StateStatus.Fulfilled,
  }));

messaging
  .on(fetchSwagById.pending, () => ({
    ...initialState,
    status: StateStatus.Pending,
  }))
  .on(fetchSwagById.fulfilled, (state, { data }) => ({
    ...state,
    data: data.messaging,
    status: StateStatus.Fulfilled,
  }));

messaging
  .on(updateDraftSwagMessaging.pending, state => ({
    ...state,
    status: StateStatus.Pending,
    errors: initialState.errors,
  }))
  .on(updateDraftSwagMessaging.fulfilled, (state, data) => ({
    ...state,
    status: StateStatus.Fulfilled,
    data,
  }))
  .on(updateDraftSwagMessaging.rejected, (state, errors) => ({
    ...state,
    state: StateStatus.Rejected,
    errors: errors || initialState.errors,
  }));

messaging.on(resetSwagCampaign, () => initialState);
