import { combineReducers } from 'redux';

import { teams, TTeamsState } from './teams';
import { userDrafts, TUserDraftsState } from './userDrafts';

export interface IUsersManagementEntitiesState {
  teams: TTeamsState;
  userDrafts: TUserDraftsState;
}

export const entities = combineReducers<IUsersManagementEntitiesState>({
  teams,
  userDrafts,
});
