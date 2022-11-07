import { combineReducers } from 'redux';

import { reducer as profileReducer } from './profile/profile.reducer';
import { reducer as historyReducer } from './history/history.reducer';

// TODO Replace with described state
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IContactState {
  [key: string]: any;
}

export default combineReducers<IContactState>({
  profile: profileReducer,
  history: historyReducer,
});
