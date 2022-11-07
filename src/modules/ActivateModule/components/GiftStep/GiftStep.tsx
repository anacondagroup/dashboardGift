import React, { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { CampaignSettings } from '@alycecom/modules';

import {
  getDefaultGift,
  getIsLoading,
  getRecipientActions,
  updateGiftStepRequest,
  getIsExchangeMarketplaceSettingsValid,
  getGiftExchangeOptions,
  getExchangeMarketplaceSettings,
  getSelectedCustomMarketplaceId,
  getDonationSetting,
  getFallbackGift,
} from '../../store/steps/gift';
import { useActivate } from '../../hooks/useActivate';
import { loadGiftTypesRequest } from '../../store/entities/giftTypes/giftTypes.actions';
import { loadGiftVendorsRequest } from '../../store/entities/giftVendors/giftVendors.actions';
import { giftFormDefaultValues, giftFormResolver, IGiftForm } from '../../store/steps/gift/giftForm.schemas';
import { useTrackCampaignBuilderNextButtonClicked } from '../../hooks/useTrackActivate';
import { IRecipientActions } from '../../store';
import { getCountryIds } from '../../store/steps/details';
import { ActivateBuilderStep } from '../../routePaths';
import { useBuilderSteps } from '../../hooks/useBuilderSteps';
import ActivateBuilderFooter from '../ActiateBuilderFooter/ActivateBuilderFooter';

import GiftForm from './GiftForm';

const GiftStep = (): JSX.Element => {
  const dispatch = useDispatch();
  const { campaignId: draftId } = useActivate();
  const trackNextButtonClicked = useTrackCampaignBuilderNextButtonClicked(ActivateBuilderStep.Gift);
  const { goToNextStep, goToPrevStep } = useBuilderSteps();

  const formMethods = useForm<IGiftForm>({
    mode: 'all',
    defaultValues: giftFormDefaultValues,
    resolver: giftFormResolver,
    shouldUnregister: true,
  });
  const { formState, reset, handleSubmit } = formMethods;

  const { isValid, isDirty } = formState;

  const defaultGift = useSelector(getDefaultGift);
  const donationSettings = useSelector(getDonationSetting);
  const fallbackGift = useSelector(getFallbackGift);
  const giftExchangeOptions = useSelector(getGiftExchangeOptions);
  const exchangeMarketplaceSettings = useSelector(getExchangeMarketplaceSettings);
  const customMarketplaceId = useSelector(getSelectedCustomMarketplaceId);
  const recipientActions = useSelector(getRecipientActions);
  const isExchangeMarketplaceSettingsValid = useSelector(getIsExchangeMarketplaceSettingsValid);
  const isLoading = useSelector(getIsLoading);
  const countryIds = useSelector(getCountryIds);
  const canGoFurther =
    !isLoading &&
    defaultGift &&
    defaultGift.length === countryIds?.length &&
    isExchangeMarketplaceSettingsValid &&
    isValid;

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
      trackNextButtonClicked(draftId as number, pageData);
    },
    [
      draftId,
      trackNextButtonClicked,
      defaultGift,
      exchangeMarketplaceSettings,
      giftExchangeOptions,
      customMarketplaceId,
      donationSettings,
      fallbackGift,
    ],
  );

  const onSubmit = useCallback(
    (formValues: IGiftForm) => {
      const isRecipientActionsDefined = !!recipientActions;

      trackDataUpdating(formValues.recipientActions);

      if (isDirty || !isRecipientActionsDefined) {
        return dispatch(updateGiftStepRequest(formValues));
      }
      return goToNextStep();
    },
    [dispatch, goToNextStep, isDirty, recipientActions, trackDataUpdating],
  );

  useEffect(() => {
    if (draftId) {
      dispatch(loadGiftTypesRequest({ campaignId: draftId }));
      dispatch(loadGiftVendorsRequest({ campaignId: draftId }));
    }
  }, [dispatch, draftId]);

  useEffect(() => {
    if (recipientActions) {
      reset({ recipientActions });
    }
  }, [reset, recipientActions]);

  return (
    <>
      <CampaignSettings.StyledSectionTitle maxWidth={792}>Gift Details</CampaignSettings.StyledSectionTitle>
      <FormProvider {...formMethods}>
        <GiftForm />
      </FormProvider>
      <ActivateBuilderFooter
        isLoading={isLoading}
        disabled={!canGoFurther}
        wrap
        onClickBack={goToPrevStep}
        onClickNext={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default memo(GiftStep);
