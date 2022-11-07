import React, { useCallback, useEffect, memo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import validationSchema, {
  IMessageFormValues,
  messagingFormDefaultValues,
} from '../../../store/steps/messaging/messagingForm.schemas';
import { useActivate } from '../../../hooks/useActivate';
import { useMessaging } from '../../../hooks/useMessaging';
import MessagingForm from '../../MessagingStep/MessagingForm';
import BrandingSection from '../../MessagingStep/BrandingSection';
import ActivateTabsFooter from '../Tabs/ActivateTabsFooter/ActivateTabsFooter';
import TabTitle from '../../TabTitle';

const resolver = yupResolver(validationSchema);

const MessagingTab = (): JSX.Element => {
  const { campaignId } = useActivate();

  const methods = useForm<IMessageFormValues>({
    mode: 'all',
    defaultValues: messagingFormDefaultValues,
    resolver,
    shouldUnregister: true,
  });
  const {
    handleSubmit,
    formState: { isDirty, isValid },
    reset,
  } = methods;

  const { data, isLoading, saveStep } = useMessaging(campaignId);
  const isDisabled = !isValid || isLoading || !isDirty;

  const onSubmit = useCallback(
    (formValues: IMessageFormValues) => {
      saveStep(formValues);
    },
    [saveStep],
  );

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [reset, data]);

  return (
    <>
      <TabTitle mb={2}>Messaging Details</TabTitle>
      <FormProvider {...methods}>
        <MessagingForm />
        <BrandingSection />
      </FormProvider>
      <ActivateTabsFooter
        isLoading={isLoading}
        disabled={isDisabled}
        displayWarningMessage={isDirty}
        onSaveButtonClick={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default memo(MessagingTab);
