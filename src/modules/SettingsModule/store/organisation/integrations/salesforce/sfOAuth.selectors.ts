import { equals, pipe } from 'ramda';

import { IRootState } from '../../../../../../store/root.types';

import { ConnectionState } from './sfOAuth.types';

const pathToOauthData = (state: IRootState) => state.settings.organisation.integrations.salesforce;
export const getOAuthState = pipe(pathToOauthData, state => state.state);
export const getOAuthIsLoading = pipe(pathToOauthData, state => state.isLoading);
export const getOAuthConnectedAt = pipe(pathToOauthData, state => state.connectedAt);
export const getOAuthLink = pipe(pathToOauthData, state => state.sfOAuthLink);
export const getConnectedBy = pipe(pathToOauthData, state => state.connectedBy);
export const getOauthErrorMessage = pipe(pathToOauthData, state => state.message);
export const getIsSfConnected = pipe(getOAuthState, equals(ConnectionState.Connected));
