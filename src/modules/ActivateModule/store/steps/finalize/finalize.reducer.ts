import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import { clearActivateModuleState } from '../../activate.actions';

import { createCampaignFail, createCampaignRequest, createCampaignSuccess } from './finalize.actions';

export interface IFinalizeState {
  status: StateStatus;
}

export const initialFinalizeState: IFinalizeState = {
  status: StateStatus.Idle,
};

export const finalize = createReducer({}, initialFinalizeState);

finalize.on(clearActivateModuleState, () => ({
  ...initialFinalizeState,
}));

finalize.on(createCampaignRequest, state => ({
  ...state,
  status: StateStatus.Pending,
}));

finalize.on(createCampaignSuccess, state => ({
  ...state,
  status: StateStatus.Fulfilled,
}));

finalize.on(createCampaignFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));
