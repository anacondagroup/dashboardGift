import * as R from 'ramda';
import { createSelector } from 'reselect';

import { getOrganisationState } from '../organisation.selectors';
import { Integrations } from '../../../components/OrganisationSettingsModule/Integrations/InHouseIntegrations/models/IntegrationsModels';

export const getApplicationsState = R.compose(R.prop('applications'), getOrganisationState);

export const getApplications = R.compose(R.prop('applications'), getApplicationsState);

export const getIsLoading = R.compose(R.prop('isLoading'), getApplicationsState);

export const getErrors = R.compose(R.prop('errors'), getApplicationsState);

export const getSfApplication = createSelector(
  getApplications,
  apps => apps.find(app => app.type === Integrations.Salesforce) || null,
);
