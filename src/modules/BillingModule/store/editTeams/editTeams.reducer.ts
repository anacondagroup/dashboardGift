import { createReducer } from 'redux-act';
import { sortBy, prop } from 'ramda';
import { TErrors } from '@alycecom/services';

import { StateStatus } from '../../../../store/stateStatuses.types';

import { ITeamsListSearchDetails } from './editTeams.types';
import {
  setEditTeamsOpen,
  setCurrentTeamsToEditGroup,
  setSearchText,
  setFilterGroupedTeams,
  getSearchTeamsListRequest,
  getSearchTeamsListSuccess,
  getSearchTeamsListFail,
  addRemoveTeamFromGroup,
  updateTeamsListInGroupRequest,
  updateTeamsListInGroupSuccess,
  updateTeamsListInGroupFail,
} from './editTeams.actions';

export interface IEditTeamsState {
  filterGrouped: boolean;
  isEditTeamsModalOpen: boolean;
  loadingTeamsList: StateStatus;
  teams: ITeamsListSearchDetails[];
  initialTeams: ITeamsListSearchDetails[];
  search: string;
  groupId: string | null;
  currentGroupIdToEditTeams: string | null;
  updateTeamsInProgress: StateStatus;
  errors: TErrors;
}

export const initialState: IEditTeamsState = {
  filterGrouped: false,
  isEditTeamsModalOpen: false,
  loadingTeamsList: StateStatus.Idle,
  teams: [],
  initialTeams: [],
  search: '',
  groupId: null,
  currentGroupIdToEditTeams: '',
  updateTeamsInProgress: StateStatus.Idle,
  errors: {},
};

export const editTeams = createReducer({}, initialState);

const createTeamsList = (
  payload: ITeamsListSearchDetails[],
  teamsList: ITeamsListSearchDetails[],
  filterGrouped: boolean,
  groupId: string | null,
) => {
  const currentTemasListFiltered = teamsList.filter(team => team.chose);
  const filteredResults = payload
    .filter(searchResult => !currentTemasListFiltered.some(currentTeam => searchResult.teamId === currentTeam.teamId))
    .map(team => ({
      ...team,
      disabled: team.groupId !== groupId,
    }));
  const tempList = filterGrouped ? filteredResults.filter(team => !team.groupId) : filteredResults;
  const newTeamsList = sortBy(prop('teamName'), [...tempList, ...currentTemasListFiltered]);
  return newTeamsList;
};

editTeams
  .on(setEditTeamsOpen, (state, payload) => ({
    ...state,
    isEditTeamsModalOpen: payload.openModal,
    currentGroupIdToEditTeams: payload.groupId,
    search: payload.openModal ? state.search : '',
    teams: payload.openModal ? state.teams : [],
  }))
  .on(setCurrentTeamsToEditGroup, (state, payload) => ({
    ...state,
    teams: [
      ...state.teams,
      ...payload.teamsList.map(team => ({
        ...team,
        groupName: payload.groupName,
        chose: true,
        disabled: false,
      })),
    ],
    initialTeams: payload.teamsList.map(team => ({
      ...team,
      groupName: payload.groupName,
      chose: true,
      disabled: false,
    })),
  }))
  .on(setFilterGroupedTeams, (state, payload) => ({
    ...state,
    filterGrouped: payload,
  }))
  .on(setSearchText, (state, payload) => ({
    ...state,
    search: payload.searchText,
  }))
  .on(getSearchTeamsListRequest, state => ({
    ...state,
    loadingTeamsList: StateStatus.Pending,
  }))
  .on(getSearchTeamsListSuccess, (state, payload) => ({
    ...state,
    loadingTeamsList: StateStatus.Fulfilled,
    teams: createTeamsList(payload, state.teams, state.filterGrouped, state.groupId),
  }))
  .on(getSearchTeamsListFail, (state, payload) => ({
    ...state,
    loadingTeamsList: StateStatus.Rejected,
    errors: payload,
  }));

editTeams
  .on(addRemoveTeamFromGroup, (state, payload) => ({
    ...state,
    teams: state.teams.map(team =>
      team.teamId === payload.teamId
        ? {
            ...team,
            chose: payload.chose,
          }
        : team,
    ),
  }))
  .on(updateTeamsListInGroupRequest, state => ({
    ...state,
    updateTeamsInProgress: StateStatus.Pending,
  }))
  .on(updateTeamsListInGroupSuccess, state => ({
    ...state,
    teams: [],
    initialTeams: [],
    updateTeamsInProgress: StateStatus.Fulfilled,
    isEditTeamsModalOpen: false,
    search: '',
    groupId: null,
  }))
  .on(updateTeamsListInGroupFail, (state, payload) => ({
    ...state,
    updateTeamsInProgress: StateStatus.Rejected,
    errors: payload,
  }));
