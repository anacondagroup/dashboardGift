import React, { memo, useCallback, useState } from 'react';
import { Control, useController, useWatch } from 'react-hook-form';
import { Box, FormHelperText } from '@mui/material';
import { SFormControl, SFormLabel } from '@alycecom/modules';

import { TSwagDefaultGift } from '../../../../store/swagCampaign/swagCampaign.types';
import {
  CustomMarketplaceDataFields,
  DefaultGiftDataFields,
  GiftingStepFields,
  MarketplaceDataFields,
  TSwagCampaignGiftingForm,
} from '../../../../store/swagCampaign/steps/gifting/gifting.types';

import LeadingGift from './fields/LeadingGift';
import MarketplaceSidebar from './fields/MarketplaceSidebar';
import CustomMarketplaceSidebar from './fields/CustomMarketplaceSidebar';

export interface IConfigureLeadingGiftControllerProps {
  control: Control<TSwagCampaignGiftingForm>;
  isConfigureMarketplaceActive: boolean;
}

const ConfigureLeadingGiftController = ({
  control,
  isConfigureMarketplaceActive,
}: IConfigureLeadingGiftControllerProps): JSX.Element => {
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState<boolean>(false);

  const {
    field: { value, onChange },
  } = useController({
    control,
    name: `${GiftingStepFields.DefaultGiftData}.${DefaultGiftDataFields.DefaultGift}` as const,
  });

  const handleSelectGift = useCallback((data: TSwagDefaultGift) => onChange(data), [onChange]);

  const handleRemoveGift = useCallback(() => onChange(null), [onChange]);

  const minPrice = useWatch({
    control,
    name: `${GiftingStepFields.ExchangeMarketplaceSettings}.${MarketplaceDataFields.MinBudgetAmount}` as const,
  });
  const maxPrice = useWatch({
    control,
    name: `${GiftingStepFields.ExchangeMarketplaceSettings}.${MarketplaceDataFields.MaxBudgetAmount}` as const,
  });
  const donationPrice = useWatch({
    control,
    name: `${GiftingStepFields.ExchangeMarketplaceSettings}.${MarketplaceDataFields.DonationMaxBudget}` as const,
  });
  const giftCardPrice = useWatch({
    control,
    name: `${GiftingStepFields.ExchangeMarketplaceSettings}.${MarketplaceDataFields.GiftCardMaxBudget}` as const,
  });
  const customMarketplaceId = useWatch({
    control,
    name: `${GiftingStepFields.CustomMarketPlaceData}.${CustomMarketplaceDataFields.Id}` as const,
  });
  const hasPhysicalBudget = typeof minPrice === 'number' && typeof maxPrice === 'number';
  const hasGiftCardPrice = typeof giftCardPrice === 'number';
  const hasDonationPrice = typeof donationPrice === 'number';
  const hasCustomMarketplace = typeof customMarketplaceId === 'number' && customMarketplaceId > 0;

  const isLeadingGiftDisabled =
    (isConfigureMarketplaceActive && !hasPhysicalBudget && !hasGiftCardPrice && !hasDonationPrice) ||
    (!isConfigureMarketplaceActive && !hasCustomMarketplace);

  return (
    <Box>
      <SFormControl>
        <Box mb={1}>
          <SFormLabel>Leading Gift</SFormLabel>
          {isLeadingGiftDisabled && (
            <Box mt={2} color="error.main">
              You must configure your marketplace above before selecting any default gifts.
            </Box>
          )}
        </Box>
        <Box display="flex" flexDirection="column">
          <Box color={!value?.productId ? 'error.main' : 'grey.main'} mb={2} minWidth={178}>
            {!value?.productId && (
              <FormHelperText error>You must select a default gift for this campaign.</FormHelperText>
            )}
          </Box>
          <LeadingGift
            value={value ?? null}
            onOpenMarketplace={() => setIsMarketplaceOpen(true)}
            onRemove={handleRemoveGift}
            disabled={isLeadingGiftDisabled}
          />
        </Box>
        {hasCustomMarketplace ? (
          <CustomMarketplaceSidebar
            isOpen={isMarketplaceOpen}
            onClose={() => setIsMarketplaceOpen(false)}
            onSelect={handleSelectGift}
            customMarketplaceId={customMarketplaceId || 0}
          />
        ) : (
          <MarketplaceSidebar
            isOpen={isMarketplaceOpen}
            onClose={() => setIsMarketplaceOpen(false)}
            onSelect={handleSelectGift}
            control={control}
          />
        )}
      </SFormControl>
    </Box>
  );
};

export default memo(ConfigureLeadingGiftController);
