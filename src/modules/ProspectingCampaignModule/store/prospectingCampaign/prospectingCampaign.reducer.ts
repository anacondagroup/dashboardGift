import { combineReducers } from 'redux';

import { TStepsState, steps } from './steps/steps.reducer';
import { TUiState, ui } from './ui/ui.reducer';

export type TProspectingCampaignState = {
  steps: TStepsState;
  ui: TUiState;
};

export const prospectingCampaign = combineReducers<TProspectingCampaignState>({
  steps,
  ui,
});
