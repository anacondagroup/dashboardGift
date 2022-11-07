import { createReducer } from 'redux-act';

import { IWorkatoPicklist } from '../workato.types';

import { fetchWorkatoPicklistByConnection } from './picklists.actions';

export interface IPicklistsState {
  [name: string]: IWorkatoPicklist[];
}
const initialState: IPicklistsState = {};

export const picklists = createReducer({}, initialState)
  .on(fetchWorkatoPicklistByConnection, state => ({
    ...state,
  }))
  .on(fetchWorkatoPicklistByConnection.fulfilled, (state, { name, data }) => ({
    ...state,
    [name]: data,
  }))
  .on(fetchWorkatoPicklistByConnection.rejected, state => ({
    ...state,
  }));
