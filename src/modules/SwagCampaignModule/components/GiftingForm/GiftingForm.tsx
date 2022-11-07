import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { clone } from 'ramda';
import { Box } from '@mui/material';
import { useApplyManualFormErrorsEffect } from '@alycecom/hooks';
import { SectionTitleStyled } from '@alycecom/modules';

import { giftingFormDefaultValues, giftingFormResolver } from '../../store/swagCampaign/steps/gifting/gifting.schemas';
import { useTeamProductTypes } from '../../../MarketplaceModule/hooks/useTeamProductTypes';
import { getDetailsData } from '../../store/swagCampaign/steps/details/details.selectors';
import { getGiftingDataAsFormValues, getGiftingErrors } from '../../store/swagCampaign/steps/gifting/gifting.selectors';
import {
  GiftingStepFields,
  MarketplaceDataFields,
  TSwagCampaignGiftingForm,
} from '../../store/swagCampaign/steps/gifting/gifting.types';

import ConfigureMarketplaceController from './controllers/ConfigureMarketplaceController/ConfigureMarketplaceController';
import ConfigureLeadingGiftController from './controllers/ConfigureLeadingGiftController/ConfigureLeadingGiftController';
import ConfigureGiftActionsController from './controllers/ConfigureGiftActionsController/ConfigureGiftActionsController';
import SelectCustomMarketplaceController from './controllers/ConfigureCustomMarketplaceController/ConfigureCustomMarketplaceController';
import ConfigureRecipientActionsController from './controllers/ConfigureRecipientActionsController/ConfigureRecipientActionsController';

export interface IGiftingFormChildrenProps {
  isDirty: boolean;
}

export interface IGiftingFormProps {
  children: ReactNode | ((arg0: IGiftingFormChildrenProps) => ReactNode);
  onSubmit: (value: TSwagCampaignGiftingForm, isDirty: boolean) => void;
}

const GiftingForm = ({ children, onSubmit }: IGiftingFormProps): JSX.Element => {
  const { teamId, countryIds = [] } = useSelector(getDetailsData) || {};
  const giftingData = useSelector(getGiftingDataAsFormValues);
  const [isConfigureMarketplaceActive, setIsConfigureMarketplaceActive] = useState<boolean>(true);
  const errors = useSelector(getGiftingErrors);

  const { useAvailableByCountryIds } = useTeamProductTypes({ teamId });
  const {
    control,
    trigger,
    reset,
    resetField,
    handleSubmit,
    setError,
    formState: { isDirty },
  } = useForm<TSwagCampaignGiftingForm>({
    mode: 'all',
    resolver: giftingFormResolver,
    defaultValues: useMemo(() => clone(giftingFormDefaultValues), []),
    context: {
      permittedProductTypeIds: useAvailableByCountryIds(countryIds),
      isCampaignMarketplaceEnabled: isConfigureMarketplaceActive,
    },
  });

  const resetLeadingGift = useCallback(() => {
    const giftingFormData = clone(giftingData);
    reset({
      ...giftingFormData,
      [GiftingStepFields.ExchangeMarketplaceSettings]: {
        [MarketplaceDataFields.MinBudgetAmount]: null,
        [MarketplaceDataFields.MaxBudgetAmount]: null,
        [MarketplaceDataFields.GiftCardMaxBudget]: null,
        [MarketplaceDataFields.DonationMaxBudget]: null,
        [MarketplaceDataFields.RestrictedGiftTypeIds]: [],
        [MarketplaceDataFields.RestrictedBrandIds]: [],
        [MarketplaceDataFields.RestrictedMerchantIds]: [],
        [MarketplaceDataFields.IsPhysicalEnabled]: true,
        [MarketplaceDataFields.IsGiftCardEnabled]: false,
        [MarketplaceDataFields.IsDonationEnabled]: false,
      },
      [GiftingStepFields.CustomMarketPlaceData]: { id: null },
      [GiftingStepFields.DefaultGiftData]: { defaultGift: null },
    });
  }, [giftingData, reset]);

  const toggleConfigureMarketplace = useCallback(() => {
    setIsConfigureMarketplaceActive(!isConfigureMarketplaceActive);
    resetLeadingGift();
  }, [isConfigureMarketplaceActive, setIsConfigureMarketplaceActive, resetLeadingGift]);

  useEffect(() => {
    if (giftingData) {
      reset(clone(giftingData), { keepDefaultValues: false });
      if (giftingData.customMarketplaceData?.id) {
        setIsConfigureMarketplaceActive(false);
      }
    }
  }, [reset, giftingData]);

  useApplyManualFormErrorsEffect<TSwagCampaignGiftingForm>(setError, errors);

  const submitHandler = (form: TSwagCampaignGiftingForm) => {
    onSubmit(form, isDirty);
  };

  return (
    <Box component="form" display="flex" flexDirection="column" onSubmit={handleSubmit(submitHandler)}>
      <Box flex="1 1 auto" mb={20}>
        <Box mb={1.5}>
          <SectionTitleStyled>Gift Details</SectionTitleStyled>
        </Box>
        {isConfigureMarketplaceActive ? (
          <ConfigureMarketplaceController
            control={control}
            trigger={trigger}
            toggleConfiguration={toggleConfigureMarketplace}
            resetField={resetField}
          />
        ) : (
          <SelectCustomMarketplaceController
            resetField={resetField}
            toggleConfiguration={toggleConfigureMarketplace}
            control={control}
            teamId={teamId}
          />
        )}
        <Box mb={5}>
          <ConfigureLeadingGiftController
            control={control}
            isConfigureMarketplaceActive={isConfigureMarketplaceActive}
          />
        </Box>
        <ConfigureGiftActionsController control={control} />
        <Box mt={7} mb={3}>
          <SectionTitleStyled>Gift Redemption Required Actions</SectionTitleStyled>
        </Box>
        <ConfigureRecipientActionsController resetField={resetField} control={control} />
      </Box>
      {typeof children === 'function' ? children({ isDirty }) : children}
    </Box>
  );
};

export default GiftingForm;
