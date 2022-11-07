import React, { memo, useCallback, useState } from 'react';
import ReactNumberFormat from 'react-number-format';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useDebounce } from 'react-use';

import { ProductFilter, IProductsFilters } from '../../../store/products/products.types';

import { IFieldProps } from './Field';

const DonationPrice = ({
  disabled = false,
  control,
  error,
  submitForm,
}: IFieldProps & { submitForm?: (filters: IProductsFilters) => void }): JSX.Element => {
  const [valueGiftDonationPrice, setGiftDonationPrice] = useState<number | undefined>();

  const sendCurrentGiftDonationPriceFilter = useCallback(
    (value?: number) => {
      if (submitForm) {
        setGiftDonationPrice(value);
      }
    },
    [submitForm],
  );

  useDebounce(
    () => {
      if (submitForm) {
        submitForm({ donationPrice: valueGiftDonationPrice });
      }
    },
    300,
    [valueGiftDonationPrice],
  );

  return (
    <Controller
      control={control}
      name={ProductFilter.DonationPrice}
      render={({ field: { onChange, value } }) => (
        <ReactNumberFormat
          fullWidth
          onValueChange={e => {
            onChange(e.floatValue);
            sendCurrentGiftDonationPriceFilter(e.floatValue);
          }}
          decimalScale={0}
          allowNegative={false}
          customInput={TextField}
          thousandSeparator
          prefix="$"
          value={value === null ? '' : value}
          variant="outlined"
          label="Donation"
          disabled={disabled}
          error={!!error}
          helperText={error}
          inputProps={{
            'data-testid': 'CampaignFilter.DonationPriceField',
            min: 0,
          }}
        />
      )}
    />
  );
};

export default memo(DonationPrice);
