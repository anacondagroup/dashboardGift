import { pipe, prop } from 'ramda';

import { getOrganisationState } from '../../organisation.selectors';

export const getOrganisationIntegrations = pipe(getOrganisationState, prop('integrations'));

export const getOrganisationEloquaIntegration = pipe(getOrganisationIntegrations, prop('eloqua'));

export const getOrganisationEloquaIntegrationRequestStatus = pipe(getOrganisationEloquaIntegration, prop('state'));

export const getOrganisationEloquaIntegrationUuid = pipe(getOrganisationEloquaIntegration, prop('uuid'));
