import React, { useCallback, useEffect } from 'react';
import { Button, Icon } from '@alycecom/ui';
import { useModalState } from '@alycecom/hooks';
import { Box, Collapse } from '@mui/material';
import { Control, UseFormResetField, useFormState, UseFormTrigger, useWatch } from 'react-hook-form';
import { CampaignSettings } from '@alycecom/modules';

import {
  GiftingStepFields,
  MarketplaceDataFields,
  TProspectingGiftingForm,
} from '../../../../../store/prospectingCampaign/steps/gifting/gifting.types';
import { useTrackProspectingCampaignEvent } from '../../../../../hooks/useTrackProspecting';
import { useProspecting } from '../../../../../hooks';
import { marketplaceValueToData } from '../../../../../store/prospectingCampaign/steps/gifting/gifting.helpers';
import { TProspectingGiftMarketplaceData } from '../../../../../store/prospectingCampaign/prospectingCampaign.types';

import { useGiftingMarketplacePersist } from './hooks/useGiftingMarketplacePersist';
import MarketplaceSidebar from './MarketplaceSidebar';
import SettingsPreview from './SettingsPreview';

export interface IConfigureMarketplaceControllerProps {
  control: Control<TProspectingGiftingForm>;
  trigger: UseFormTrigger<TProspectingGiftingForm>;
  resetField: UseFormResetField<TProspectingGiftingForm>;
}

export const getIsMarketplaceValid = async (trigger: UseFormTrigger<TProspectingGiftingForm>): Promise<boolean> => {
  const result = await Promise.all(
    Object.values(MarketplaceDataFields).map(field =>
      trigger(`${GiftingStepFields.MarketplaceData}.${field}` as const),
    ),
  );

  return result.every(Boolean);
};

const ConfigureMarketplaceController = ({
  control,
  trigger,
  resetField,
}: IConfigureMarketplaceControllerProps): JSX.Element => {
  const { isOpen, handleOpen, handleClose } = useModalState();

  const { campaignId } = useProspecting();
  const { save, reset } = useGiftingMarketplacePersist({ resetField });
  const { errors } = useFormState({ control });
  const trackMarketplaceOpenEvent = useTrackProspectingCampaignEvent(
    'Prospecting Campaign Builder/Editor - Marketplace opened',
  );
  const trackMarketplaceSaveEvent = useTrackProspectingCampaignEvent<TProspectingGiftMarketplaceData>(
    'Prospecting Campaign Builder/Editor - Save Marketplace Settings clicked',
  );

  const marketplaceData = useWatch({ control, name: GiftingStepFields.MarketplaceData });
  const {
    [MarketplaceDataFields.MinPrice]: minPrice,
    [MarketplaceDataFields.MaxPrice]: maxPrice,
    [MarketplaceDataFields.GiftCardPrice]: giftCardPrice,
    [MarketplaceDataFields.DonationPrice]: donationPrice,
  } = marketplaceData || {};
  const isPreviewAvailable =
    ((typeof minPrice === 'number' && typeof maxPrice === 'number') ||
      typeof giftCardPrice === 'number' ||
      typeof donationPrice === 'number') &&
    !isOpen;
  const hasMarketplaceErrors = GiftingStepFields.MarketplaceData in errors;

  const handleOpenMarketplace = useCallback(() => {
    handleOpen();
    trackMarketplaceOpenEvent(campaignId);
  }, [handleOpen, trackMarketplaceOpenEvent, campaignId]);

  useEffect(() => {
    if (hasMarketplaceErrors) {
      handleOpenMarketplace();
    }
  }, [errors, hasMarketplaceErrors, handleOpenMarketplace]);

  const handleSave = useCallback(async () => {
    const isMarketplaceValid = await getIsMarketplaceValid(trigger);
    if (isMarketplaceValid) {
      handleClose();
      save(marketplaceData);
      const data = marketplaceValueToData(marketplaceData);
      if (data) {
        trackMarketplaceSaveEvent(campaignId, data);
      }
    }
  }, [save, marketplaceData, handleClose, trigger, trackMarketplaceSaveEvent, campaignId]);

  const handleCancel = useCallback(() => {
    handleClose();
    reset();
  }, [handleClose, reset]);

  return (
    <>
      <Box>
        <CampaignSettings.StyledFormControl>
          <Box mb={2}>
            {!isPreviewAvailable && (
              <CampaignSettings.StyledFormLabel>
                Specify the Gift Marketplace Settings*
              </CampaignSettings.StyledFormLabel>
            )}
            {isPreviewAvailable && (
              <CampaignSettings.StyledFormLabel error={hasMarketplaceErrors}>
                Gift Marketplace
              </CampaignSettings.StyledFormLabel>
            )}
          </Box>
          <Collapse in={isPreviewAvailable} mountOnEnter unmountOnExit>
            <SettingsPreview control={control} mb={2.5} />
          </Collapse>
          <Box>
            <Button onClick={handleOpenMarketplace} borderColor="divider" endIcon={<Icon icon="gift" />}>
              Configure Marketplace
            </Button>
          </Box>
        </CampaignSettings.StyledFormControl>
      </Box>
      <MarketplaceSidebar
        open={isOpen}
        control={control}
        trigger={trigger}
        onClose={handleCancel}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </>
  );
};

export default ConfigureMarketplaceController;
