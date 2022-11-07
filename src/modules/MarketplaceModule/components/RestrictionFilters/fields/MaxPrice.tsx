import React, { memo, useCallback, useState } from 'react';
import ReactNumberFormat from 'react-number-format';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useDebounce } from 'react-use';

import { ProductFilter, IProductsFilters } from '../../../store/products/products.types';

import { IFieldProps } from './Field';

const MaxPrice = ({
  disabled = false,
  error,
  control,
  submitForm,
}: IFieldProps & { submitForm?: (filters: IProductsFilters) => void }): JSX.Element => {
  const [valueMaxPrice, setValueMaxPrice] = useState<number | undefined>();

  const sendCurrentMaxPriceFilter = useCallback(
    (value?: number) => {
      if (submitForm) {
        setValueMaxPrice(value);
      }
    },
    [submitForm],
  );

  useDebounce(
    () => {
      if (submitForm) {
        submitForm({ maxPrice: valueMaxPrice });
      }
    },
    300,
    [valueMaxPrice],
  );

  return (
    <Controller
      control={control}
      name={ProductFilter.MaxPrice}
      render={({ field: { onChange, value } }) => (
        <ReactNumberFormat
          fullWidth
          onValueChange={e => {
            onChange(e.floatValue);
            sendCurrentMaxPriceFilter(e.floatValue);
          }}
          decimalScale={0}
          allowNegative={false}
          customInput={TextField}
          thousandSeparator
          prefix="$"
          value={value === null ? '' : value}
          variant="outlined"
          label="Max Gift"
          disabled={disabled}
          error={!!error}
          helperText={error}
          inputProps={{
            'data-testid': 'CampaignFilter.MaxPriceField',
            min: 0,
          }}
        />
      )}
    />
  );
};

export default memo(MaxPrice);
