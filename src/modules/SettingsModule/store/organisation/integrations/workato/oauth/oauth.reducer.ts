import { StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';

import { clearWorkatoIntegrationToken, fetchWorkatoIntegrationToken } from './oauth.actions';

type TWorkatoToken = { token: string | null; status: StateStatus };

export interface IOauthState {
  [connectionId: string]: TWorkatoToken;
}
const initialState: IOauthState = {};

export const oauth = createReducer({}, initialState)
  .on(fetchWorkatoIntegrationToken.pending, (state, { connectionId }) => ({
    ...state,
    [connectionId]: {
      status: StateStatus.Pending,
      token: null,
    },
  }))
  .on(fetchWorkatoIntegrationToken.fulfilled, (state, { connectionId, token }) => ({
    ...state,
    [connectionId]: {
      status: StateStatus.Fulfilled,
      token,
    },
  }))
  .on(fetchWorkatoIntegrationToken.rejected, (state, { connectionId }) => ({
    ...state,
    [connectionId]: {
      status: StateStatus.Rejected,
      token: null,
    },
  }))
  .on(clearWorkatoIntegrationToken.pending, (state, { connectionId }) => {
    const current = { ...state };
    delete current[connectionId];
    return current;
  });
