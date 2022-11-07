import { pipe, propEq } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../store/root.types';

import { customBillingContactsAdapter } from './billingGroupsContacts.reducer';

const getBillingGroupsState = (state: IRootState) => state.billing.billingGroupsContacts;

const selectors = customBillingContactsAdapter.getSelectors(getBillingGroupsState);

export const getContactList = selectors.getAll;

export const getIsLoadingBillingContacts = pipe(
  getBillingGroupsState,
  propEq('loadingBillingContacts', StateStatus.Pending),
);
