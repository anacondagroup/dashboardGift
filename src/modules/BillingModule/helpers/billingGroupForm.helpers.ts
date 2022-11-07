import { IBillingContact } from '../store/billingGroupsContacts/billingGroupsContacts.types';

export const getBillingGroupContactOptionLabel = (option: IBillingContact): string => {
  if (option.email) {
    return option.firstName || option.lastName
      ? `${option.firstName} ${option.lastName} (${option.email})`
      : option.email;
  }
  return '';
};

export const getBillingGroupContactOptionSelected = (option: IBillingContact, optionValue: IBillingContact): boolean =>
  option.email === optionValue?.email;
