import React, { useEffect, memo } from 'react';
import ReactNumberFormat from 'react-number-format';
import { TextField } from '@mui/material';
import { Controller, useWatch } from 'react-hook-form';

import { CustomMarketplaceField } from '../../../store/customMarketplace/customMarketplace.types';

import { IFieldProps } from './Field';

const MinPrice = ({ control, trigger, error, setValue }: IFieldProps<'trigger' | 'setValue', false>): JSX.Element => {
  const isPhysicalGiftsAllowed = useWatch({ name: CustomMarketplaceField.IsPhysicalGiftsAllowed });

  useEffect(() => {
    if (!isPhysicalGiftsAllowed) {
      setValue(CustomMarketplaceField.MinPrice, null, { shouldDirty: false, shouldValidate: true });
    }
  }, [setValue, isPhysicalGiftsAllowed]);

  return (
    <Controller
      control={control}
      name={CustomMarketplaceField.MinPrice}
      render={({ field: { onChange, value } }) => (
        <ReactNumberFormat
          onValueChange={({ floatValue }) => {
            onChange(floatValue);
            trigger('maxPrice');
          }}
          decimalScale={0}
          allowNegative={false}
          customInput={TextField}
          thousandSeparator
          prefix="$"
          placeholder="$"
          InputLabelProps={{ shrink: true }}
          value={value === null ? '' : value}
          variant="outlined"
          label="Gift Min"
          error={!!error}
          helperText={error}
          disabled={!isPhysicalGiftsAllowed}
          fullWidth
          inputProps={{
            min: 0,
          }}
        />
      )}
    />
  );
};

export default memo(MinPrice);
