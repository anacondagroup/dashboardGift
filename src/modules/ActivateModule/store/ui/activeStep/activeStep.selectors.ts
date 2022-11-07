import { createSelector } from 'reselect';
import { RootStateOrAny } from 'react-redux';

import { ActivateCampaignRoutes } from '../../../routePaths';

import { STEPS_ORDER } from './activeStep.constants';

export const getActiveStep = createSelector(
  (state: RootStateOrAny): string => state?.router?.location?.pathname ?? '',
  pathname => {
    const params = ActivateCampaignRoutes.matchBuilderPath(pathname);

    return params?.step ?? null;
  },
);

export const getActivateCampaignId = createSelector(
  (state: RootStateOrAny): string => state?.router?.location?.pathname,
  pathname => Number(ActivateCampaignRoutes.matchBasePath(pathname)?.campaignId) ?? undefined,
);

export const getNextStep = createSelector(
  getActiveStep,
  step => STEPS_ORDER[Math.min((step ? STEPS_ORDER.indexOf(step) : 0) + 1, STEPS_ORDER.length - 1)],
);

export const getPrevStep = createSelector(
  getActiveStep,
  step => STEPS_ORDER[Math.max(0, (step ? STEPS_ORDER.indexOf(step) : 0) - 1)],
);
