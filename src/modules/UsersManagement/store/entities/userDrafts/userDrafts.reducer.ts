import { createReducer } from 'redux-act';
import { createEntityAdapter } from '@alycecom/utils';

import { addUserDrafts, deleteUserDraftById, resetUserDrafts } from './userDrafts.actions';
import { IUserDraft } from './userDrafts.types';

export const userDraftsAdapter = createEntityAdapter<IUserDraft>();

export const initialState = userDraftsAdapter.getInitialState();

export type TUserDraftsState = typeof initialState;

export const userDrafts = createReducer({}, initialState);

userDrafts
  .on(addUserDrafts, (state, payload) => ({
    ...state,
    ...userDraftsAdapter.addMany(payload.users, state),
  }))
  .on(deleteUserDraftById, (state, payload) => ({
    ...state,
    ...userDraftsAdapter.removeOne(payload, state),
  }))
  .on(resetUserDrafts, () => userDraftsAdapter.getInitialState());
