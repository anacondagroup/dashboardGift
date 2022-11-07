import { ofType } from 'redux-observable';
import { catchError, debounceTime, map, mergeMap, switchMap, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';
import { push } from 'connected-react-router';

import {
  INTEGRATIONS_MARKETO,
  INTEGRATIONS_MARKETO_CREATE,
  INTEGRATIONS_MARKETO_DISCONNECT,
  INTEGRATIONS_MARKETO_ITEM,
  INTEGRATIONS_MARKETO_UPDATE,
  INTEGRATIONS_MARKETO_ACTIVITIES_SYNC,
  INTEGRATIONS_MARKETO_ACTIVITIES_SYNC_STATUS,
  INTEGRATIONS_MARKETO_ACTIVITIES_AVAILABLE,
  INTEGRATIONS_MARKETO_ACTIVITIES_ENABLED,
  INTEGRATIONS_MARKETO_WEBHOOKS,
  INTEGRATIONS_MARKETO_ALYCE_GIFT_OBJECT,
  INTEGRATIONS_MARKETO_CUSTOM_OBJECTS_SYNC,
  INTEGRATIONS_MARKETO_SET_CUSTOM_OBJECT_STATE,
  INTEGRATIONS_MARKETO_CUSTOM_OBJECT_SYNC_BY_UUID,
} from './marketo.types';
import {
  organisationIntegrationCustomObjectSyncByUUIDRequest,
  organisationIntegrationMarketoCustomObjectSyncFail,
  organisationIntegrationMarketoCustomObjectSyncRequest,
  organisationIntegrationMarketoCustomObjectSyncSuccess,
  organisationIntegrationSetCustomObjectStateFail,
  organisationIntegrationSetCustomObjectStateSuccess,
  organisationMarketoIntegrationActivitiesAvailableFail,
  organisationMarketoIntegrationActivitiesAvailableSuccess,
  organisationMarketoIntegrationActivitiesEnabled,
  organisationMarketoIntegrationActivitiesEnabledFail,
  organisationMarketoIntegrationActivitiesEnabledSuccess,
  organisationMarketoIntegrationActivitiesSyncFail,
  organisationMarketoIntegrationActivitiesSyncStatus,
  organisationMarketoIntegrationActivitiesSyncStatusFail,
  organisationMarketoIntegrationActivitiesSyncStatusSuccess,
  organisationMarketoIntegrationActivitiesSyncSuccess,
  organisationMarketoIntegrationAlyceGiftObjectFail,
  organisationMarketoIntegrationAlyceGiftObjectSuccess,
  organisationMarketoIntegrationCreateFail,
  organisationMarketoIntegrationCreateSuccess,
  organisationMarketoIntegrationDisconnectFail,
  organisationMarketoIntegrationDisconnectSuccess,
  organisationMarketoIntegrationFail,
  organisationMarketoIntegrationsFail,
  organisationMarketoIntegrationsSuccess,
  organisationMarketoIntegrationSuccess,
  organisationMarketoIntegrationUpdateFail,
  organisationMarketoIntegrationUpdateSuccess,
  organisationMarketoIntegrationWebhooksFail,
  organisationMarketoIntegrationWebhooksSuccess,
} from './marketo.actions';

export const organisationMarketoIntegrationsEpic = (
  action$,
  state$,
  { marketoService, messagesService: { errorHandlerWithGlobal } },
) =>
  action$.pipe(
    ofType(INTEGRATIONS_MARKETO.REQUEST),
    debounceTime(300),
    mergeMap(() =>
      marketoService.get('/api/v1/marketing/marketo/integrations', null, true).pipe(
        map(response => organisationMarketoIntegrationsSuccess(response)),
        catchError(errorHandlerWithGlobal({ callbacks: organisationMarketoIntegrationsFail })),
        takeUntil(action$.ofType(INTEGRATIONS_MARKETO.REQUEST)),
      ),
    ),
  );

export const organisationMarketoIntegrationEpic = (
  action$,
  state$,
  { marketoService, messagesService: { errorHandlerWithGlobal } },
) =>
  action$.pipe(
    ofType(INTEGRATIONS_MARKETO_ITEM.REQUEST),
    debounceTime(300),
    mergeMap(({ payload }) =>
      marketoService.get(`/api/v1/marketing/marketo/integrations/${payload}`, null, true).pipe(
        map(response => organisationMarketoIntegrationSuccess(response)),
        catchError(error => {
          const errorObject = { ...error };
          let redirect = null;
          if (error.status && error.status === 404) {
            errorObject.message = 'Integration does not exist';
            redirect = () => push('/settings/organization/integrations');
          }
          return errorHandlerWithGlobal({ callbacks: organisationMarketoIntegrationFail, redirect })(errorObject);
        }),
        takeUntil(action$.ofType(INTEGRATIONS_MARKETO_ITEM.REQUEST)),
      ),
    ),
  );

const organisationMarketoIntegrationCreateEpic = (
  action$,
  state$,
  { marketoService, messagesService: { errorHandlerWithGlobal } },
) =>
  action$.pipe(
    ofType(INTEGRATIONS_MARKETO_CREATE.REQUEST),
    debounceTime(300),
    mergeMap(({ payload }) =>
      marketoService.post('/api/v1/marketing/marketo/integrations', { body: payload }, true).pipe(
        map(response => organisationMarketoIntegrationCreateSuccess(response)),
        catchError(errorHandlerWithGlobal({ callbacks: organisationMarketoIntegrationCreateFail })),
        takeUntil(action$.ofType(INTEGRATIONS_MARKETO_CREATE.REQUEST)),
      ),
    ),
  );

const organisationMarketoIntegrationUpdateEpic = (
  action$,
  state$,
  { marketoService, messagesService: { errorHandlerWithGlobal, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(INTEGRATIONS_MARKETO_UPDATE.REQUEST),
    debounceTime(300),
    mergeMap(({ payload }) =>
      marketoService.patch(`/api/v1/marketing/marketo/integrations/${payload.uuid}`, { body: payload.data }, true).pipe(
        switchMap(response => [
          organisationMarketoIntegrationUpdateSuccess(response),
          showGlobalMessage({ text: 'Update success', type: 'success' }),
        ]),
        catchError(error => {
          const redirect =
            error.status && error.status === 412 ? () => push('/settings/organization/integrations') : null;
          return errorHandlerWithGlobal({ callbacks: organisationMarketoIntegrationUpdateFail, redirect })(error);
        }),
        takeUntil(action$.ofType(INTEGRATIONS_MARKETO_UPDATE.REQUEST)),
      ),
    ),
  );

const organisationMarketoIntegrationDisconnectEpic = (
  action$,
  state$,
  { marketoService, messagesService: { errorHandlerWithGlobal } },
) =>
  action$.pipe(
    ofType(INTEGRATIONS_MARKETO_DISCONNECT.REQUEST),
    debounceTime(300),
    mergeMap(({ payload }) =>
      marketoService.delete(`/api/v1/marketing/marketo/integrations/${payload}`, null, true).pipe(
        map(response => organisationMarketoIntegrationDisconnectSuccess(response)),
        catchError(errorHandlerWithGlobal({ callbacks: organisationMarketoIntegrationDisconnectFail })),
        takeUntil(action$.ofType(INTEGRATIONS_MARKETO_DISCONNECT.REQUEST)),
      ),
    ),
  );

const organisationMarketoIntegrationSyncEpic = (
  action$,
  state$,
  { marketoService, messagesService: { errorHandlerWithGlobal } },
) =>
  action$.pipe(
    ofType(INTEGRATIONS_MARKETO_ACTIVITIES_SYNC.REQUEST),
    debounceTime(300),
    mergeMap(({ payload }) =>
      marketoService
        .post(
          `/api/v1/marketing/marketo/integrations/${payload.uuid}/activity-types/synchronizations?limit=1&orderBy=createdAt&direction=desc`,
          { body: { ...payload.activities } },
          true,
        )
        .pipe(
          mergeMap(response => [
            organisationMarketoIntegrationActivitiesSyncSuccess(response),
            organisationMarketoIntegrationActivitiesSyncStatus(payload.uuid, response.uuid),
          ]),
          catchError(error => {
            const redirect =
              error.status && error.status === 412 ? () => push('/settings/organization/integrations') : null;
            return errorHandlerWithGlobal({ organisationMarketoIntegrationActivitiesSyncFail, redirect })(error);
          }),
          takeUntil(action$.ofType(INTEGRATIONS_MARKETO_ACTIVITIES_SYNC.REQUEST)),
        ),
    ),
  );

const organisationMarketoIntegrationSyncStatusEpic = (
  action$,
  state$,
  { marketoService, messagesService: { errorHandlerWithGlobal, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(INTEGRATIONS_MARKETO_ACTIVITIES_SYNC_STATUS.REQUEST),
    debounceTime(1000),
    mergeMap(({ payload }) =>
      marketoService
        .get(
          `/api/v1/marketing/marketo/integrations/${payload.integrationUuid}/activity-types/synchronizations${
            payload.syncUuid ? `/${payload.syncUuid}` : '?limit=1&orderBy=createdAt&direction=desc'
          }`,
          null,
          true,
        )
        .pipe(
          switchMap(response => {
            const lastSync = Array.isArray(response) ? response[0] : response;
            if (lastSync && lastSync.status === 'pending') {
              return of(organisationMarketoIntegrationActivitiesSyncStatus(payload.integrationUuid, payload.syncUuid));
            }
            const errorActions = [];
            if (response.error) {
              errorActions.push(showGlobalMessage({ text: response.message, type: 'error' }));
              errorActions.push(organisationMarketoIntegrationActivitiesSyncStatusFail(response.errors));
            }
            return [
              ...errorActions,
              organisationMarketoIntegrationActivitiesEnabled(payload.integrationUuid),
              organisationMarketoIntegrationActivitiesSyncStatusSuccess(lastSync || {}),
            ];
          }),
          catchError(errorHandlerWithGlobal({ callbacks: organisationMarketoIntegrationActivitiesSyncStatusFail })),
          takeUntil(action$.ofType(INTEGRATIONS_MARKETO_ACTIVITIES_SYNC_STATUS.REQUEST)),
        ),
    ),
  );

const organisationMarketoIntegrationActivitiesEnabledEpic = (
  action$,
  state$,
  { marketoService, messagesService: { errorHandlerWithGlobal } },
) =>
  action$.pipe(
    ofType(INTEGRATIONS_MARKETO_ACTIVITIES_ENABLED.REQUEST),
    debounceTime(1000),
    mergeMap(({ payload }) =>
      marketoService.get(`/api/v1/marketing/marketo/integrations/${payload}/activity-types/enabled`, null, true).pipe(
        map(activities => organisationMarketoIntegrationActivitiesEnabledSuccess(activities)),
        catchError(errorHandlerWithGlobal({ callbacks: organisationMarketoIntegrationActivitiesEnabledFail })),
        takeUntil(action$.ofType(INTEGRATIONS_MARKETO_ACTIVITIES_ENABLED.REQUEST)),
      ),
    ),
  );

const organisationMarketoIntegrationActivitiesAvailableEpic = (
  action$,
  state$,
  { marketoService, messagesService: { errorHandlerWithGlobal } },
) =>
  action$.pipe(
    ofType(INTEGRATIONS_MARKETO_ACTIVITIES_AVAILABLE.REQUEST),
    debounceTime(1000),
    mergeMap(({ payload }) =>
      marketoService.get(`/api/v1/marketing/marketo/integrations/${payload}/activity-types/available`, null, true).pipe(
        map(activities => organisationMarketoIntegrationActivitiesAvailableSuccess(activities)),
        catchError(errorHandlerWithGlobal({ callbacks: organisationMarketoIntegrationActivitiesAvailableFail })),
        takeUntil(action$.ofType(INTEGRATIONS_MARKETO_ACTIVITIES_AVAILABLE.REQUEST)),
      ),
    ),
  );

const organisationMarketoIntegrationWebhookEpic = (
  action$,
  state$,
  { marketoService, messagesService: { errorHandlerWithGlobal } },
) =>
  action$.pipe(
    ofType(INTEGRATIONS_MARKETO_WEBHOOKS.REQUEST),
    debounceTime(1000),
    mergeMap(({ payload }) =>
      marketoService.get(`/api/v1/marketing/marketo/integrations/${payload}/webhooks`, null, true).pipe(
        map(webhooks => organisationMarketoIntegrationWebhooksSuccess(webhooks)),
        catchError(errorHandlerWithGlobal({ callbacks: organisationMarketoIntegrationWebhooksFail })),
        takeUntil(action$.ofType(INTEGRATIONS_MARKETO_WEBHOOKS.REQUEST)),
      ),
    ),
  );

const organisationMarketoIntegrationAlyceGiftObjectEpic = (
  action$,
  state$,
  { marketoService, messagesService: { errorHandlerWithGlobal } },
) =>
  action$.pipe(
    ofType(INTEGRATIONS_MARKETO_ALYCE_GIFT_OBJECT.REQUEST),
    debounceTime(1000),
    mergeMap(({ payload }) =>
      marketoService.get(`/api/v1/marketing/marketo/integrations/${payload}/object-types/alyce-gift`, null, true).pipe(
        mergeMap(resp =>
          of(
            organisationMarketoIntegrationAlyceGiftObjectSuccess(resp),
            organisationIntegrationMarketoCustomObjectSyncRequest(payload),
          ),
        ),
        catchError(errorHandlerWithGlobal({ callbacks: organisationMarketoIntegrationAlyceGiftObjectFail })),
      ),
    ),
  );

const organisationMarketoIntegrationCustomObjectsSyncEpic = (
  action$,
  state$,
  { marketoService, messagesService: { errorHandlerWithGlobal } },
) =>
  action$.pipe(
    ofType(INTEGRATIONS_MARKETO_CUSTOM_OBJECTS_SYNC.REQUEST),
    debounceTime(500),
    mergeMap(({ payload }) =>
      marketoService
        .get(`/api/v1/marketing/marketo/integrations/${payload}/object-types/synchronizations?limit=1`, null, true)
        .pipe(
          mergeMap(response => [
            organisationIntegrationMarketoCustomObjectSyncSuccess(response.length && response[0].errors),
          ]),
          catchError(error => {
            const redirect =
              error.status && error.status === 412 ? () => push('/settings/organization/integrations') : null;
            return errorHandlerWithGlobal(organisationIntegrationMarketoCustomObjectSyncFail, redirect)(error);
          }),
        ),
    ),
  );

const organisationMarketoIntegrationSetCustomObjectStateEpic = (
  action$,
  state$,
  { marketoService, messagesService: { errorHandlerWithGlobal, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(INTEGRATIONS_MARKETO_SET_CUSTOM_OBJECT_STATE.REQUEST),
    debounceTime(500),
    mergeMap(({ payload }) =>
      marketoService
        .post(
          `/api/v1/marketing/marketo/integrations/${payload.uuid}/object-types/synchronizations`,
          { body: { [payload.customObjectName]: { active: payload.newValue } } },
          true,
        )
        .pipe(
          mergeMap(response => {
            if (response.status === 'pending') {
              return [organisationIntegrationCustomObjectSyncByUUIDRequest({ ...payload, syncUuid: response.uuid })];
            }
            if (response.status === 'error') {
              return [organisationIntegrationMarketoCustomObjectSyncSuccess(response.errors)];
            }
            return [
              organisationIntegrationSetCustomObjectStateSuccess(payload),
              showGlobalMessage({
                type: 'success',
                text: payload.newValue
                  ? 'Success! Alyce is now synced with Marketo and can create custom objects'
                  : 'Alyce Gift custom objects will no longer be created in Marketo',
              }),
            ];
          }),
          catchError(errorHandlerWithGlobal({ callbacks: organisationIntegrationSetCustomObjectStateFail })),
        ),
    ),
  );

const organisationMarketoIntegrationSyncCustomObjectByUUIDEpic = (
  action$,
  state$,
  { marketoService, messagesService: { errorHandlerWithGlobal, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(INTEGRATIONS_MARKETO_CUSTOM_OBJECT_SYNC_BY_UUID.REQUEST),
    debounceTime(500),
    mergeMap(({ payload }) =>
      marketoService
        .get(
          `/api/v1/marketing/marketo/integrations/${payload.uuid}/object-types/synchronizations/${payload.syncUuid}`,
          null,
          true,
        )
        .pipe(
          mergeMap(response => {
            if (response.status === 'pending') {
              return [organisationIntegrationCustomObjectSyncByUUIDRequest(payload)];
            }

            if (response.status === 'error') {
              return [
                organisationIntegrationMarketoCustomObjectSyncSuccess(response.errors),
                showGlobalMessage({
                  type: 'error',
                  text: response.message,
                }),
              ];
            }
            return [
              organisationIntegrationSetCustomObjectStateSuccess(payload),
              showGlobalMessage({
                type: 'success',
                text: payload.newValue
                  ? 'Success! Alyce is now synced with Marketo and can create custom objects'
                  : 'Alyce Gift custom objects will no longer be created in Marketo',
              }),
            ];
          }),
          catchError(errorHandlerWithGlobal({ callbacks: organisationIntegrationSetCustomObjectStateFail })),
        ),
    ),
  );
export const organisationIntegrationsEpics = [
  organisationMarketoIntegrationEpic,
  organisationMarketoIntegrationsEpic,
  organisationMarketoIntegrationCreateEpic,
  organisationMarketoIntegrationUpdateEpic,
  organisationMarketoIntegrationDisconnectEpic,
  organisationMarketoIntegrationSyncEpic,
  organisationMarketoIntegrationSyncStatusEpic,
  organisationMarketoIntegrationActivitiesEnabledEpic,
  organisationMarketoIntegrationActivitiesAvailableEpic,
  organisationMarketoIntegrationWebhookEpic,
  organisationMarketoIntegrationCustomObjectsSyncEpic,
  organisationMarketoIntegrationAlyceGiftObjectEpic,
  organisationMarketoIntegrationSetCustomObjectStateEpic,
  organisationMarketoIntegrationSyncCustomObjectByUUIDEpic,
];
