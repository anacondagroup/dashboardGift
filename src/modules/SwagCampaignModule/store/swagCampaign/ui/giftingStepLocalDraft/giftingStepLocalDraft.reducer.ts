import { createReducer } from 'redux-act';

import { GiftingStepFields, TSwagCampaignGiftingForm } from '../../steps/gifting/gifting.types';

import {
  resetGiftingDraftDataById,
  saveGiftingDraftDataById,
  saveGiftingMarketplaceDataById,
} from './giftingStepLocalDraft.actions';

export type TGiftingStepLocalDraftState = {
  [draftId: number]: Partial<TSwagCampaignGiftingForm> | null;
};

export const initialState = {};

export const giftingStepLocalDraft = createReducer<TGiftingStepLocalDraftState>({}, initialState);

giftingStepLocalDraft.on(saveGiftingDraftDataById, (state, { id, ...data }) => ({
  ...state,
  [id]: data,
}));
giftingStepLocalDraft.on(resetGiftingDraftDataById, (state, id) => ({
  ...state,
  [id]: null,
}));
giftingStepLocalDraft.on(saveGiftingMarketplaceDataById, (state, { id, ...data }) => ({
  ...state,
  [id]: {
    ...(state[id] || {}),
    [GiftingStepFields.ExchangeMarketplaceSettings]: data,
  },
}));
