import { pipe } from 'ramda';
import { createSelector } from 'reselect';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../store/root.types';

const getBillingGroupsState = (state: IRootState) => state.billing.editBillingGroups;

export const getIsSaveInProgress = pipe(getBillingGroupsState, state => state.saveInProgress === StateStatus.Pending);

export const getBillingGroupData = pipe(getBillingGroupsState, state => state.billingGroupData);
export const getBillingGroupName = pipe(getBillingGroupsState, state => state.billingGroupData.name);
export const getBillingGroupPoNumber = pipe(getBillingGroupsState, state => state.billingGroupData.poNumber);
export const getBillingGroupPrimaryContact = pipe(
  getBillingGroupsState,
  state => state.billingGroupData.primaryBillingContact,
);
export const getBillingGroupSendInvoicesTo = pipe(
  getBillingGroupsState,
  state => state.billingGroupData.sendInvoicesTo,
);
export const getCachedBillingGroup = pipe(getBillingGroupsState, state => state.cachedBillingGroup);
export const getIsModalOpen = pipe(getBillingGroupsState, state => state.isModalOpen);

export const getBillingGroupDataAsFormValues = createSelector(getBillingGroupData, billingGroupData => ({
  name: billingGroupData.name,
  primaryBillingContact: billingGroupData.primaryBillingContact,
  sendInvoicesTo: billingGroupData.sendInvoicesTo,
  purchaseOrdenNumber: billingGroupData.poNumber,
}));
