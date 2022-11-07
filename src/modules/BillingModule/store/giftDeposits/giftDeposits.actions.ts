import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { IGiftResponse, TGiftDepositsCreatePayload } from './giftDeposits.types';

const prefix = `GIFT_DEPOSITS`;

export const setGiftDepositIsOpen = createAction<boolean>(`${prefix}/SET_GIFT_DEPOSITS_MODAL`);

export const addGiftDeposit = createAction<TGiftDepositsCreatePayload>(`${prefix}/ADD_DEPOSIT_REQUEST`);
export const addGiftDepositSuccess = createAction<IGiftResponse>(`${prefix}/ADD_DEPOSIT_SUCCESS`);
export const addGiftDepositFail = createAction<TErrors>(`${prefix}/ADD_DEPOSIT_FAIL`);
