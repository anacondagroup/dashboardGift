import React, { useEffect, memo } from 'react';
import { Control, useController, useWatch } from 'react-hook-form';
import ReactNumberFormat from 'react-number-format';
import { Box, TextField } from '@mui/material';

import {
  GiftingStepFields,
  MarketplaceDataFields,
  TSwagCampaignGiftingForm,
} from '../../../../../store/swagCampaign/steps/gifting/gifting.types';

export interface IPhysicalPriceProps {
  control: Control<TSwagCampaignGiftingForm>;
  onChanged: () => void;
  name: MarketplaceDataFields.MinBudgetAmount | MarketplaceDataFields.MaxBudgetAmount;
  label: string;
}

const PhysicalPrice = ({ control, name, label, onChanged }: IPhysicalPriceProps): JSX.Element => {
  const controllerName = `${GiftingStepFields.ExchangeMarketplaceSettings}.${name}` as const;

  const isPhysicalEnabled = useWatch({
    control,
    name: `${GiftingStepFields.ExchangeMarketplaceSettings}.${MarketplaceDataFields.IsPhysicalEnabled}` as const,
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
