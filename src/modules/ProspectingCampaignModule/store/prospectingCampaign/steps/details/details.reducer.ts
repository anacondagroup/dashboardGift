import { createReducer } from 'redux-act';
import { Path } from 'react-hook-form';
import { StateStatus } from '@alycecom/utils';

import { TProspectingDetails } from '../../prospectingCampaign.types';
import {
  createProspectingDraft,
  fetchProspectingById,
  fetchProspectingDraftById,
  resetProspectingCampaign,
} from '../../prospectingCampaign.actions';

import { updateDraftProspectingDetails, updateProspectingDetails } from './details.actions';

export type TDetailsState = {
  status: StateStatus;
  data: TProspectingDetails | null;
  errors: Partial<Record<Path<TProspectingDetails>, string[]>>;
};

export const initialState = {
  status: StateStatus.Idle,
  data: null,
  errors: {},
};

export const details = createReducer<TDetailsState>({}, initialState);

details
  .on(fetchProspectingDraftById.pending, () => ({
    ...initialState,
    status: StateStatus.Pending,
  }))
  .on(fetchProspectingDraftById.fulfilled, (state, payload) => ({
    ...state,
    data: payload.data.details,
    status: StateStatus.Fulfilled,
  }));

details
  .on(fetchProspectingById.pending, () => ({
    ...initialState,
    status: StateStatus.Pending,
  }))
  .on(fetchProspectingById.fulfilled, (state, payload) => ({
    ...state,
    data: payload.data.details,
    status: StateStatus.Fulfilled,
  }))
  .on(fetchProspectingById.rejected, () => ({
    ...initialState,
    status: StateStatus.Rejected,
  }));

details
  .on(createProspectingDraft, () => ({
    ...initialState,
    status: StateStatus.Pending,
  }))
  .on(createProspectingDraft.fulfilled, (state, payload) => ({
    ...initialState,
    data: payload.data.details,
    status: StateStatus.Fulfilled,
  }))
  .on(createProspectingDraft.rejected, (state, payload) => ({
    ...state,
    errors: payload || initialState.errors,
    status: StateStatus.Rejected,
  }));

details
  .on(updateDraftProspectingDetails.pending, state => ({
    ...state,
    errors: initialState.errors,
    status: StateStatus.Pending,
  }))
  .on(updateDraftProspectingDetails.fulfilled, (state, payload) => ({
    ...initialState,
    data: payload,
    status: StateStatus.Fulfilled,
  }))
  .on(updateDraftProspectingDetails.rejected, (state, payload) => ({
    ...state,
    errors: payload || initialState.errors,
    status: StateStatus.Rejected,
  }));

details
  .on(updateProspectingDetails.pending, state => ({
    ...state,
    errors: initialState.errors,
    status: StateStatus.Pending,
  }))
  .on(updateProspectingDetails.fulfilled, (state, payload) => ({
    ...state,
    data: payload,
    status: StateStatus.Fulfilled,
    errors: initialState.errors,
  }))
  .on(updateProspectingDetails.rejected, (state, payload) => ({
    ...state,
    errors: payload || initialState.errors,
    status: StateStatus.Rejected,
  }));

details.on(resetProspectingCampaign, () => initialState);
