import { createSelector } from 'reselect';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../../../store/root.types';

import { IOauthState } from './oauth.reducer';

const getWorkatoOauthState = (state: IRootState): IOauthState => state.settings.organisation.integrations.workato.oauth;

export const makeGetTokenByConnectionIdentifier = (
  connectionIdentifier: string,
): ((state: IRootState) => string | null) =>
  createSelector(getWorkatoOauthState, state =>
    state[connectionIdentifier] ? state[connectionIdentifier].token : null,
  );

export const makeGetIsLoadingTokenByConnectionIdentifier = (
  connectionIdentifier: string,
): ((state: IRootState) => boolean) =>
  createSelector(getWorkatoOauthState, state =>
    state[connectionIdentifier] ? state[connectionIdentifier].status === StateStatus.Pending : false,
  );

export const getIsLoadingSomeToken = createSelector(getWorkatoOauthState, state => {
  const connectionIds = Object.keys(state);
  return connectionIds.some(cid => state[cid].status === StateStatus.Pending);
});
