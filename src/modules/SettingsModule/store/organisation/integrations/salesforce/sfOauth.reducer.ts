import { createReducer } from 'redux-act';

import {
  finishOauthFlow,
  loadOAuthState,
  loadOAuthStateError,
  loadOAuthStateSuccess,
  startLoadOauthFlowLink,
  successLoadOAuthFlowLink,
} from './sfOauth.actions';
import { ConnectionState } from './sfOAuth.types';

export interface ISfOauthState {
  state: ConnectionState;
  isLoading: boolean;
  message: string | null;
  sfOAuthLink: string | null;
  connectedBy: string | null;
  connectedAt: string | null;
}

export const initialState: ISfOauthState = {
  state: ConnectionState.Disconnected,
  isLoading: false,
  message: null,
  connectedBy: null,
  sfOAuthLink: null,
  connectedAt: null,
};

const reducer = createReducer({}, initialState);

reducer.on(loadOAuthState, state => ({
  ...state,
  isLoading: true,
}));

reducer.on(loadOAuthStateError, state => ({
  ...state,
  isLoading: false,
}));

reducer.on(loadOAuthStateSuccess, (state, { data }) => ({
  ...state,
  state: data.state,
  connectedBy: data.connectedBy,
  connectedAt: data.connectedAt,
  isLoading: false,
}));

reducer.on(finishOauthFlow, (state, event) => ({
  ...state,
  state: event.state,
  message: event.message,
}));

reducer.on(startLoadOauthFlowLink, state => ({
  ...state,
  isLoading: true,
}));

reducer.on(successLoadOAuthFlowLink, (state, link) => ({
  ...state,
  sfOAuthLink: link,
}));

export default reducer;
