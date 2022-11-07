import React, { useEffect, memo } from 'react';
import { Control, useController, useWatch } from 'react-hook-form';
import ReactNumberFormat from 'react-number-format';
import { Box, TextField } from '@mui/material';

import {
  GiftingStepFields,
  MarketplaceDataFields,
  TProspectingGiftingForm,
} from '../../../../../../store/prospectingCampaign/steps/gifting/gifting.types';

export interface IPhysicalPriceProps {
  control: Control<TProspectingGiftingForm>;
  onChanged: () => void;
  name: MarketplaceDataFields.MinPrice | MarketplaceDataFields.MaxPrice;
  label: string;
}

const PhysicalPrice = ({ control, name, label, onChanged }: IPhysicalPriceProps): JSX.Element => {
  const controllerName = `${GiftingStepFields.MarketplaceData}.${name}` as const;

  const isPhysicalEnabled = useWatch({
    control,
    name: `${GiftingStepFields.MarketplaceData}.${MarketplaceDataFields.IsPhysicalEnabled}` as const,
  });

  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({
    control,
    name: controllerName,
  });

  useEffect(() => {
    if (!isPhysicalEnabled) {
      onChange(null);
    }
  }, [isPhysicalEnabled, onChange]);

  return (
    <Box maxWidth={135}>
      <ReactNumberFormat
        fullWidth
        decimalScale={0}
        allowNegative={false}
        customInput={TextField}
        thousandSeparator
        prefix="$"
        placeholder="$"
        InputLabelProps={{ shrink: true }}
        error={!!error?.message}
        helperText={error?.message}
        disabled={!isPhysicalEnabled}
        label={`${label}${isPhysicalEnabled ? ' *' : ''}`}
        variant="outlined"
        margin="normal"
        inputProps={{
          min: 0,
          'data-testid': `GiftingData.MarketplaceSettings.${name}Field`,
        }}
        value={value === null ? '' : value}
        onValueChange={({ floatValue }) => {
          onChange(typeof floatValue === 'number' ? floatValue : null);
          onChanged();
        }}
        onBlur={onBlur}
      />
    </Box>
  );
};

export default memo(PhysicalPrice);
