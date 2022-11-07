import { pipe } from 'ramda';
import { createSelector } from 'reselect';

import { IRootState } from '../../../../store/root.types';
import { StateStatus } from '../../../../store/stateStatuses.types';

import { IGiftDepositsState } from './giftDeposits.reducer';

const getGiftDepositsState = (state: IRootState): IGiftDepositsState => state.billing.giftDeposits;

export const getIsSaveInProgress = pipe(getGiftDepositsState, state => state.isSavingInProgress);

export const getIsGiftDepositPending = createSelector(
  getGiftDepositsState,
  state => state.status === StateStatus.Pending,
);

export const getGiftDepositsModalIsOpen = createSelector(getGiftDepositsState, state => state.isOpen);
