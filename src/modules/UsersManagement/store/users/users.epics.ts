import { Epic } from 'redux-observable';
import { catchError, switchMap, map, withLatestFrom, mergeMap } from 'rxjs/operators';
import { ofType, queryParamsBuilder } from '@alycecom/utils';
import { handleError, handlers } from '@alycecom/services';

import { IOffsetPagination, IRequestUsersParams, IUser, IUsersMeta } from '../usersManagement.types';
import { setTeamMembersBudgetTable } from '../../../SettingsModule/store/teams/teamOperation/teamOperation.actions';

import { getIsAllSelected, getLastFilters, getUsers } from './users.selectors';
import {
  loadUsersRequest,
  loadUsersSuccess,
  loadUsersFail,
  refreshUsersRequest,
  setLastFilters,
} from './users.actions';

const getQueryUrl = ({
  search,
  teamId,
  pendingInvitation,
  sortField,
  sortDirection,
  limit,
  currentPage,
}: IRequestUsersParams): string =>
  `/api/v1/users?${queryParamsBuilder({
    filter: { search, teamId, pendingInvitation },
    sort: {
      field: sortField,
      direction: sortDirection,
    },
    pagination: {
      limit,
      offset: limit * (currentPage - 1),
    },
  })}`;

export const loadUsersEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadUsersRequest),
    switchMap(({ payload }) =>
      apiService.get(getQueryUrl(payload), {}, true).pipe(
        mergeMap(({ data, pagination, meta }: { data: IUser[]; pagination: IOffsetPagination; meta: IUsersMeta }) => {
          const previousUsers = getUsers(state$.value);
          const isPreviousAllSelected = getIsAllSelected(state$.value);
          const pipeReturn = [
            setTeamMembersBudgetTable({
              users: [...previousUsers, ...data],
              pagination: payload.currentPage + 1,
            }),
            loadUsersSuccess({ data, pagination, meta }),
            setLastFilters({
              ...payload,
              isAllSelected: isPreviousAllSelected,
            }),
          ];
          if (!payload.isLoadMore) {
            pipeReturn.shift();
          }

          return pipeReturn;
        }),
        catchError(handleError(handlers.handleAnyError(loadUsersFail))),
      ),
    ),
  );

export const refreshUsersEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(refreshUsersRequest),
    withLatestFrom(state$),
    map(([, state]) => loadUsersRequest(getLastFilters(state))),
  );

export const usersEpics = [loadUsersEpic, refreshUsersEpic];
