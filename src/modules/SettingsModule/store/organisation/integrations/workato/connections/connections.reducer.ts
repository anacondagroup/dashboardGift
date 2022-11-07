import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import { IWorkatoConnection } from '../workato.types';

import { handleConnectionStatusChange, fetchWorkatoConnectionsByIntegration } from './connections.actions';

export interface IConnectionState {
  state: StateStatus;
  integrationId: string | null;
  list: IWorkatoConnection[];
}
const initialState: IConnectionState = {
  state: StateStatus.Idle,
  integrationId: null,
  list: [],
};
export const connections = createReducer({}, initialState)
  .on(fetchWorkatoConnectionsByIntegration.pending, state => ({
    ...state,
    state: StateStatus.Pending,
    integrationId: null,
    list: [],
  }))
  .on(fetchWorkatoConnectionsByIntegration.fulfilled, (state, { data, integrationId }) => ({
    ...state,
    state: StateStatus.Fulfilled,
    integrationId,
    list: data,
  }))
  .on(fetchWorkatoConnectionsByIntegration.rejected, state => ({
    ...state,
    state: StateStatus.Rejected,
    integrationId: null,
    list: [],
  }))
  .on(handleConnectionStatusChange, (state, { connectionId, status }) => ({
    ...state,
    list: state.list.map(connection =>
      connection.workatoConnectionId === connectionId ? { ...connection, status } : connection,
    ),
  }));
