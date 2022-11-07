import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { TBillingGroupAddContactForm } from './billingGroupsContacts.types';

const firstName = string().default('').label('First Name').trim().min(3).max(255).required();
const lastName = string().default('').label('Last Name').trim().min(4).max(255).required();
const email = string().default('').label('Email').trim().email().required();

export const billingGroupAddContactSchema = object().shape({
  firstName,
  lastName,
  email,
});

export const billingGroupAddContactResolver = yupResolver(billingGroupAddContactSchema);
export const billingGroupAddContactDefaultValue = billingGroupAddContactSchema.getDefault() as TBillingGroupAddContactForm;
