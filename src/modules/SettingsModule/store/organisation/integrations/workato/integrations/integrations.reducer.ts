import { StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';

import { IWorkatoIntegration } from '../workato.types';
import { TSfConnectionState } from '../../salesforce/sfOAuth.types';

import { fetchSfConnectionState, fetchWorkatoIntegrations } from './integrations.actions';

export interface ISalesforceCardState {
  status: StateStatus;
  connectionState?: TSfConnectionState;
}

export interface IIntegrationState {
  state: StateStatus;
  list: IWorkatoIntegration[];
  salesforce: ISalesforceCardState;
}
const initialState: IIntegrationState = {
  state: StateStatus.Idle,
  list: [],
  salesforce: {
    status: StateStatus.Idle,
    connectionState: undefined,
  },
};
export const integrations = createReducer({}, initialState)
  .on(fetchWorkatoIntegrations.pending, state => ({
    ...state,
    state: StateStatus.Pending,
    list: [],
  }))
  .on(fetchWorkatoIntegrations.fulfilled, (state, payload) => ({
    ...state,
    state: StateStatus.Fulfilled,
    list: payload,
  }))
  .on(fetchWorkatoIntegrations.rejected, state => ({
    ...state,
    state: StateStatus.Rejected,
    list: [],
  }))
  .on(fetchSfConnectionState.pending, state => ({
    ...state,
    salesforce: {
      ...state.salesforce,
      status: StateStatus.Pending,
    },
  }))
  .on(fetchSfConnectionState.fulfilled, (state, payload) => ({
    ...state,
    salesforce: {
      ...state.salesforce,
      status: StateStatus.Fulfilled,
      connectionState: payload.state,
    },
  }))
  .on(fetchSfConnectionState.rejected, state => ({
    ...state,
    salesforce: {
      ...state.salesforce,
      status: StateStatus.Rejected,
    },
  }));
