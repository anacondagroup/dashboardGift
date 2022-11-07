import { StateStatus } from '@alycecom/utils';
import { createReducer } from 'redux-act';

import { IEloquaIntegration } from './eloqua.types';
import {
  organisationEloquaIntegrationInfoCheckFail,
  organisationEloquaIntegrationInfoCheckRequest,
  organisationEloquaIntegrationInfoCheckSuccess,
} from './eloqua.actions';

export interface IEloquaState extends IEloquaIntegration {
  state: StateStatus;
}
const initialState: IEloquaState = {
  state: StateStatus.Idle,
  uuid: null,
  eloquaSiteId: null,
  eloquaSiteName: '',
  eloquaUserId: null,
  eloquaUserName: '',
};
export const eloqua = createReducer({}, initialState)
  .on(organisationEloquaIntegrationInfoCheckRequest, state => ({
    ...state,
    state: StateStatus.Pending,
  }))
  .on(organisationEloquaIntegrationInfoCheckSuccess, (state, payload) => ({
    ...state,
    ...payload,
    state: StateStatus.Fulfilled,
  }))
  .on(organisationEloquaIntegrationInfoCheckFail, state => ({
    ...state,
    state: StateStatus.Rejected,
  }));
