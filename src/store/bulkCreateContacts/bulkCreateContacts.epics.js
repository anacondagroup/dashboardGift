import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators/index';

import { importEpic } from './import/import.epics';
import { BULK_CREATE_GET_TEAMS_REQUEST } from './bulkCreateContacts.types';
import { getAvailableTeamsSuccess } from './bulkCreateContacts.actions';

export const getAvailableTeamsEpic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(BULK_CREATE_GET_TEAMS_REQUEST),
    mergeMap(() =>
      apiService
        .get(`/enterprise/gift-create/available-teams`)
        .pipe(map(response => getAvailableTeamsSuccess(response.teams))),
    ),
  );
export const bulkCreateContactsEpic = [getAvailableTeamsEpic, ...importEpic];
