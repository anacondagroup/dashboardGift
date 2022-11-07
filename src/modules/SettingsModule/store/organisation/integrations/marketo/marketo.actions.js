import {
  INTEGRATIONS_MARKETO,
  INTEGRATIONS_MARKETO_ITEM,
  INTEGRATIONS_MARKETO_CREATE,
  INTEGRATIONS_MARKETO_UPDATE,
  INTEGRATIONS_MARKETO_DISCONNECT,
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

export const organisationMarketoIntegrationsRequest = () => ({
  type: INTEGRATIONS_MARKETO.REQUEST,
});

export const organisationMarketoIntegrationsSuccess = integrations => ({
  type: INTEGRATIONS_MARKETO.SUCCESS,
  payload: integrations,
});

export const organisationMarketoIntegrationsFail = errors => ({
  type: INTEGRATIONS_MARKETO.FAIL,
  payload: errors,
});

export const organisationMarketoIntegrationRequest = uuid => ({
  type: INTEGRATIONS_MARKETO_ITEM.REQUEST,
  payload: uuid,
});

export const organisationMarketoIntegrationSuccess = integration => ({
  type: INTEGRATIONS_MARKETO_ITEM.SUCCESS,
  payload: integration,
});

export const organisationMarketoIntegrationFail = errors => ({
  type: INTEGRATIONS_MARKETO_ITEM.FAIL,
  payload: errors,
});

export const organisationMarketoIntegrationCreate = integration => ({
  type: INTEGRATIONS_MARKETO_CREATE.REQUEST,
  payload: integration,
});

export const organisationMarketoIntegrationCreateSuccess = integration => ({
  type: INTEGRATIONS_MARKETO_CREATE.SUCCESS,
  payload: integration,
});

export const organisationMarketoIntegrationCreateFail = errors => ({
  type: INTEGRATIONS_MARKETO_CREATE.FAIL,
  payload: errors,
});

export const organisationMarketoIntegrationUpdate = (uuid, marketo) => ({
  type: INTEGRATIONS_MARKETO_UPDATE.REQUEST,
  payload: {
    uuid,
    data: marketo,
  },
});

export const organisationMarketoIntegrationUpdateSuccess = marketo => ({
  type: INTEGRATIONS_MARKETO_UPDATE.SUCCESS,
  payload: marketo,
});

export const organisationMarketoIntegrationUpdateFail = errors => ({
  type: INTEGRATIONS_MARKETO_UPDATE.FAIL,
  payload: errors,
});

export const organisationMarketoIntegrationDisconnect = uuid => ({
  type: INTEGRATIONS_MARKETO_DISCONNECT.REQUEST,
  payload: uuid,
});

export const organisationMarketoIntegrationDisconnectSuccess = marketo => ({
  type: INTEGRATIONS_MARKETO_DISCONNECT.SUCCESS,
  payload: marketo,
});

export const organisationMarketoIntegrationDisconnectFail = errors => ({
  type: INTEGRATIONS_MARKETO_DISCONNECT.FAIL,
  payload: errors,
});

export const organisationMarketoIntegrationActivitiesSync = (uuid, activities) => ({
  type: INTEGRATIONS_MARKETO_ACTIVITIES_SYNC.REQUEST,
  payload: {
    uuid,
    activities,
  },
});

export const organisationMarketoIntegrationActivitiesSyncSuccess = status => ({
  type: INTEGRATIONS_MARKETO_ACTIVITIES_SYNC.SUCCESS,
  payload: status,
});

export const organisationMarketoIntegrationActivitiesSyncFail = errors => ({
  type: INTEGRATIONS_MARKETO_ACTIVITIES_SYNC.FAIL,
  payload: errors,
});

export const organisationMarketoIntegrationActivitiesSyncStatus = (integrationUuid, syncUuid) => ({
  type: INTEGRATIONS_MARKETO_ACTIVITIES_SYNC_STATUS.REQUEST,
  payload: {
    integrationUuid,
    syncUuid,
  },
});

export const organisationMarketoIntegrationActivitiesSyncStatusSuccess = data => ({
  type: INTEGRATIONS_MARKETO_ACTIVITIES_SYNC_STATUS.SUCCESS,
  payload: data,
});

export const organisationMarketoIntegrationActivitiesSyncStatusFail = errors => ({
  type: INTEGRATIONS_MARKETO_ACTIVITIES_SYNC_STATUS.FAIL,
  payload: errors,
});

export const organisationMarketoIntegrationActivitiesAvailable = uuid => ({
  type: INTEGRATIONS_MARKETO_ACTIVITIES_AVAILABLE.REQUEST,
  payload: uuid,
});

export const organisationMarketoIntegrationActivitiesAvailableSuccess = activities => ({
  type: INTEGRATIONS_MARKETO_ACTIVITIES_AVAILABLE.SUCCESS,
  payload: activities,
});

export const organisationMarketoIntegrationActivitiesAvailableFail = errors => ({
  type: INTEGRATIONS_MARKETO_ACTIVITIES_AVAILABLE.FAIL,
  payload: errors,
});

export const organisationMarketoIntegrationActivitiesEnabled = uuid => ({
  type: INTEGRATIONS_MARKETO_ACTIVITIES_ENABLED.REQUEST,
  payload: uuid,
});

export const organisationMarketoIntegrationActivitiesEnabledSuccess = activities => ({
  type: INTEGRATIONS_MARKETO_ACTIVITIES_ENABLED.SUCCESS,
  payload: activities,
});

export const organisationMarketoIntegrationActivitiesEnabledFail = errors => ({
  type: INTEGRATIONS_MARKETO_ACTIVITIES_ENABLED.FAIL,
  payload: errors,
});

export const organisationMarketoIntegrationWebhooksRequest = payload => ({
  type: INTEGRATIONS_MARKETO_WEBHOOKS.REQUEST,
  payload,
});

export const organisationMarketoIntegrationWebhooksSuccess = payload => ({
  type: INTEGRATIONS_MARKETO_WEBHOOKS.SUCCESS,
  payload,
});

export const organisationMarketoIntegrationWebhooksFail = payload => ({
  type: INTEGRATIONS_MARKETO_WEBHOOKS.FAIL,
  payload,
});

export const organisationMarketoIntegrationAlyceGiftObjectRequest = payload => ({
  type: INTEGRATIONS_MARKETO_ALYCE_GIFT_OBJECT.REQUEST,
  payload,
});

export const organisationMarketoIntegrationAlyceGiftObjectSuccess = payload => ({
  type: INTEGRATIONS_MARKETO_ALYCE_GIFT_OBJECT.SUCCESS,
  payload,
});

export const organisationMarketoIntegrationAlyceGiftObjectFail = payload => ({
  type: INTEGRATIONS_MARKETO_ALYCE_GIFT_OBJECT.FAIL,
  payload,
});

export const organisationIntegrationMarketoCustomObjectSyncRequest = payload => ({
  type: INTEGRATIONS_MARKETO_CUSTOM_OBJECTS_SYNC.REQUEST,
  payload,
});

export const organisationIntegrationMarketoCustomObjectSyncSuccess = payload => ({
  type: INTEGRATIONS_MARKETO_CUSTOM_OBJECTS_SYNC.SUCCESS,
  payload,
});

export const organisationIntegrationMarketoCustomObjectSyncFail = payload => ({
  type: INTEGRATIONS_MARKETO_CUSTOM_OBJECTS_SYNC.FAIL,
  payload,
});

export const organisationIntegrationSetCustomObjectStateRequest = payload => ({
  type: INTEGRATIONS_MARKETO_SET_CUSTOM_OBJECT_STATE.REQUEST,
  payload,
});

export const organisationIntegrationSetCustomObjectStateSuccess = payload => ({
  type: INTEGRATIONS_MARKETO_SET_CUSTOM_OBJECT_STATE.SUCCESS,
  payload,
});

export const organisationIntegrationSetCustomObjectStateFail = payload => ({
  type: INTEGRATIONS_MARKETO_SET_CUSTOM_OBJECT_STATE.FAIL,
  payload,
});

export const organisationIntegrationCustomObjectSyncByUUIDRequest = payload => ({
  type: INTEGRATIONS_MARKETO_CUSTOM_OBJECT_SYNC_BY_UUID.REQUEST,
  payload,
});

export const organisationIntegrationCustomObjectSyncByUUIDFail = payload => ({
  type: INTEGRATIONS_MARKETO_CUSTOM_OBJECT_SYNC_BY_UUID.FAIL,
  payload,
});
