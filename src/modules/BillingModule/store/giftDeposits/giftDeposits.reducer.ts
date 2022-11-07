import { createReducer } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { StateStatus } from '../../../../store/stateStatuses.types';

import {
  setGiftDepositIsOpen,
  addGiftDeposit,
  addGiftDepositSuccess,
  addGiftDepositFail,
} from './giftDeposits.actions';

export interface IGiftDepositsState {
  isSavingInProgress: boolean;
  isOpen: boolean;
  status: StateStatus;
  giftDepositAmount: number;
  confirmDepositAmount: number;
  billingGroup: string;
  purchaseOrderNumber: string;
  memoNote: string;
  errors: TErrors;
}

export const initialState: IGiftDepositsState = {
  isSavingInProgress: false,
  isOpen: false,
  status: StateStatus.Idle,
  giftDepositAmount: 0,
  confirmDepositAmount: 0,
  billingGroup: '',
  purchaseOrderNumber: '',
  memoNote: '',
  errors: {},
};

export const giftDeposits = createReducer<IGiftDepositsState>({}, initialState);

giftDeposits
  .on(setGiftDepositIsOpen, (state, payload) => ({
    ...state,
    isOpen: payload,
  }))
  .on(addGiftDeposit, state => ({
    ...state,
    isSavingInProgress: true,
  }))
  .on(addGiftDepositSuccess, state => ({
    ...state,
    isOpen: false,
    isSavingInProgress: false,
    status: StateStatus.Fulfilled,
  }))
  .on(addGiftDepositFail, (state, payload) => ({
    ...state,
    isSavingInProgress: false,
    status: StateStatus.Rejected,
    errors: payload,
  }));
