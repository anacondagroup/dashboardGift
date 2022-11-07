import { createSelector } from 'reselect';

import { SwagCampaignRoutes } from '../../../../routePaths';
import { IRootState } from '../../../../../../store/root.types';

import { STEPS_ORDER } from './activeStep.constants';

export const getActiveStep = createSelector(
  (state: IRootState) => state?.router?.location?.pathname ?? '',
  pathname => {
    const params = SwagCampaignRoutes.matchBuilderPath(pathname);

    return params?.step ?? null;
  },
);

export const getSwagCampaignId = createSelector(
  (state: IRootState) => state?.router?.location?.pathname,
  pathname => Number(SwagCampaignRoutes.matchBasePath(pathname)?.campaignId) ?? undefined,
);

export const getNextStep = createSelector(
  getActiveStep,
  step => STEPS_ORDER[Math.min((step ? STEPS_ORDER.indexOf(step) : 0) + 1, STEPS_ORDER.length - 1)],
);

export const getPrevStep = createSelector(
  getActiveStep,
  step => STEPS_ORDER[Math.max(0, (step ? STEPS_ORDER.indexOf(step) : 0) - 1)],
);
