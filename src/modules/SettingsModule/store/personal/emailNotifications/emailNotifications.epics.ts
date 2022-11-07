import { Epic } from 'redux-observable';
import { catchError, map, switchMap, withLatestFrom, mergeMap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';
import { handleError, handlers, MessageType } from '@alycecom/services';

import {
  loadEmailNotificationsSettingsRequest,
  loadEmailNotificationsSettingsSuccess,
  loadEmailNotificationsSettingsFail,
  updateEmailNotificationsSettingsRequest,
  updateEmailNotificationsSettingsSuccess,
  updateEmailNotificationsSettingsFail,
  loadActiveIntegrationsSuccess,
  loadActiveIntegrationsRequest,
  loadActiveIntegrationsFail,
} from './emailNotifications.actions';
import {
  TEmailNotificationsSettingsBody,
  TEmailNotificationsSettingsResponse,
  IActiveIntegrationsResponse,
} from './emailNotifications.types';
import { selectEmailNotificationsSettingsData } from './emailNotificatons.selectors';

export const loadActiveIntegrationsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadActiveIntegrationsRequest),
    switchMap(() =>
      apiService.get('/enterprise/dashboard/settings/integration/active').pipe(
        map((response: IActiveIntegrationsResponse) => loadActiveIntegrationsSuccess({ active: !!response.service })),
        catchError(handleError(handlers.handleAnyError(loadActiveIntegrationsFail))),
      ),
    ),
  );

export const loadAssistSettingsEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(loadEmailNotificationsSettingsRequest),
    switchMap(() =>
      apiService.get(`/api/v1/users/settings/notifications`, null, true).pipe(
        map((response: TEmailNotificationsSettingsResponse) => loadEmailNotificationsSettingsSuccess(response)),
        catchError(
          handleError(
            handlers.handleAnyError(
              loadEmailNotificationsSettingsFail,
              showGlobalMessage({ type: MessageType.Error, text: 'Something went wrong, please try again later' }),
            ),
          ),
        ),
      ),
    ),
  );

export const updateAssistSettingsEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(updateEmailNotificationsSettingsRequest),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const body: TEmailNotificationsSettingsBody = selectEmailNotificationsSettingsData(state);
      return apiService.patch(`/api/v1/users/settings/notifications`, { body }, true).pipe(
        mergeMap(() => [
          updateEmailNotificationsSettingsSuccess(),
          showGlobalMessage({
            type: MessageType.Success,
            text: 'Alyce Assist email settings have been updated',
          }),
        ]),
        catchError(
          handleError(
            handlers.handleAnyError(
              updateEmailNotificationsSettingsFail,
              showGlobalMessage({
                type: MessageType.Error,
                text: 'Email notifications settings have not been updated',
              }),
            ),
          ),
        ),
      );
    }),
  );

export const emailNotificationsEpics = [loadActiveIntegrationsEpic, loadAssistSettingsEpic, updateAssistSettingsEpic];
