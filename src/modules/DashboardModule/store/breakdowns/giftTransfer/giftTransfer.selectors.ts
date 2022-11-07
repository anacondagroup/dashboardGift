import * as R from 'ramda';

import { IRootState } from '../../../../../store/root.types';

import { IGiftTransferState } from './giftTransfer.reducer';

const getGiftTransferState = (state: IRootState): IGiftTransferState => state.dashboard.breakdowns.giftTransfer;

export const getGiftsFromTransferSelection = R.pipe(getGiftTransferState, state => state.selectedGifts);

export const getGiftsCountFromTransferSelection = R.pipe(getGiftTransferState, state => state.selectedGifts.length);

export const getGiftTransferSidebarState = R.pipe(getGiftTransferState, state => state.isSidebarOpen);

export const getGiftTransferId = R.pipe(getGiftTransferState, state => state.transferringId);

export const getGiftTransferringProgress = R.pipe(getGiftTransferState, state => state.transferringProgress);

export const getAllowedCampaigns = R.pipe(getGiftTransferState, state => state.allowedCampaigns);

export const getIsLoading = R.pipe(getGiftTransferState, state => state.isLoading);
