import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';

import { getActiveStep } from '../store/ui/activeStep/activeStep.selectors';
import { ActivateBuilderStep } from '../routePaths';
import { goToNextStep, goToPrevStep } from '../store/ui/activeStep/activeStep.actions';

export const useActiveStep = (): ActivateBuilderStep | null => useSelector(getActiveStep);

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
