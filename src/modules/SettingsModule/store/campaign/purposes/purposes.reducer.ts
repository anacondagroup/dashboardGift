import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import { TNumberOfRecipientsOption, TPurposeOption } from './purposes.types';
import { loadPurposesFail, loadPurposesRequest, loadPurposesSuccess } from './purposes.actions';

export interface IPurposesState {
  purposes: TPurposeOption[];
  numberOfRecipients: TNumberOfRecipientsOption[];
  status: StateStatus;
}

export const initialPurposesState: IPurposesState = {
  purposes: [],
  numberOfRecipients: [],
  status: StateStatus.Idle,
};

export const purposes = createReducer({}, initialPurposesState)
  .on(loadPurposesRequest, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(loadPurposesSuccess, (state, payload) => ({
    ...state,
    status: StateStatus.Fulfilled,
    purposes: payload.campaignPurposes,
    numberOfRecipients: payload.numberOfRecipients,
  }))
  .on(loadPurposesFail, state => ({
    ...state,
    status: StateStatus.Rejected,
  }));
