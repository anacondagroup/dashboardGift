import { RootStateOrAny } from 'react-redux';
import { push, replace } from 'connected-react-router';
import { Dispatch } from 'redux';
import { Features } from '@alycecom/modules';

import { ProspectingBuilderStep, ProspectingCampaignRoutes } from '../../../../routePaths';

import {
  getNextStep,
  getNextStepUsingBudgets,
  getPrevStep,
  getPrevStepUsingBudgets,
  getProspectingCampaignId,
} from './activeStep.selectors';

const hasBudgetFlagsEnabled = (state: RootStateOrAny): boolean => {
  const hasBudgetSetup = Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_SETUP)(state);
  const hasBudgetLimit = Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_LIMIT)(state);
  return hasBudgetSetup && hasBudgetLimit;
};

export const goToNextStep = () => (dispatch: Dispatch, getState: () => RootStateOrAny): void => {
  const state = getState();

  const nextStepHelper = hasBudgetFlagsEnabled(state) ? getNextStepUsingBudgets(state) : getNextStep(state);

  dispatch(push(ProspectingCampaignRoutes.buildBuilderUrl(getProspectingCampaignId(state), nextStepHelper)));
};

export const goToPrevStep = () => (dispatch: Dispatch, getState: () => RootStateOrAny): void => {
  const state = getState();

  const prevStepHelper = hasBudgetFlagsEnabled(state) ? getPrevStepUsingBudgets(state) : getPrevStep(state);

  dispatch(push(ProspectingCampaignRoutes.buildBuilderUrl(getProspectingCampaignId(state), prevStepHelper)));
};

export const setActiveStep = (
  nextStep: ProspectingBuilderStep,
  { replace: isReplace = false }: { replace?: boolean } = {},
) => (dispatch: Dispatch, getState: () => RootStateOrAny): void => {
  const state = getState();
  const action = isReplace ? replace : push;

  dispatch(action(ProspectingCampaignRoutes.buildBuilderUrl(getProspectingCampaignId(state), nextStep)));
};
