import { createReducer } from 'redux-act';

import {
  addGiftToTransferSelection,
  closeGiftTransferSidebar,
  deleteAllGiftsFromTransferSelection,
  deleteGiftFromTransferSelection,
  giftTransferringFail,
  giftTransferringProgressFinish,
  giftTransferringProgressSuccess,
  giftTransferringSuccess,
  loadAllowedCampaignsFail,
  loadAllowedCampaignsRequest,
  loadAllowedCampaignsSuccess,
  openGiftTransferSidebar,
} from './giftTransfer.actions';
import { ICampaign, IGift } from './giftTransfer.types';

export interface IGiftTransferState {
  selectedGifts: IGift[];
  isSidebarOpen: boolean;
  transferringId: number | null;
  transferringProgress: number;
  allowedCampaigns: ICampaign[];
  isLoading: boolean;
}

const initialGiftTransferState: IGiftTransferState = {
  selectedGifts: [],
  isSidebarOpen: false,
  transferringId: null,
  transferringProgress: 0,
  allowedCampaigns: [],
  isLoading: false,
};

export default createReducer({}, initialGiftTransferState)
  .on(addGiftToTransferSelection, (state, { gift }) => ({
    ...state,
    selectedGifts: [gift, ...state.selectedGifts],
  }))
  .on(deleteGiftFromTransferSelection, (state, { gift }) => ({
    ...state,
    selectedGifts: state.selectedGifts.filter(({ id }) => id !== gift.id),
  }))
  .on(deleteAllGiftsFromTransferSelection, () => ({
    ...initialGiftTransferState,
  }))

  .on(openGiftTransferSidebar, state => ({
    ...state,
    isSidebarOpen: true,
  }))
  .on(closeGiftTransferSidebar, state => ({
    ...state,
    isSidebarOpen: false,
  }))

  .on(giftTransferringSuccess, (state, { transferringId }) => ({
    ...state,
    transferringId,
  }))
  .on(giftTransferringFail, () => ({
    ...initialGiftTransferState,
  }))

  .on(giftTransferringProgressSuccess, (state, { completed }) => ({
    ...state,
    transferringProgress: completed,
  }))
  .on(giftTransferringProgressFinish, () => ({
    ...initialGiftTransferState,
  }))

  .on(loadAllowedCampaignsRequest, state => ({
    ...state,
    isLoading: true,
  }))
  .on(loadAllowedCampaignsSuccess, (state, { campaigns }) => ({
    ...state,
    isLoading: false,
    allowedCampaigns: campaigns,
  }))
  .on(loadAllowedCampaignsFail, state => ({
    ...state,
    isLoading: false,
  }));
// .on(giftExpireRequest, state => ({
//   ...state,
//   isLoading: true,
// }))
// .on(giftExpireSuccess, state => ({
//   ...state,
//   isLoading: false,
// }))
// .on(giftExpireFail, state => ({
//   ...state,
//   isLoading: false,
// }))
// .on(giftUnExpireRequest, state => ({
//   ...state,
//   isLoading: true,
// }))
// .on(giftUnExpireSuccess, state => ({
//   ...state,
//   isLoading: false,
// }))
// .on(giftUnExpireFail, state => ({
//   ...state,
//   isLoading: false,
// }))
