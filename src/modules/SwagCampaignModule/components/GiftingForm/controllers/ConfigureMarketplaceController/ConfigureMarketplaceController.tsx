import React, { useCallback, useEffect } from 'react';
import { Button, Icon } from '@alycecom/ui';
import { useModalState } from '@alycecom/hooks';
import { Box, Collapse } from '@mui/material';
import { Control, UseFormResetField, UseFormTrigger, useController, useFormState, useWatch } from 'react-hook-form';
import { SFormControl, SFormLabel } from '@alycecom/modules';

import { MarketplaceOption } from '../../../../store/swagCampaign/steps/gifting/gifting.constants';
import {
  GiftingStepFields,
  MarketplaceDataFields,
  TSwagCampaignGiftingForm,
} from '../../../../store/swagCampaign/steps/gifting/gifting.types';

import { useGiftingMarketplacePersist } from './hooks/useGiftingMarketplacePersist';
import MarketplaceSidebar from './MarketplaceSidebar';
import SettingsPreview from './SettingsPreview';

export interface IConfigureMarketplaceControllerProps {
  control: Control<TSwagCampaignGiftingForm>;
  trigger: UseFormTrigger<TSwagCampaignGiftingForm>;
  resetField: UseFormResetField<TSwagCampaignGiftingForm>;
  toggleConfiguration: () => void;
}

export const getIsMarketplaceValid = async (trigger: UseFormTrigger<TSwagCampaignGiftingForm>): Promise<boolean> => {
  const result = await Promise.all(
    Object.values(MarketplaceDataFields).map(field =>
      trigger(`${GiftingStepFields.ExchangeMarketplaceSettings}.${field}` as const),
    ),
  );

  return result.every(Boolean);
};

const styles = {
  opaque: {
    color: 'grey.main',
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    p: 0,
  },
};

const ConfigureMarketplaceController = ({
  control,
  trigger,
  resetField,
  toggleConfiguration,
}: IConfigureMarketplaceControllerProps): JSX.Element => {
  const { isOpen, handleOpen, handleClose } = useModalState();

  const { save, reset, clean } = useGiftingMarketplacePersist({ resetField });
  const { errors } = useFormState({ control });

  const marketplaceData = useWatch({ control, name: GiftingStepFields.ExchangeMarketplaceSettings });
  const {
    [MarketplaceDataFields.MinBudgetAmount]: minBudgetAmount,
    [MarketplaceDataFields.MaxBudgetAmount]: maxBudgetAmount,
    [MarketplaceDataFields.GiftCardMaxBudget]: giftCardMaxBudget,
    [MarketplaceDataFields.DonationMaxBudget]: donationMaxBudget,
  } = marketplaceData;
  const isPreviewAvailable =
    ((typeof minBudgetAmount === 'number' && typeof maxBudgetAmount === 'number') ||
      typeof giftCardMaxBudget === 'number' ||
      typeof donationMaxBudget === 'number') &&
    !isOpen;
  const hasMarketplaceErrors = GiftingStepFields.ExchangeMarketplaceSettings in errors;

  const { field: marketplaceOptionField } = useController({ name: GiftingStepFields.OptionMarketplace, control });

  useEffect(() => {
    if (hasMarketplaceErrors) {
      handleOpen();
    }
  }, [errors, hasMarketplaceErrors, handleOpen]);

  const handleSave = useCallback(async () => {
    const isMarketplaceValid = await getIsMarketplaceValid(trigger);
    if (isMarketplaceValid) {
      handleClose();
      save(marketplaceData);
      marketplaceOptionField.onChange(MarketplaceOption.CampaignBudget);
    }
  }, [save, marketplaceData, marketplaceOptionField, handleClose, trigger]);

  const handleCancel = useCallback(() => {
    handleClose();
    reset();
  }, [handleClose, reset]);

  const toggleView = useCallback(() => {
    reset();
    clean();
    toggleConfiguration();
  }, [reset, clean, toggleConfiguration]);

  return (
    <Box mb={6.5}>
      <Box>
        <SFormControl>
          <Box mb={2}>
            {!isPreviewAvailable && <SFormLabel>Configure Marketplace for Gift(s)</SFormLabel>}
            {isPreviewAvailable && <SFormLabel error={hasMarketplaceErrors}>Gift Marketplace</SFormLabel>}
          </Box>
          <Collapse in={isPreviewAvailable} mountOnEnter unmountOnExit>
            <SettingsPreview control={control} mb={2.5} />
          </Collapse>
          <Box>
            <Button onClick={handleOpen} borderColor="divider" endIcon={<Icon icon="gift" />}>
              {isPreviewAvailable ? 'Edit ' : 'Build '}Marketplace
            </Button>
          </Box>
        </SFormControl>
      </Box>
      <MarketplaceSidebar
        open={isOpen}
        control={control}
        trigger={trigger}
        onClose={handleCancel}
        onCancel={handleCancel}
        onSave={handleSave}
      />
      <Box sx={styles.opaque} mt={1}>
        Or use a&nbsp;
        <Button variant="text" sx={styles.button} onClick={toggleView}>
          Custom Marketplace
        </Button>
      </Box>
    </Box>
  );
};

export default ConfigureMarketplaceController;
