import { boolean, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { IRecipientActions, RecipientActions } from '../../index';

export interface IGiftForm {
  recipientActions: IRecipientActions;
}

export enum GiftFormFields {
  recipientActions = 'recipientActions',
}

export const GIFT_FORM_ERRORS = {
  recipientActions: {
    [RecipientActions.question]: {
      required: 'Question must be filled in',
      min: 'The gifter question must be at least 3 characters.',
      max: 'The question must be at most 255 characters',
    },
    [RecipientActions.affidavit]: {
      required: 'The terms to agree must be filled in',
      min: 'The gifter affidavit must be at least 3 characters.',
    },
  },
};

export const giftFormSchema = object().shape({
  [GiftFormFields.recipientActions]: object().shape({
    [RecipientActions.captureDate]: boolean().default(false),
    [RecipientActions.capturePhone]: boolean().default(false),
    [RecipientActions.captureEmail]: boolean().default(false),
    [RecipientActions.captureQuestion]: boolean().default(false),
    [RecipientActions.question]: string().when(RecipientActions.captureQuestion, {
      is: true,
      then: string()
        .default('')
        .nullable()
        .required(GIFT_FORM_ERRORS[GiftFormFields.recipientActions][RecipientActions.question].required)
        .trim()
        .min(3, GIFT_FORM_ERRORS[GiftFormFields.recipientActions][RecipientActions.question].min)
        .max(255, GIFT_FORM_ERRORS[GiftFormFields.recipientActions][RecipientActions.question].max),
      otherwise: string().nullable().default(null),
    }),
    [RecipientActions.captureAffidavit]: boolean().default(false),
    [RecipientActions.affidavit]: string().when(RecipientActions.captureAffidavit, {
      is: true,
      then: string()
        .default('')
        .nullable()
        .required(GIFT_FORM_ERRORS[GiftFormFields.recipientActions][RecipientActions.affidavit].required)
        .trim()
        .min(3, GIFT_FORM_ERRORS[GiftFormFields.recipientActions][RecipientActions.affidavit].min),
      otherwise: string().nullable().default(null),
    }),
  }),
});

export const giftFormResolver = yupResolver(giftFormSchema);
export const giftFormDefaultValues = giftFormSchema.getDefault() as IGiftForm;
