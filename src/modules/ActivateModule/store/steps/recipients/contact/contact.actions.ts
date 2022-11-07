import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { IContact } from '../contacts/contacts.types';

import { ISingleContactFormValues } from './contactForm.schemas';

const PREFIX = 'ACTIVATE_MODULE/STEPS/RECIPIENTS/CONTACT';

export const saveContactRequest = createAction<{ campaignId: number; contact: ISingleContactFormValues }>(
  `${PREFIX}/SAVE_REQUEST`,
);
export const saveContactSuccess = createAction<IContact>(`${PREFIX}/SAVE_SUCCESS`);
export const saveContactFail = createAction<TErrors>(`${PREFIX}/SAVE_FINISH`);

export const resetErrors = createAction(`${PREFIX}/RESET_ERRORS`);
