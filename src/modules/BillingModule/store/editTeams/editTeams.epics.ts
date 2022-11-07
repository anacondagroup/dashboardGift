import { ofType } from '@alycecom/utils';
import { Epic } from 'redux-observable';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { handleError, handlers, MessageType, IListResponse, TrackEvent } from '@alycecom/services';

import { getGroupsListRequest } from '../billingGroups/billingGroups.actions';

import { ITeamsListSearchDetails } from './editTeams.types';
import { getSearch, getInitialTeamsList, getEditCurrentGroupIdToEditTeams } from './editTeams.selectors';
import {
  getSearchTeamsListRequest,
  getSearchTeamsListSuccess,
  getSearchTeamsListFail,
  setSearchText,
  setFilterGroupedTeams,
  updateTeamsListInGroupRequest,
  updateTeamsListInGroupSuccess,
  updateTeamsListInGroupFail,
} from './editTeams.actions';

export const setSearchTeamEpic: Epic = action$ =>
  action$.pipe(
    ofType(...[setSearchText, setFilterGroupedTeams]),
    switchMap(() => [getSearchTeamsListRequest()]),
  );

export const getTeamsListEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(getSearchTeamsListRequest),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const search = getSearch(state);
      const queryString = search || JSON.stringify(search);
      return apiService.get(`/api/v1/hierarchy/teams?teamName=${queryString}`, null, true).pipe(
        mergeMap((response: IListResponse<ITeamsListSearchDetails>) => [getSearchTeamsListSuccess(response.data)]),
        catchError(
          handleError(
            handlers.handleAnyError(getSearchTeamsListFail),
            handlers.handleErrorsAsText((text: string) => showGlobalMessage({ text, type: MessageType.Error })),
          ),
        ),
      );
    }),
  );

export const updateTeamsInGroupEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(updateTeamsListInGroupRequest),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) => {
      const initialTeams = getInitialTeamsList(state);
      const currentGroupId = getEditCurrentGroupIdToEditTeams(state);
      const removedTeams = initialTeams.filter(
        oldTeams => !payload.teamIds.some(newTeams => oldTeams.teamId === newTeams),
      );
      const removedTeamsIds = removedTeams.map(team => team.teamId);
      return apiService
        .patch(`/api/v1/groups/${currentGroupId}/teams`, { body: { teamIds: payload.teamIds } }, true)
        .pipe(
          mergeMap(() => [
            showGlobalMessage({ type: MessageType.Success, text: 'Updated list of teams' }),
            updateTeamsListInGroupSuccess(),
            getGroupsListRequest({ isSearching: false }),
            TrackEvent.actions.trackEvent({
              name: 'Manage billing - Billing goups - Edit teams - Uppdated',
              payload: { groupId: currentGroupId, teamsAdded: payload.teamIds, teamsRemoved: removedTeamsIds },
            }),
          ]),
          catchError(
            handleError(
              handlers.handleAnyError(
                updateTeamsListInGroupFail,
                TrackEvent.actions.trackEvent({
                  name: 'Manage billing - Billing goups - Edit teams - Failed',
                  payload: { groupId: currentGroupId, teamIds: payload.teamIds },
                }),
              ),
              handlers.handleErrorsAsText((text: string) => showGlobalMessage({ text, type: MessageType.Error })),
            ),
          ),
        );
    }),
  );

export default [setSearchTeamEpic, getTeamsListEpic, updateTeamsInGroupEpic];
