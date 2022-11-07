import { yupResolver } from '@hookform/resolvers/yup';
import { object, number, ref } from 'yup';

import { GiftDepositsFormFields, IGiftDepositsFormValues } from './giftDeposits.types';

export const GIFT_DEPOSITS_ERRORS = {
  [GiftDepositsFormFields.GiftDepositAmount]: {
    required: 'Gift deposit is required',
    min: 'Gift deposit must be greater than $10 USD',
  },
  [GiftDepositsFormFields.ConfirmDepositAmount]: {
    required: 'Confirm deposit is required',
    min: 'Confirm deposit must be equal to gift deposit',
  },
};

const giftDepositAmountSchema = number()
  .required(GIFT_DEPOSITS_ERRORS[GiftDepositsFormFields.GiftDepositAmount].required)
  .positive()
  .min(10, GIFT_DEPOSITS_ERRORS[GiftDepositsFormFields.GiftDepositAmount].min);

const confirmDepositAmountSchema = number()
  .required(GIFT_DEPOSITS_ERRORS[GiftDepositsFormFields.ConfirmDepositAmount].required)
  .positive()
  .min(ref('giftDepositAmount'), GIFT_DEPOSITS_ERRORS[GiftDepositsFormFields.ConfirmDepositAmount].min)
  .max(ref('giftDepositAmount'), GIFT_DEPOSITS_ERRORS[GiftDepositsFormFields.ConfirmDepositAmount].min);

export const giftDepositsFormSchema = object().shape({
  [GiftDepositsFormFields.GiftDepositAmount]: giftDepositAmountSchema,
  [GiftDepositsFormFields.ConfirmDepositAmount]: confirmDepositAmountSchema,
});

export const giftDepositsResolverSchema = yupResolver(giftDepositsFormSchema);
export const giftDepositsFormDefaultValues = giftDepositsFormSchema.getDefault() as IGiftDepositsFormValues;
