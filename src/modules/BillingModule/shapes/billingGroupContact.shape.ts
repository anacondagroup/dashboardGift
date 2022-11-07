import { IBillingContact } from '../store/billingGroupsContacts/billingGroupsContacts.types';
import { TCreateBillingGroupForm } from '../store/editBillingGroups/editBillingGroups.types';

export const createEmptyBillingContact = (): IBillingContact => ({
  firstName: '',
  lastName: '',
  email: '',
});

export const createBillingContact = (
  firstName: string | null,
  lastName: string | null,
  email: string | null,
): IBillingContact => ({
  firstName: firstName || '',
  lastName: lastName || '',
  email: email || '',
});

export const createEmptyBillingGroupData = (): TCreateBillingGroupForm => ({
  name: '',
  primaryBillingContact: null,
  sendInvoicesTo: [],
  poNumber: '',
});
