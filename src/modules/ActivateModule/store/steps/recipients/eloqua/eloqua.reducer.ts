import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import { clearActivateModuleState } from '../../../activate.actions';

import { saveEloquaSourceTypeFail, saveEloquaSourceTypeRequest, saveEloquaSourceTypeSuccess } from './eloqua.actions';

export interface IEloquaState {
  status: StateStatus;
}

export const initialEloquaState: IEloquaState = {
  status: StateStatus.Idle,
};

export const eloqua = createReducer({}, initialEloquaState);

eloqua.on(clearActivateModuleState, () => ({
  ...initialEloquaState,
}));

eloqua.on(saveEloquaSourceTypeRequest, state => ({
  ...state,
  status: StateStatus.Pending,
}));
eloqua.on(saveEloquaSourceTypeSuccess, state => ({
  ...state,
  status: StateStatus.Fulfilled,
}));
eloqua.on(saveEloquaSourceTypeFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));
