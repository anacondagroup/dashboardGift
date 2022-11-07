import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { IBillingContact } from '../billingGroupsContacts/billingGroupsContacts.types';

import {
  TCreateBillingGroupResponse,
  TBillingGroupUpdatePayload,
  TBillingGroupCreatePayload,
  TCreateBillingGroupForm,
} from './editBillingGroups.types';

const PREFIX = `EDIT_BILLING_GROUPS`;

export const createBillingGroupRequest = createAction<TBillingGroupCreatePayload>(
  `${PREFIX}/CREATE_BILLING_GROUP.REQUEST`,
);
export const updateBillingGroupRequest = createAction<TBillingGroupUpdatePayload>(
  `${PREFIX}/UPDATE_BILLING_GROUP.REQUEST`,
);
export const createBillingGroupSuccess = createAction<TCreateBillingGroupResponse>(
  `${PREFIX}/CREATE_BILLING_GROUP.SUCCESS`,
);
export const updateBillingGroupSuccess = createAction<TCreateBillingGroupResponse>(
  `${PREFIX}/UPDATE_BILLING_GROUP.SUCCESS`,
);
export const createBillingGroupFail = createAction<TErrors>(`${PREFIX}/CREATE_BILLING_GROUP.FAIL`);
export const updateBillingGroupFail = createAction<TErrors>(`${PREFIX}/UPDATE_BILLING_GROUP.FAIL`);

export const setCreateBillingGroupData = createAction<TCreateBillingGroupForm>(
  `${PREFIX}/CREATE_BILLING_GROUP.SET_DATA`,
);
export const setCreateBillingGroupName = createAction<string>(`${PREFIX}/CREATE_BILLING_GROUP.SET_GROUP_NAME`);
export const setCreateBillingGroupPoNumber = createAction<string>(`${PREFIX}/CREATE_BILLING_GROUP.SET_PO_NUMBER`);
export const setCreateBillingGroupPrimaryContact = createAction<IBillingContact>(
  `${PREFIX}/CREATE_BILLING_GROUP.SET_PRIMARY_CONTACT`,
);
export const setCreateBillingGroupSendInvoicesTo = createAction<IBillingContact[]>(
  `${PREFIX}/CREATE_BILLING_GROUP.SET_SEND_INVOICES_TO`,
);

export const setModalOpen = createAction<boolean>(`${PREFIX}/CREATE_BILLING_GROUP.MODAL_OPEN`);
export const clearCachedBillingGroup = createAction(`${PREFIX}/CACHED_BILLING_GROUP.CLEAR`);
