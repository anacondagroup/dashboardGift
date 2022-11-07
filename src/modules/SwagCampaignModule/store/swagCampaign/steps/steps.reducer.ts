import { combineReducers } from 'redux';

import { TDetailsState, details } from './details';
import { TGiftingState, gifting } from './gifting';
import { TMessagingState, messaging } from './messaging';
import { TCodesState, codes } from './codes';
import { TFinalizeState, finalize } from './finalize';

export type TStepsState = {
  details: TDetailsState;
  gifting: TGiftingState;
  messaging: TMessagingState;
  codes: TCodesState;
  finalize: TFinalizeState;
};

export const steps = combineReducers<TStepsState>({
  details,
  gifting,
  messaging,
  codes,
  finalize,
});
