import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { PersistedState } from 'redux-persist/es/types';

import { TStatusState, status } from './status/status.reducer';
import { TGiftingStepLocalDraftState, giftingStepLocalDraft } from './giftingStepLocalDraft';

type TClearUiState = {
  status: TStatusState;
  giftingStepLocalDraft: TGiftingStepLocalDraftState;
};

export type TUiState = TClearUiState & PersistedState;

const uiPersistConfig = {
  key: 'swagCampaign.ui',
  storage,
  whitelist: ['giftingStepLocalDraft'],
};

const uiState = combineReducers<TClearUiState>({
  status,
  giftingStepLocalDraft,
});

export const ui = persistReducer(uiPersistConfig, uiState);
