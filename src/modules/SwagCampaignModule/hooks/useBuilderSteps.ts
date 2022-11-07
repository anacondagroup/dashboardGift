import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';

import { getActiveStep } from '../store/swagCampaign/ui/activeStep/activeStep.selectors';
import { SwagCampaignBuilderStep } from '../routePaths';
import { goToNextStep, goToPrevStep } from '../store/swagCampaign/ui/activeStep/activeStep.actions';

export const useActiveStep = (): SwagCampaignBuilderStep | null => useSelector(getActiveStep);

export type TUseBuilderStepsValue = {
  useActiveStep: typeof useActiveStep;
  goToNextStep: () => void;
  goToPrevStep: () => void;
};

export const useBuilderSteps = (): TUseBuilderStepsValue => {
  const dispatch = useDispatch();

  const handleGoToNextStep = useCallback(() => {
    dispatch(goToNextStep());
  }, [dispatch]);

  const handleGoToPrevStep = useCallback(() => {
    dispatch(goToPrevStep());
  }, [dispatch]);

  return useMemo(
    () => ({
      useActiveStep,
      goToNextStep: handleGoToNextStep,
      goToPrevStep: handleGoToPrevStep,
    }),
    [handleGoToNextStep, handleGoToPrevStep],
  );
};
