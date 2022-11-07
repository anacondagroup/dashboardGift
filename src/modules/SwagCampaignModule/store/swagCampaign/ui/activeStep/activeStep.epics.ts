import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { push, replace } from 'connected-react-router';

import { SwagCampaignBuilderStep, SwagCampaignRoutes } from '../../../../routePaths';
import { fetchSwagDraftById } from '../../swagCampaign.actions';

import { getActiveStep, getNextStep, getPrevStep, getSwagCampaignId } from './activeStep.selectors';
import { goToNextStep, goToPrevStep, setActiveStep } from './activeStep.actions';

const setActiveStepEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(setActiveStep),
    withLatestFrom(state$.pipe(map(getSwagCampaignId))),
    map(([{ payload: step, meta }, id]) => {
      const action = meta?.replace ? replace : push;
      return action(SwagCampaignRoutes.buildBuilderUrl(id, step));
    }),
  );

export const goToNextStepEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(goToNextStep),
    withLatestFrom(state$),
    map(([, state]) => push(SwagCampaignRoutes.buildBuilderUrl(getSwagCampaignId(state), getNextStep(state)))),
  );

export const goToPrevStepEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(goToPrevStep),
    withLatestFrom(state$),
    map(([, state]) => push(SwagCampaignRoutes.buildBuilderUrl(getSwagCampaignId(state), getPrevStep(state)))),
  );

export const setCurrentStepOnFetch: Epic = (action$, state$) =>
  action$.pipe(
    ofType(fetchSwagDraftById.fulfilled),
    withLatestFrom(state$),
    filter(([, state]) => !getActiveStep(state)),
    map(([{ payload }]) => {
      let currentStep = SwagCampaignBuilderStep.Gift;
      if (payload.data.gifting) {
        currentStep = SwagCampaignBuilderStep.Messaging;
      }
      if (payload.data.messaging) {
        currentStep = SwagCampaignBuilderStep.Codes;
      }
      if (payload.data.codes) {
        currentStep = SwagCampaignBuilderStep.Finalize;
      }

      return setActiveStep(currentStep, { replace: true });
    }),
  );

export default [setActiveStepEpic, goToNextStepEpic, goToPrevStepEpic, setCurrentStepOnFetch];
