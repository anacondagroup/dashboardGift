import { createAction } from 'redux-act';

import { ICampaign, IGift } from './giftTransfer.types';

const PREFIX = 'DASHBOARD/BREAKDOWNS/TRANSFER';

export const addGiftToTransferSelection = createAction<{ gift: IGift }>(`${PREFIX}/ADD_GIFT_TO_TRANSFER_SELECTION`);
export const deleteGiftFromTransferSelection = createAction<{ gift: IGift }>(
  `${PREFIX}/DELETE_GIFT_FROM_TRANSFER_SELECTION`,
);
export const deleteAllGiftsFromTransferSelection = createAction(`${PREFIX}/DELETE_ALL_GIFTS_FROM_TRANSFER_SELECTION`);
export const openGiftTransferSidebar = createAction(`${PREFIX}/OPEN_GIFT_TRANSFER_SIDEBAR`);
export const closeGiftTransferSidebar = createAction(`${PREFIX}/CLOSE_GIFT_TRANSFER_SIDEBAR`);

export const giftTransferringRequest = createAction<{ giftIds: number[]; targetCampaignId: number }>(
  `${PREFIX}/GIFT_TRANSFERRING_REQUEST`,
);
export const giftTransferringSuccess = createAction<{ transferringId: number }>(`${PREFIX}/GIFT_TRANSFERRING_SUCCESS`);
export const giftTransferringFail = createAction(`${PREFIX}/GIFT_TRANSFERRING_FAIL`);

export const giftTransferringProgressRequest = createAction<{ transferringId: number }>(
  `${PREFIX}/GIFT_TRANSFERRING_PROGRESS_REQUEST`,
);
export const giftTransferringProgressSuccess = createAction<{ completed: number }>(
  `${PREFIX}/GIFT_TRANSFERRING_PROGRESS_SUCCESS`,
);
export const giftTransferringProgressFail = createAction(`${PREFIX}/GIFT_TRANSFERRING_PROGRESS_FAIL`);
export const giftTransferringProgressFinish = createAction(`${PREFIX}/GIFT_TRANSFERRING_PROGRESS_FINISH`);

export const loadAllowedCampaignsRequest = createAction<{ teamId: number; campaignId?: number }>(
  `${PREFIX}/LOAD_ALLOWED_CAMPAIGNS_REQUEST`,
);
export const loadAllowedCampaignsSuccess = createAction<{ campaigns: ICampaign[] }>(
  `${PREFIX}/LOAD_ALLOWED_CAMPAIGNS_SUCCESS`,
);
export const loadAllowedCampaignsFail = createAction(`${PREFIX}/LOAD_ALLOWED_CAMPAIGNS_FAIL`);
