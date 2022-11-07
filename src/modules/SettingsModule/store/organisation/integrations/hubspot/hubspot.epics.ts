import { Epic, ofType } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { handleError, handlers, IResponse } from '@alycecom/services';

import { TIntegrationStatus } from '../../../../components/OrganisationSettingsModule/Integrations/InHouseIntegrations/models/IntegrationsModels';

import {
  organisationHubspotIntegrationStatusCheckRequest,
  organisationHubspotIntegrationStatusCheckFail,
  organisationHubspotIntegrationStatusCheckSuccess,
} from './hubspot.actions';

export const organisationHubspotIntegrationCheckStatusEpic: Epic = (action$, state$, { apiGateway }) =>
  action$.pipe(
    ofType(organisationHubspotIntegrationStatusCheckRequest),
    switchMap(() =>
      apiGateway.get('/marketing/hubspot/integrations/status', null, true).pipe(
        map(({ data }: IResponse<{ status: TIntegrationStatus }>) =>
          organisationHubspotIntegrationStatusCheckSuccess(data.status),
        ),
        catchError(handleError(handlers.handleAnyError(organisationHubspotIntegrationStatusCheckFail))),
      ),
    ),
  );

export const hubspotEpics = [organisationHubspotIntegrationCheckStatusEpic];
