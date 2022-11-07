import { createReducer } from 'redux-act';
import { TErrors } from '@alycecom/services';
import { StateStatus } from '@alycecom/utils';

import { clearActivateModuleState } from '../../../activate.actions';
import { IContact } from '../contacts/contacts.types';

import { saveContactFail, saveContactRequest, saveContactSuccess, resetErrors } from './contact.actions';

export interface IContactState {
  status: StateStatus;
  data?: IContact;
  errors: TErrors;
}

export const initialContactState: IContactState = {
  status: StateStatus.Idle,
  data: undefined,
  errors: {},
};

export const contact = createReducer({}, initialContactState);

contact.on(clearActivateModuleState, () => ({
  ...initialContactState,
}));

contact.on(saveContactRequest, state => ({
  ...state,
  status: StateStatus.Pending,
  errors: {},
}));
contact.on(saveContactSuccess, (state, payload) => ({
  ...state,
  status: StateStatus.Fulfilled,
  data: payload,
}));
contact.on(saveContactFail, (state, payload) => ({
  ...state,
  status: StateStatus.Rejected,
  errors: payload,
}));

contact.on(resetErrors, state => ({
  ...state,
  errors: {},
}));
