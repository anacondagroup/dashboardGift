import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import { clearActivateModuleState } from '../../../activate.actions';

import {
  saveHubSpotSourceTypeFail,
  saveHubSpotSourceTypeRequest,
  saveHubSpotSourceTypeSuccess,
} from './hubspot.actions';

export interface IHubSpotState {
  status: StateStatus;
}

export const initialHubSpotState: IHubSpotState = {
  status: StateStatus.Idle,
};

export const hubspot = createReducer({}, initialHubSpotState);

hubspot.on(clearActivateModuleState, () => ({
  ...initialHubSpotState,
}));

hubspot.on(saveHubSpotSourceTypeRequest, state => ({
  ...state,
  status: StateStatus.Pending,
}));
hubspot.on(saveHubSpotSourceTypeSuccess, state => ({
  ...state,
  status: StateStatus.Fulfilled,
}));
hubspot.on(saveHubSpotSourceTypeFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));
