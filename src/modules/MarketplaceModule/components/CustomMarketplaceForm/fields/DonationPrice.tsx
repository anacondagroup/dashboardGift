import React, { memo } from 'react';
import ReactNumberFormat from 'react-number-format';
import { pipe, prop } from 'ramda';
import { TextField } from '@mui/material';
import { Controller, useWatch } from 'react-hook-form';

import { CustomMarketplaceField } from '../../../store/customMarketplace/customMarketplace.types';

import { IFieldProps } from './Field';

const DonationPrice = ({ control, error }: IFieldProps): JSX.Element => {
  const isDonationsAllowed = useWatch({ name: CustomMarketplaceField.IsDonationsAllowed });
  return (
    <Controller
      control={control}
      name={CustomMarketplaceField.DonationPrice}
      render={({ field: { onChange, value } }) => (
        <ReactNumberFormat
          onValueChange={pipe(prop('floatValue'), onChange)}
          decimalScale={0}
          allowNegative={false}
          customInput={TextField}
          thousandSeparator
          prefix="$"
          placeholder="$"
          InputLabelProps={{ shrink: true }}
          value={value === null ? '' : value}
          variant="outlined"
          label="Amount"
          error={!!error}
          helperText={error}
          disabled={!isDonationsAllowed}
          inputProps={{
            min: 0,
          }}
        />
      )}
    />
  );
};

export default memo(DonationPrice);
