import { StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';

import { TIntegrationSubscription } from './subscription.types';
import { fetchOrganizationSubscriptions } from './subscription.actions';

export interface TSubscriptionState {
  data?: TIntegrationSubscription;
  status: StateStatus;
}

const initialState: TSubscriptionState = {
  data: undefined,
  status: StateStatus.Idle,
};

export const subscription = createReducer({}, initialState)
  .on(fetchOrganizationSubscriptions.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(fetchOrganizationSubscriptions.fulfilled, (state, { integrations }) => ({
    ...state,
    status: StateStatus.Fulfilled,
    data: integrations,
  }))
  .on(fetchOrganizationSubscriptions.rejected, state => ({
    ...state,
    status: StateStatus.Rejected,
  }));
