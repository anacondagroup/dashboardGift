import { createAction } from 'redux-act';

import { TIntegrationStatus } from '../../../../components/OrganisationSettingsModule/Integrations/InHouseIntegrations/models/IntegrationsModels';

const PREFIX = 'INTEGRATIONS_HUBSPOT_STATUS';

export const organisationHubspotIntegrationStatusCheckRequest = createAction(`${PREFIX}_REQUEST`);
export const organisationHubspotIntegrationStatusCheckSuccess = createAction<TIntegrationStatus>(`${PREFIX}_SUCCESS`);
export const organisationHubspotIntegrationStatusCheckFail = createAction(`${PREFIX}_FAIL`);
