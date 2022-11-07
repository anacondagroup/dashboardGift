import React, { useCallback, useEffect, useMemo, useState, memo } from 'react';
import { Control, FieldError, useController, useWatch } from 'react-hook-form';
import { Box, Checkbox, FormControlLabel, FormHelperText, Link } from '@mui/material';
import { getOrdinal } from '@alycecom/utils';

import { TProspectingDefaultGift } from '../../../../store/prospectingCampaign/prospectingCampaign.types';
import { LabelNote, SFormControl, SFormLabel } from '../../../styled/Styled';
import {
  CustomMarketplaceDataFields,
  DefaultGiftsDataFields,
  GiftingStepFields,
  MarketplaceDataFields,
  TProspectingGiftingForm,
} from '../../../../store/prospectingCampaign/steps/gifting/gifting.types';
import { useTrackProspectingCampaignEvent } from '../../../../hooks/useTrackProspecting';
import { useProspecting } from '../../../../hooks';

import LeadingGift from './fields/LeadingGift';
import MarketplaceSidebar from './fields/MarketplaceSidebar';

export interface IConfigureLeadingGiftControllerProps {
  control: Control<TProspectingGiftingForm>;
}

const ConfigureLeadingGiftController = ({ control }: IConfigureLeadingGiftControllerProps): JSX.Element => {
  const { campaignId } = useProspecting();

  const [leadingGiftIdx, setLeadingGiftIdx] = useState<number | null>(null);

  const trackLeadingGiftSelectEvent = useTrackProspectingCampaignEvent<TProspectingDefaultGift>(
    'Prospecting Campaign Builder/Editor - Default Product selected',
  );
  const trackLeadingGiftRemoveEvent = useTrackProspectingCampaignEvent<TProspectingDefaultGift>(
    'Prospecting Campaign Builder/Editor - Default Product removed',
  );

  const resetLeadingGiftIdx = useCallback(() => {
    setLeadingGiftIdx(null);
  }, []);

  const {
    fieldState: { error },
    field: { value, onChange },
  } = useController({
    control,
    name: `${GiftingStepFields.DefaultGiftsData}.${DefaultGiftsDataFields.DefaultGifts}` as const,
  });
  const defaultGiftErrors = error as FieldError[] | undefined;
  const {
    field: { onChange: onOverrideChange, value: overrideValue },
  } = useController({
    control,
    name: `${GiftingStepFields.DefaultGiftsData}.${DefaultGiftsDataFields.Override}` as const,
  });
  const isOverrideDisabled = useMemo(() => !value?.some(defaultGift => defaultGift?.id), [value]);

  useEffect(() => {
    if (isOverrideDisabled) {
      onOverrideChange(true);
    }
  }, [onOverrideChange, isOverrideDisabled]);

  const handleSelectGift = useCallback(
    (data: TProspectingDefaultGift) => {
      if (typeof leadingGiftIdx === 'number') {
        const newValue = value ? [...value] : [];
        newValue[leadingGiftIdx] = data;

        onChange(newValue);
        trackLeadingGiftSelectEvent(campaignId, data);
      }
    },
    [value, onChange, leadingGiftIdx, trackLeadingGiftSelectEvent, campaignId],
  );

  const handleRemoveGift = (idx: number) => {
    const newValue = value ? [...value] : [];

    const deletedGift = newValue[idx];
    trackLeadingGiftRemoveEvent(campaignId, deletedGift);

    delete newValue[idx];

    onChange(newValue);
  };

  const minPrice = useWatch({
    control,
    name: `${GiftingStepFields.MarketplaceData}.${MarketplaceDataFields.MinPrice}` as const,
  });
  const maxPrice = useWatch({
    control,
    name: `${GiftingStepFields.MarketplaceData}.${MarketplaceDataFields.MaxPrice}` as const,
  });
  const donationPrice = useWatch({
    control,
    name: `${GiftingStepFields.MarketplaceData}.${MarketplaceDataFields.DonationPrice}` as const,
  });
  const giftCardPrice = useWatch({
    control,
    name: `${GiftingStepFields.MarketplaceData}.${MarketplaceDataFields.GiftCardPrice}` as const,
  });
  const customMarketplaceId = useWatch({
    control,
    name: `${GiftingStepFields.CustomMarketplaceData}.${CustomMarketplaceDataFields.MarketplaceId}` as const,
  });
  const hasPhysicalBudget = typeof minPrice === 'number' && typeof maxPrice === 'number';
  const hasGiftCardPrice = typeof giftCardPrice === 'number';
  const hasDonationPrice = typeof donationPrice === 'number';

  const isLeadingGiftDisabled = !hasPhysicalBudget && !hasGiftCardPrice && !hasDonationPrice && !customMarketplaceId;

  return (
    <Box>
      <SFormControl>
        <Box mb={1}>
          <SFormLabel>Select up to three Default Gifts</SFormLabel>
          <LabelNote mt={0.5} maxWidth={700}>
            These will be the default suggestions for senders during the gifting process. (Senders may choose to search
            for and send alternate gifts, however.) Need some guidance? Check out our{' '}
            <Link
              display="inline"
              href="https://www.alyce.com/state-of-gifting/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Annual State of Gifting Report
            </Link>
            !
          </LabelNote>
          {isLeadingGiftDisabled && (
            <Box mt={2} color="error.main">
              You must configure your marketplace above before selecting any default gifts.
            </Box>
          )}
        </Box>
        <Box display="flex" flexDirection="row" pt={4}>
          {Array.from({ length: 3 }, (_, idx) => {
            const err = ((defaultGiftErrors as unknown) as { id: FieldError }[])?.[idx]?.id?.message;
            return (
              <Box key={idx} display="flex" flexDirection="column" ml={idx === 0 ? 0 : 12}>
                <Box color={err ? 'error.main' : 'grey.main'} mb={2} minWidth={178}>
                  {`${getOrdinal(idx + 1)} gift`.toUpperCase()}
                  {err && <FormHelperText error>{err}</FormHelperText>}
                </Box>
                <LeadingGift
                  value={value?.[idx] ?? null}
                  onOpenMarketplace={() => setLeadingGiftIdx(idx)}
                  onRemove={() => handleRemoveGift(idx)}
                  disabled={isLeadingGiftDisabled}
                />
              </Box>
            );
          })}
        </Box>
        <Box mt={4}>
          <FormControlLabel
            disabled={isOverrideDisabled}
            control={
              <Checkbox
                color="primary"
                onChange={(event, isChecked) => {
                  onOverrideChange(isChecked);
                }}
                checked={overrideValue}
              />
            }
            label="Allow gift senders to choose alternate gifts from the Gift Marketplace above"
          />
        </Box>
        <MarketplaceSidebar
          isOpen={leadingGiftIdx !== null}
          onClose={resetLeadingGiftIdx}
          onSelect={handleSelectGift}
          control={control}
        />
      </SFormControl>
    </Box>
  );
};

export default memo(ConfigureLeadingGiftController);
