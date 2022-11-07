import { StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';

import { fetchWorkatoEmbeddingToken } from './embedding.actions';

export interface IEmbeddingState {
  token: string | null;
  status: StateStatus;
}
const initialState: IEmbeddingState = {
  token: null,
  status: StateStatus.Idle,
};

export const embedding = createReducer({}, initialState)
  .on(fetchWorkatoEmbeddingToken.pending, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(fetchWorkatoEmbeddingToken.fulfilled, (state, payload) => ({
    ...state,
    token: payload.token,
    status: StateStatus.Fulfilled,
  }))
  .on(fetchWorkatoEmbeddingToken.rejected, state => ({
    ...state,
    status: StateStatus.Rejected,
  }));
