import React, { memo, useCallback, useState } from 'react';
import ReactNumberFormat from 'react-number-format';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useDebounce } from 'react-use';

import { ProductFilter, IProductsFilters } from '../../../store/products/products.types';

import { IFieldProps } from './Field';

const MinPrice = ({
  disabled = false,
  control,
  error,
  submitForm,
}: IFieldProps & { submitForm?: (filters: IProductsFilters) => void }): JSX.Element => {
  const [valueMinPrice, setValueMinPrice] = useState<number | undefined>();

  const sendCurrentMinPriceFilter = useCallback(
    (value?: number) => {
      if (submitForm) {
        setValueMinPrice(value);
      }
    },
    [submitForm],
  );

  useDebounce(
    () => {
      if (submitForm) {
        submitForm({ minPrice: valueMinPrice });
      }
    },
    300,
    [valueMinPrice],
  );

  return (
    <Controller
      control={control}
      name={ProductFilter.MinPrice}
      render={({ field: { onChange, value } }) => (
        <ReactNumberFormat
          fullWidth
          onValueChange={e => {
            onChange(e.floatValue);
            sendCurrentMinPriceFilter(e.floatValue);
          }}
          decimalScale={0}
          allowNegative={false}
          value={value === null ? '' : value}
          customInput={TextField}
          thousandSeparator
          prefix="$"
          variant="outlined"
          label="Min Gift"
          disabled={disabled}
          error={!!error}
          helperText={error}
          inputProps={{
            'data-testid': 'CampaignFilter.MinPriceField',
            min: 0,
          }}
        />
      )}
    />
  );
};

export default memo(MinPrice);
