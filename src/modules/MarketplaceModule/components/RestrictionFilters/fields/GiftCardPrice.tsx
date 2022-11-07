import React, { memo, useCallback, useState } from 'react';
import ReactNumberFormat from 'react-number-format';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useDebounce } from 'react-use';

import { ProductFilter, IProductsFilters } from '../../../store/products/products.types';

import { IFieldProps } from './Field';

const GiftCardPrice = ({
  disabled = false,
  control,
  error,
  submitForm,
}: IFieldProps & { submitForm?: (filters: IProductsFilters) => void }): JSX.Element => {
  const [valueGiftCardPrice, setGiftCardMaxPrice] = useState<number | undefined>();

  const sendCurrentGiftCardPriceFilter = useCallback(
    (value?: number) => {
      if (submitForm) {
        setGiftCardMaxPrice(value);
      }
    },
    [submitForm],
  );

  useDebounce(
    () => {
      if (submitForm) {
        submitForm({ giftCardPrice: valueGiftCardPrice });
      }
    },
    300,
    [valueGiftCardPrice],
  );

  return (
    <Controller
      control={control}
      name={ProductFilter.GiftCardPrice}
      render={({ field: { onChange, value } }) => (
        <ReactNumberFormat
          fullWidth
          onValueChange={e => {
            onChange(e.floatValue);
            sendCurrentGiftCardPriceFilter(e.floatValue);
          }}
          decimalScale={0}
          allowNegative={false}
          customInput={TextField}
          thousandSeparator
          prefix="$"
          value={value === null ? '' : value}
          variant="outlined"
          label="Gift Card"
          disabled={disabled}
          error={!!error}
          helperText={error}
          inputProps={{
            'data-testid': 'CampaignFilter.GiftCardPriceField',
            min: 0,
          }}
        />
      )}
    />
  );
};

export default memo(GiftCardPrice);
