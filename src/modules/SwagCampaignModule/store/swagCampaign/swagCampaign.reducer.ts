import { combineReducers } from 'redux';

import { TStepsState, steps } from './steps/steps.reducer';
import { TUiState, ui } from './ui/ui.reducer';

export type TSwagCampaignState = {
  steps: TStepsState;
  ui: TUiState;
};

export const swagCampaign = combineReducers<TSwagCampaignState>({
  steps,
  ui,
});
