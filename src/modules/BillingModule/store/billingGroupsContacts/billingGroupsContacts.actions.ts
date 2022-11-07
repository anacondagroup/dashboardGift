import { createAction } from 'redux-act';
import { TErrors, IListResponse } from '@alycecom/services';

import { IBillingContact, IBillingContactListPayload } from './billingGroupsContacts.types';

const PREFIX = `BILLING_GROUPS_CONTACTS`;

export const getBillingContactListRequest = createAction<IBillingContactListPayload>(
  `${PREFIX}/BILLING_CONTACT_LIST.REQUEST`,
);
export const getBillingContactListSuccess = createAction<IListResponse<IBillingContact>>(
  `${PREFIX}/BILLING_CONTACT_LIST.SUCCESS`,
);
export const getBillingContactListFail = createAction<TErrors>(`${PREFIX}/BILLING_CONTACT_LIST.FAIL`);
export const setContactList = createAction<IBillingContact[]>(`${PREFIX}/BILLING_CONTACT_LIST.SET`);
export const addContactToList = createAction<IBillingContact>(`${PREFIX}/BILLING_CONTACT_LIST.ADD`);
