import { createReducer } from 'redux-act';
import { createEntityAdapter } from '@alycecom/utils';

import { StateStatus } from '../../../../store/stateStatuses.types';

import { IBillingContact } from './billingGroupsContacts.types';
import {
  setContactList,
  addContactToList,
  getBillingContactListRequest,
  getBillingContactListSuccess,
  getBillingContactListFail,
} from './billingGroupsContacts.actions';

export const customBillingContactsAdapter = createEntityAdapter<IBillingContact>({
  getId: entity => entity.email,
});

export const initialState = customBillingContactsAdapter.getInitialState({
  loadingBillingContacts: StateStatus.Idle,
});

export type TBillingGroupsContactsState = typeof initialState;

export const billingGroupsContacts = createReducer({}, initialState);

billingGroupsContacts.on(getBillingContactListRequest, state => ({
  ...state,
  loadingBillingContacts: StateStatus.Pending,
}));
billingGroupsContacts.on(getBillingContactListSuccess, (state, payload) => ({
  ...state,
  ...customBillingContactsAdapter.setAll(payload.data, state),
  loadingBillingContacts: StateStatus.Fulfilled,
}));
billingGroupsContacts.on(getBillingContactListFail, state => ({
  ...state,
  loadingBillingContacts: StateStatus.Rejected,
}));

billingGroupsContacts.on(setContactList, (state, payload) => ({
  ...state,
  ...customBillingContactsAdapter.setAll(payload, state),
}));

billingGroupsContacts.on(addContactToList, (state, payload) => ({
  ...state,
  ...customBillingContactsAdapter.addOne(payload, state),
}));
