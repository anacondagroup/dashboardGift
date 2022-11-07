import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, FormProvider } from 'react-hook-form';

import { giftFormDefaultValues, giftFormResolver, IGiftForm } from '../../../store/steps/gift/giftForm.schemas';
import {
  getDefaultGift,
  getDonationSetting,
  getExchangeMarketplaceSettings,
  getFallbackGift,
  getGiftExchangeOptions,
  getIsExchangeMarketplaceSettingsValid,
  getIsLoading,
  getRecipientActions,
  getSelectedCustomMarketplaceId,
  updateGiftStepRequest,
} from '../../../store/steps/gift';
import GiftForm from '../../GiftStep/GiftForm';
import { useActivate } from '../../../hooks/useActivate';
import { loadGiftTypesRequest } from '../../../store/entities/giftTypes/giftTypes.actions';
import { loadGiftVendorsRequest } from '../../../store/entities/giftVendors/giftVendors.actions';
import { useTrackCampaignEditorSaveButtonClicked } from '../../../hooks/useTrackActivate';
import { IRecipientActions } from '../../../store';
import ActivateTabsFooter from '../Tabs/ActivateTabsFooter/ActivateTabsFooter';
import TabTitle from '../../TabTitle';
import { ActivateBuilderStep } from '../../../routePaths';

const GiftTab = (): JSX.Element => {
  const dispatch = useDispatch();
  const { campaignId } = useActivate();
  const trackCampaignEditorSaveButtonClicked = useTrackCampaignEditorSaveButtonClicked(ActivateBuilderStep.Gift);

  const formMethods = useForm<IGiftForm>({
    mode: 'all',
    defaultValues: giftFormDefaultValues,
    resolver: giftFormResolver,
    shouldUnregister: true,
  });
  const {
    formState: { isValid, isDirty },
    reset,
    handleSubmit,
  } = formMethods;

  const defaultGift = useSelector(getDefaultGift);
  const fallbackGift = useSelector(getFallbackGift);
  const giftExchangeOptions = useSelector(getGiftExchangeOptions);
  const exchangeMarketplaceSettings = useSelector(getExchangeMarketplaceSettings);
  const customMarketplaceId = useSelector(getSelectedCustomMarketplaceId);
  const recipientActions = useSelector(getRecipientActions);
  const donationSettings = useSelector(getDonationSetting);
  const isExchangeMarketplaceSettingsValid = useSelector(getIsExchangeMarketplaceSettingsValid);
  const isLoading = useSelector(getIsLoading);
  const canGoFurther = !isLoading && defaultGift && isExchangeMarketplaceSettingsValid && isValid;

  const trackDataUpdating = useCallback(
    (actions: IRecipientActions) => {
      const pageData = {
        defaultGift,
        fallbackGift,
        exchangeMarketplaceSettings,
        giftExchangeOptions,
        donationSettings,
        customMarketplace: { id: customMarketplaceId },
        recipientActions: actions,
      };
      trackCampaignEditorSaveButtonClicked(campaignId as number, pageData);
    },
    [
      campaignId,
      trackCampaignEditorSaveButtonClicked,
      defaultGift,
      exchangeMarketplaceSettings,
      giftExchangeOptions,
      customMarketplaceId,
      fallbackGift,
      donationSettings,
    ],
  );

  const onSubmit = useCallback(
    (formValues: IGiftForm) => {
      const isRecipientActionsDefined = !!recipientActions;
      if (isDirty || !isRecipientActionsDefined) {
        dispatch(updateGiftStepRequest(formValues));
        trackDataUpdating(formValues.recipientActions);
      }
    },
    [dispatch, isDirty, recipientActions, trackDataUpdating],
  );

  useEffect(() => {
    if (campaignId) {
      dispatch(loadGiftTypesRequest({ campaignId }));
      dispatch(loadGiftVendorsRequest({ campaignId }));
    }
  }, [dispatch, campaignId]);

  useEffect(() => {
    if (recipientActions) {
      reset({ recipientActions });
    }
  }, [reset, recipientActions]);

  return (
    <>
      <TabTitle maxWidth={580} mb={2}>
        Gift Details
      </TabTitle>
      <FormProvider {...formMethods}>
        <GiftForm />
      </FormProvider>
      <ActivateTabsFooter
        isLoading={isLoading}
        disabled={!canGoFurther}
        displayWarningMessage={isDirty}
        onSaveButtonClick={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default GiftTab;
