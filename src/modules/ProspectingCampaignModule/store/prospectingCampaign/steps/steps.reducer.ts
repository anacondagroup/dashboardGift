import { combineReducers } from 'redux';

import { TDetailsState, details } from './details';
import { TGiftingState, gifting } from './gifting';
import { TMessagingState, messaging } from './messaging';
import { TGiftLimitsState, giftLimits } from './giftLimits';
import { TFinalizeState, finalize } from './finalize';

export type TStepsState = {
  details: TDetailsState;
  gifting: TGiftingState;
  messaging: TMessagingState;
  finalize: TFinalizeState;
  giftLimits: TGiftLimitsState;
};

export const steps = combineReducers<TStepsState>({
  details,
  gifting,
  messaging,
  giftLimits,
  finalize,
});
