import React, { useCallback, useEffect, memo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { CampaignSettings } from '@alycecom/modules';

import { useMessaging } from '../../hooks/useMessaging';
import validationSchema, {
  IMessageFormValues,
  messagingFormDefaultValues,
} from '../../store/steps/messaging/messagingForm.schemas';
import { useActivate } from '../../hooks/useActivate';
import { useBuilderSteps } from '../../hooks/useBuilderSteps';
import ActivateBuilderFooter from '../ActiateBuilderFooter/ActivateBuilderFooter';

import MessagingForm from './MessagingForm';

const resolver = yupResolver(validationSchema);

const MessagingStep = (): JSX.Element => {
  const { campaignId } = useActivate();
  const { goToNextStep, goToPrevStep } = useBuilderSteps();

  const methods = useForm<IMessageFormValues>({
    mode: 'all',
    defaultValues: messagingFormDefaultValues,
    resolver,
    shouldUnregister: true,
  });
  const {
    handleSubmit,
    formState: { isValid, isDirty },
    reset,
  } = methods;

  const { data, isLoading, saveStep } = useMessaging(campaignId);
  const isDisabled = isLoading || !isValid;

  const onSubmit = useCallback(
    (formValues: IMessageFormValues) => {
      if (!isDirty) {
        goToNextStep();
        return;
      }
      saveStep(formValues);
    },
    [isDirty, saveStep, goToNextStep],
  );

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [reset, data]);

  return (
    <Box maxWidth={792} pb={6} component="form" onSubmit={handleSubmit(onSubmit)}>
      <CampaignSettings.StyledSectionTitle mb={3}>Messaging Details</CampaignSettings.StyledSectionTitle>
      <FormProvider {...methods}>
        <MessagingForm />
      </FormProvider>
      <ActivateBuilderFooter isLoading={isLoading} disabled={isDisabled} wrap onClickBack={goToPrevStep} />
    </Box>
  );
};

export default memo(MessagingStep);
