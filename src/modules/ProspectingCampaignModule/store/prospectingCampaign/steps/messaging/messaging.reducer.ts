import { StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';

import { TProspectingMessaging } from '../../prospectingCampaign.types';
import {
  fetchProspectingById,
  fetchProspectingDraftById,
  resetProspectingCampaign,
} from '../../prospectingCampaign.actions';

import { TMessagingErrors } from './messaging.types';
import { updateDraftProspectingMessaging, updateProspectingMessaging } from './messaging.actions';

export type TMessagingState = {
  status: StateStatus;
  data: TProspectingMessaging | null;
  errors: TMessagingErrors;
};

export const initialState: TMessagingState = {
  status: StateStatus.Idle,
  data: null,
  errors: {},
};

export const messaging = createReducer({}, initialState);

messaging
  .on(fetchProspectingDraftById.pending, () => ({
    ...initialState,
    status: StateStatus.Pending,
  }))
  .on(fetchProspectingDraftById.fulfilled, (state, payload) => ({
    ...state,
    data: payload.data.messaging,
    status: StateStatus.Fulfilled,
  }));

messaging
  .on(fetchProspectingById.pending, () => ({
    ...initialState,
    status: StateStatus.Pending,
  }))
  .on(fetchProspectingById.fulfilled, (state, payload) => ({
    ...state,
    data: payload.data.messaging,
    status: StateStatus.Fulfilled,
  }));

messaging
  .on(updateDraftProspectingMessaging.pending, state => ({
    ...state,
    errors: initialState.errors,
    status: StateStatus.Pending,
  }))
  .on(updateDraftProspectingMessaging.fulfilled, (state, data) => ({
    ...state,
    status: StateStatus.Fulfilled,
    data,
  }))
  .on(updateDraftProspectingMessaging.rejected, (state, errors) => ({
    ...state,
    status: StateStatus.Rejected,
    errors: errors || initialState.errors,
  }));

messaging
  .on(updateProspectingMessaging.pending, state => ({
    ...state,
    errors: initialState.errors,
    status: StateStatus.Pending,
  }))
  .on(updateProspectingMessaging.fulfilled, (state, data) => ({
    ...state,
    status: StateStatus.Fulfilled,
    data,
  }))
  .on(updateProspectingMessaging.rejected, (state, errors) => ({
    ...state,
    status: StateStatus.Rejected,
    errors: errors || initialState.errors,
  }));

messaging.on(resetProspectingCampaign, () => initialState);
