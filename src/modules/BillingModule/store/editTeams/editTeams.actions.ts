import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { ITeamDetail } from '../billingGroups/billingGroups.types';

import { ITeamsListSearchDetails } from './editTeams.types';

const PREFIX = `EDIT_GROUP_TEAMS`;

export const setEditTeamsOpen = createAction<{ openModal: boolean; groupId: string | null }>(
  `${PREFIX}/SET_EDIT_TEAMS_MODAL`,
);
export const setCurrentTeamsToEditGroup = createAction<{ groupName: string; teamsList: ITeamDetail[] }>(
  `${PREFIX}/SET_CURRENT_TEAMS_LIST_EDIT_GROUP`,
);

export const setSearchText = createAction<{ groupId: string | null; searchText: string }>(`${PREFIX}/SET_SEARCH_TEXT`);

export const getSearchTeamsListRequest = createAction(`${PREFIX}/SEARCH_TEAMS_LIST.REQUEST`);
export const getSearchTeamsListSuccess = createAction<ITeamsListSearchDetails[]>(`${PREFIX}/SEARCH_TEAMS_LIST.SUCCESS`);
export const getSearchTeamsListFail = createAction<TErrors>(`${PREFIX}/SEARCH_TEAMS_LIST.FAIL`);

export const setFilterGroupedTeams = createAction<boolean>(`${PREFIX}/SET_FILTER_GROUPED`);

export const addRemoveTeamFromGroup = createAction<{ teamId: number; chose: boolean }>(
  `${PREFIX}/ADD_REMOVE_TEAM_FROM_GROUP`,
);

export const updateTeamsListInGroupRequest = createAction<{ teamIds: number[] }>(
  `${PREFIX}/UPDATE_TEAMS_LIST_IN_GROUP_REQUEST`,
);
export const updateTeamsListInGroupSuccess = createAction(`${PREFIX}/UPDATE_TEAMS_LIST_IN_GROUP_SUCCESS`);
export const updateTeamsListInGroupFail = createAction<TErrors>(`${PREFIX}/UPDATE_TEAMS_LIST_IN_GROUP_FAIL`);
