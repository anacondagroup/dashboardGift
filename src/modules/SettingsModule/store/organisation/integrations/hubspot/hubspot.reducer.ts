import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import { TIntegrationStatus } from '../../../../components/OrganisationSettingsModule/Integrations/InHouseIntegrations/models/IntegrationsModels';

import {
  organisationHubspotIntegrationStatusCheckRequest,
  organisationHubspotIntegrationStatusCheckFail,
  organisationHubspotIntegrationStatusCheckSuccess,
} from './hubspot.actions';

export interface IHubspotState {
  state: StateStatus;
  status: TIntegrationStatus;
  errors: string[];
}
const initialState: IHubspotState = {
  state: StateStatus.Idle,
  status: null,
  errors: [],
};

export const hubspot = createReducer({}, initialState)
  .on(organisationHubspotIntegrationStatusCheckRequest, state => ({
    ...state,
    state: StateStatus.Pending,
  }))
  .on(organisationHubspotIntegrationStatusCheckSuccess, (state, payload) => ({
    ...state,
    state: StateStatus.Fulfilled,
    status: payload,
  }))
  .on(organisationHubspotIntegrationStatusCheckFail, state => ({
    ...state,
    state: StateStatus.Rejected,
    status: null,
  }));
