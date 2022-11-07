import { RootStateOrAny } from 'react-redux';
import { push, replace } from 'connected-react-router';
import { Dispatch } from 'redux';

import { ActivateBuilderStep, ActivateCampaignRoutes } from '../../../routePaths';

import { getNextStep, getPrevStep, getActivateCampaignId } from './activeStep.selectors';

export const goToNextStep = () => (dispatch: Dispatch, getState: () => RootStateOrAny): void => {
  const state = getState();

  dispatch(push(ActivateCampaignRoutes.buildBuilderUrl(getActivateCampaignId(state), getNextStep(state))));
};
export const goToPrevStep = () => (dispatch: Dispatch, getState: () => RootStateOrAny): void => {
  const state = getState();

  dispatch(push(ActivateCampaignRoutes.buildBuilderUrl(getActivateCampaignId(state), getPrevStep(state))));
};

export const setActiveStep = (
  nextStep: ActivateBuilderStep,
  { replace: isReplace = false }: { replace?: boolean } = {},
) => (dispatch: Dispatch, getState: () => RootStateOrAny): void => {
  const state = getState();
  const action = isReplace ? replace : push;

  dispatch(action(ActivateCampaignRoutes.buildBuilderUrl(getActivateCampaignId(state), nextStep)));
};
