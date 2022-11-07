import { object, string, array } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { TCreateBillingGroupForm } from './editBillingGroups.types';

const name = string().default('').label('Group Name').trim().max(255).required();

const primaryBillingContact = object().label('Primary Billing Contact').nullable().default(null).required();

const sendInvoicesTo = array().nullable().label('(Optional) Secondary Billing Contacts').default([]);

const poNumber = string().label('(Optional) Add PO # for Group').default('').nullable();

export const billingGroupSchema = object().shape({
  name,
  primaryBillingContact,
  sendInvoicesTo,
  poNumber,
});

export const editBillingGroupResolver = yupResolver(billingGroupSchema);
export const editBillingGroupFormDefaultValue = billingGroupSchema.getDefault() as TCreateBillingGroupForm;
