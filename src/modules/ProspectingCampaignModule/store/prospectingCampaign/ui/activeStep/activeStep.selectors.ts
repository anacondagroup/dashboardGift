import { createSelector } from 'reselect';
import { RootStateOrAny } from 'react-redux';

import { ProspectingCampaignRoutes } from '../../../../routePaths';

import { STEPS_ORDER, STEPS_ORDER_USING_BUDGET } from './activeStep.constants';

export const getActiveStep = createSelector(
  (state: RootStateOrAny): string => state?.router?.location?.pathname ?? '',
  pathname => {
    const params = ProspectingCampaignRoutes.matchBuilderPath(pathname);

    return params?.step ?? null;
  },
);

export const getProspectingCampaignId = createSelector(
  (state: RootStateOrAny): string => state?.router?.location?.pathname,
  pathname => Number(ProspectingCampaignRoutes.matchBasePath(pathname)?.campaignId) ?? undefined,
);

export const getNextStep = createSelector(
  getActiveStep,
  step => STEPS_ORDER[Math.min((step ? STEPS_ORDER.indexOf(step) : 0) + 1, STEPS_ORDER.length - 1)],
);

export const getNextStepUsingBudgets = createSelector(
  getActiveStep,
  step =>
    STEPS_ORDER_USING_BUDGET[Math.min((step ? STEPS_ORDER.indexOf(step) : 0) + 1, STEPS_ORDER_USING_BUDGET.length - 1)],
);

export const getPrevStep = createSelector(
  getActiveStep,
  step => STEPS_ORDER[Math.max(0, (step ? STEPS_ORDER.indexOf(step) : 0) - 1)],
);

export const getPrevStepUsingBudgets = createSelector(
  getActiveStep,
  step => STEPS_ORDER_USING_BUDGET[Math.max(0, (step ? STEPS_ORDER_USING_BUDGET.indexOf(step) : 0) - 1)],
);
