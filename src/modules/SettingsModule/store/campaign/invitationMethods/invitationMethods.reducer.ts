import { createReducer } from 'redux-act';
import { createEntityAdapter, StateStatus } from '@alycecom/utils';

import { IGiftInvitationMethod } from './invitationMethods.types';
import * as actions from './invitationMethods.actions';
import { getGiftInvitationMethodsUpdates } from './invitationMethods.helpers';

export const giftInvitationMethodsAdapter = createEntityAdapter<IGiftInvitationMethod>();

export const initialState = giftInvitationMethodsAdapter.getInitialState({
  status: StateStatus.Idle,
});

export type TGiftInvitationMethodsState = typeof initialState;

export const invitationMethods = createReducer({}, initialState);

invitationMethods
  .on(actions.fetchGiftInvitationMethods, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(actions.fetchGiftInvitationMethodsSuccess, (state, payload) => ({
    ...state,
    ...giftInvitationMethodsAdapter.setAll(payload, state),
    status: StateStatus.Fulfilled,
  }))
  .on(actions.fetchGiftInvitationMethodsFail, state => ({
    ...state,
    status: StateStatus.Rejected,
  }));

invitationMethods
  .on(actions.updateGiftInvitationMethods, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(actions.updateGiftInvitationMethodsSuccess, (state, { restrictedMethodIds }) => ({
    ...state,
    ...giftInvitationMethodsAdapter.updateMany(
      getGiftInvitationMethodsUpdates(restrictedMethodIds, state.entities),
      state,
    ),
    status: StateStatus.Fulfilled,
  }))
  .on(actions.updateGiftInvitationMethodsFail, state => ({
    ...state,
    status: StateStatus.Rejected,
  }));
