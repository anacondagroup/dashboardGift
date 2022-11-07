import { equals, pipe, prop } from 'ramda';
import { createSelector } from 'reselect';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../../../store/root.types';

import { IEmbeddingState } from './embedding.reducer';

const getWorkatoEmbeddingState = (state: IRootState): IEmbeddingState =>
  state.settings.organisation.integrations.workato.embedding;

export const getWorkatoEmbeddingToken = pipe(getWorkatoEmbeddingState, prop('token'));
const getWorkatoOauthTokenState = pipe(getWorkatoEmbeddingState, prop('status'));
export const getIsLoadingWorkatoEmbeddingToken = createSelector(getWorkatoOauthTokenState, equals(StateStatus.Pending));
