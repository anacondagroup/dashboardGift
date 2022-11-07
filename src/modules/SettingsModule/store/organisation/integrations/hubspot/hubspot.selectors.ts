import { pipe, prop } from 'ramda';

import { getOrganisationState } from '../../organisation.selectors';

export const getOrganisationIntegrations = pipe(getOrganisationState, prop('integrations'));

export const getHubspotIntegration = pipe(getOrganisationIntegrations, prop('hubspot'));

export const getHubspotIntegrationStatus = pipe(getHubspotIntegration, prop('status'));

export const getHubspotIntegrationState = pipe(getHubspotIntegration, prop('state'));
