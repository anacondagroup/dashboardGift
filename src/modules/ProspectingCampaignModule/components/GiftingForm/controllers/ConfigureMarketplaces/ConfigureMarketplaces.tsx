import React, { useEffect, useMemo, useState } from 'react';
import { Control, UseFormResetField, UseFormTrigger, useWatch } from 'react-hook-form';
import { Box } from '@mui/material';
import { Button } from '@alycecom/ui';
import { useSelector } from 'react-redux';
import { clone } from 'ramda';

import {
  CustomMarketplaceDataFields,
  GiftingStepFields,
  TProspectingGiftingForm,
} from '../../../../store/prospectingCampaign/steps/gifting/gifting.types';
import { getGiftingData } from '../../../../store/prospectingCampaign/steps/gifting/gifting.selectors';
import { giftingFormDefaultValues } from '../../../../store/prospectingCampaign/steps/gifting/gifting.schemas';

import ConfigureMarketplaceController from './ConfigureMarketplaceController/ConfigureMarketplaceController';
import CustomMarketplaceController from './CustomMarketplaceController/CustomMarketplaceController';
import { styles } from './ConfigureMarketplaces.styles';
import { useGiftingMarketplacePersist } from './ConfigureMarketplaceController/hooks/useGiftingMarketplacePersist';

export interface IConfigureMarketplacesProps {
  control: Control<TProspectingGiftingForm>;
  trigger: UseFormTrigger<TProspectingGiftingForm>;
  resetField: UseFormResetField<TProspectingGiftingForm>;
}

const ConfigureMarketplaces = ({ control, trigger, resetField }: IConfigureMarketplacesProps): JSX.Element => {
  const [isCustomMarketplaceSelected, setIsCustomMarketplaceSelected] = useState(false);
  const { reset: resetMarketplaceFields } = useGiftingMarketplacePersist({ resetField });
  const marketplaceData = useWatch({ control, name: GiftingStepFields.MarketplaceData });
  const { customMarketplaceData } = useSelector(getGiftingData) || {};

  const defaultCustomMarketplaceValue = useMemo(
    () => customMarketplaceData || giftingFormDefaultValues.customMarketplaceData,
    [customMarketplaceData],
  );

  useEffect(() => {
    if (isCustomMarketplaceSelected) {
      resetField(GiftingStepFields.MarketplaceData, {
        defaultValue: null,
      });
      resetField(GiftingStepFields.CustomMarketplaceData, {
        defaultValue: clone(defaultCustomMarketplaceValue),
      });
      resetField(`${GiftingStepFields.CustomMarketplaceData}.${CustomMarketplaceDataFields.MarketplaceId}` as const, {
        defaultValue: defaultCustomMarketplaceValue?.[CustomMarketplaceDataFields.MarketplaceId] ?? null,
      });
    } else {
      resetField(GiftingStepFields.CustomMarketplaceData, {
        defaultValue: null,
      });
      resetMarketplaceFields();
    }
  }, [resetField, isCustomMarketplaceSelected, resetMarketplaceFields, defaultCustomMarketplaceValue]);

  useEffect(() => {
    if (customMarketplaceData) {
      setIsCustomMarketplaceSelected(true);
    }
  }, [customMarketplaceData]);

  return (
    <Box>
      {isCustomMarketplaceSelected && !marketplaceData ? (
        <CustomMarketplaceController control={control} />
      ) : (
        <ConfigureMarketplaceController control={control} trigger={trigger} resetField={resetField} />
      )}
      <Box sx={styles.toggleSettingsWrapper}>
        {isCustomMarketplaceSelected ? 'Or ' : 'Or use a '}
        <Button
          variant="text"
          sx={styles.toggleSettingsBtn}
          onClick={() => setIsCustomMarketplaceSelected(isSelected => !isSelected)}
        >
          {isCustomMarketplaceSelected ? 'manually configure marketplace' : 'custom marketplace'}
        </Button>
      </Box>
    </Box>
  );
};

export default ConfigureMarketplaces;
