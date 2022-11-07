import { ofType } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators/index';
import { of } from 'rxjs';

import { MEMBERS_LOAD_REQUEST } from './members.types';
import { membersLoadSuccess, membersLoadFail } from './members.actions';

export const loadMembersEpic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(MEMBERS_LOAD_REQUEST),
    mergeMap(action =>
      apiService.get(`/enterprise/dashboard/members?team_id=${action.payload}`).pipe(
        map(response => membersLoadSuccess(response.members)),
        catchError(error => of(membersLoadFail(error))),
      ),
    ),
  );

export const membersEpics = [loadMembersEpic];
