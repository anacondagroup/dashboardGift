import { ofType } from 'redux-observable';
import { catchError, debounceTime, map, mergeMap, takeUntil } from 'rxjs/operators';

import {
  organisationApplicationsCreateFail,
  organisationApplicationsCreateSuccess,
  organisationApplicationsFail,
  organisationApplicationsSuccess,
  organisationApplicationsUpdateFail,
  organisationApplicationsUpdateSuccess,
} from './organisationApplications.actions';
import {
  ORGANISATION_APPLICATIONS,
  ORGANISATION_APPLICATIONS_CREATE,
  ORGANISATION_APPLICATIONS_UPDATE,
} from './organisationApplications.types';

export const organisationApplicationEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandlerWithGlobal } },
) =>
  action$.pipe(
    ofType(ORGANISATION_APPLICATIONS.REQUEST),
    debounceTime(300),
    mergeMap(() =>
      apiService.get('/auth/applications', null, true).pipe(
        map(response => organisationApplicationsSuccess(response.applications)),
        catchError(errorHandlerWithGlobal({ callbacks: organisationApplicationsFail })),
        takeUntil(action$.ofType(ORGANISATION_APPLICATIONS.REQUEST)),
      ),
    ),
  );

export const organisationApplicationCreateEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandlerWithGlobal, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(ORGANISATION_APPLICATIONS_CREATE.REQUEST),
    debounceTime(300),
    mergeMap(({ payload }) =>
      apiService.post('/auth/applications/create', { body: payload }, true).pipe(
        mergeMap(response => [
          showGlobalMessage({
            text: 'Key generated! Head over to your Salesforce account to add your key and secret.',
            type: 'success',
          }),
          organisationApplicationsCreateSuccess(response),
        ]),
        catchError(errorHandlerWithGlobal({ callbacks: organisationApplicationsCreateFail })),
        takeUntil(action$.ofType(ORGANISATION_APPLICATIONS_CREATE.REQUEST)),
      ),
    ),
  );

export const organisationApplicationUpdateEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandlerWithGlobal, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(ORGANISATION_APPLICATIONS_UPDATE.REQUEST),
    debounceTime(300),
    mergeMap(({ payload }) =>
      apiService.put(`/auth/applications/${payload}/secret`, null, true).pipe(
        mergeMap(response => [
          showGlobalMessage({
            text: 'Key generated! Head over to your Salesforce account to add your key and secret.',
            type: 'success',
          }),
          organisationApplicationsUpdateSuccess(response),
        ]),
        catchError(errorHandlerWithGlobal({ callbacks: organisationApplicationsUpdateFail })),
        takeUntil(action$.ofType(ORGANISATION_APPLICATIONS_UPDATE.REQUEST)),
      ),
    ),
  );

export const organisationApplicationsEpics = [
  organisationApplicationEpic,
  organisationApplicationCreateEpic,
  organisationApplicationUpdateEpic,
];
