import * as R from 'ramda';

import { getOrganisationState } from '../../organisation.selectors';

export const getOrganisationIntegrations = R.compose(R.prop('integrations'), getOrganisationState);

export const getMarketoIntegrationState = R.compose(R.prop('marketo'), getOrganisationIntegrations);
export const getIsLoadingMarketo = R.compose(R.prop('isLoading'), getMarketoIntegrationState);
export const getErrors = R.compose(R.prop('errors'), getMarketoIntegrationState);
export const getSyncErrors = R.compose(R.prop('syncErrors'), getMarketoIntegrationState);
export const getMarketoIntegrations = R.compose(R.prop('integrations'), getMarketoIntegrationState);
export const getMarketoApiData = R.compose(R.prop('apiData'), getMarketoIntegrationState);
export const getMarketoStatus = R.compose(R.prop('status'), getMarketoApiData);
export const getMarketoWebhooks = R.compose(R.prop('webhooks'), getMarketoIntegrationState);
export const getMarketoAlyceGiftObject = R.compose(R.path(['customObjects', 'alyceGift']), getMarketoIntegrationState);
export const getMarketoAvailableActivities = R.compose(R.prop('availableActivities'), getMarketoIntegrationState);
export const getMarketoEnabledActivities = R.compose(R.prop('enabledActivities'), getMarketoIntegrationState);
export const getLastSyncAt = R.compose(R.prop('lastSyncAt'), getMarketoIntegrationState);
export const isSyncActive = R.compose(R.prop('isSyncActive'), getMarketoIntegrationState);
export const isSyncLoadingSelector = R.compose(R.prop('isSyncLoading'), getMarketoIntegrationState);
