import { Epic } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';

import {
  loadTeamAdminsFail,
  loadTeamAdminsRequest,
  loadTeamAdminsSuccess,
  loadTeamMembersFail,
  loadTeamMembersRequest,
  loadTeamMembersSuccess,
} from './teamMembers.actions';
import { ITeamMembersResponse } from './teamMembers.types';

const loadTeamMembersEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(loadTeamMembersRequest),
    switchMap(({ payload }) =>
      apiService.get(`/enterprise/dashboard/campaigns/${payload.campaignId}/team-members`).pipe(
        map(({ team_members: members }: ITeamMembersResponse) => loadTeamMembersSuccess({ members })),
        catchError(errorHandler({ callbacks: loadTeamMembersFail })),
      ),
    ),
  );

const loadTeamAdminsEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(loadTeamAdminsRequest),
    switchMap(({ payload }) =>
      apiService.get(`/enterprise/dashboard/campaigns/${payload.campaignId}/team-members?type=admin`).pipe(
        map(({ team_members: admins }: ITeamMembersResponse) => loadTeamAdminsSuccess({ admins })),
        catchError(errorHandler({ callbacks: loadTeamAdminsFail })),
      ),
    ),
  );

export default [loadTeamMembersEpic, loadTeamAdminsEpic];
