import { createAction } from 'redux-act';
import { IResponse, TErrors } from '@alycecom/services';

import { IOAuthStateResponse, OAuthConnectionEvent } from './sfOAuth.types';

const PREFIX = 'ORG_SETTINGS/SF_AOUTH';

export const loadOAuthState = createAction(`${PREFIX}/LOAD_STATE_REQUEST`);
export const loadOAuthStateError = createAction<TErrors>(`${PREFIX}/LOAD_STATE_ERROR`);
export const loadOAuthStateSuccess = createAction<IResponse<IOAuthStateResponse>>(`${PREFIX}/LOAD_STATE_SUCCESS`);

export const finishOauthFlow = createAction<OAuthConnectionEvent>(`${PREFIX}/FINISH_OAUTH_FLOW`);
export const startLoadOauthFlowLink = createAction(`${PREFIX}/LOAD_OAUTH_FLOW_LINK_REQUEST`);
export const successLoadOAuthFlowLink = createAction<string>(`${PREFIX}/SUCCESS_LOAD_OAUTH_FLOW_LINK`);
export const errorLoadOAuthFlowLink = createAction<TErrors>(`${PREFIX}/ERROR_LOAD_OAUTH_FLOW_LINK`);
export const disconnectFromOAuth = createAction<IResponse<IOAuthStateResponse>>(
  `${PREFIX}/DISCONNECT_OAUTH_FLOW_REQUEST`,
);
