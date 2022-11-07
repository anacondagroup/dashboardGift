import { ofType } from 'redux-observable';
import { catchError, debounceTime, map, mergeMap, switchMap, takeUntil } from 'rxjs/operators';

import {
  ORGANISATION_SETTINGS,
  ORGANISATION_SETTINGS_UPDATE_NAME,
  ORGANISATION_SETTINGS_UPDATE_LOGO,
  ORGANISATION_SETTINGS_REMOVE_LOGO,
} from './organisationGeneral.types';
import {
  organisationSettingsLoadFail,
  organisationSettingsLoadSuccess,
  organisationSettingsLogoUpdateSuccess,
  organisationSettingsUpdateNameFail,
  organisationSettingsUpdateNameSuccess,
} from './organisationGeneral.actions';

export const organisationSettingsEpic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(ORGANISATION_SETTINGS.REQUEST),
    debounceTime(300),
    mergeMap(() =>
      // true remove checking for success true
      apiService.get('/enterprise/dashboard/settings/organisations/general', null, true).pipe(
        map(response => organisationSettingsLoadSuccess(response.settings)),
        catchError(errorHandler({ callbacks: organisationSettingsLoadFail })),
        takeUntil(action$.ofType(ORGANISATION_SETTINGS.REQUEST)),
      ),
    ),
  );

export const organisationSettingsUpdateNameEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler } },
) =>
  action$.pipe(
    ofType(ORGANISATION_SETTINGS_UPDATE_NAME.REQUEST),
    debounceTime(300),
    mergeMap(({ payload }) =>
      // true remove checking for success true
      apiService
        .post('/enterprise/dashboard/settings/organisations/update/name', {
          body: { name: payload },
        })
        .pipe(
          map(() => organisationSettingsUpdateNameSuccess(payload)),
          catchError(errorHandler({ callbacks: organisationSettingsUpdateNameFail })),
          takeUntil(action$.ofType(ORGANISATION_SETTINGS_UPDATE_NAME.REQUEST)),
        ),
    ),
  );

export const organisationSettingsRemoveLogoEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(ORGANISATION_SETTINGS_REMOVE_LOGO.REQUEST),
    mergeMap(() =>
      apiService.get('/enterprise/dashboard/settings/organisations/remove/image').pipe(
        switchMap(response => [
          organisationSettingsLogoUpdateSuccess(response.image_url),
          showGlobalMessage({ text: 'Avatar removed', type: 'success' }),
        ]),
        catchError(errorHandler({ callbacks: organisationSettingsUpdateNameFail })),
        takeUntil(action$.ofType(ORGANISATION_SETTINGS_REMOVE_LOGO.REQUEST)),
      ),
    ),
  );

export const organisationSettingsUpdateLogoEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(ORGANISATION_SETTINGS_UPDATE_LOGO.REQUEST),
    mergeMap(({ payload }) => {
      const formData = new FormData();
      formData.append('image', payload, payload.name);
      return apiService.postFile('/enterprise/dashboard/settings/organisations/update/image', { body: formData }).pipe(
        switchMap(response => [
          organisationSettingsLogoUpdateSuccess(response.image_url),
          showGlobalMessage({ text: 'Changes saved', type: 'success' }),
        ]),
        catchError(
          errorHandler({
            callbacks: organisationSettingsUpdateNameFail,
            showErrorsAsGlobal: true,
          }),
        ),
        takeUntil(action$.ofType(ORGANISATION_SETTINGS_UPDATE_LOGO.REQUEST)),
      );
    }),
  );

export const organizationGeneralEpics = [
  organisationSettingsEpic,
  organisationSettingsUpdateNameEpic,
  organisationSettingsRemoveLogoEpic,
  organisationSettingsUpdateLogoEpic,
];
