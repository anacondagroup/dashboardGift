import React, { memo, useCallback } from 'react';
import ReactNumberFormat from 'react-number-format';
import { TextField } from '@mui/material';

import { ProductFilter } from '../../../../store/products/products.types';

export interface IMinPriceProps {
  value?: number | null;
  onChange: (value: number | undefined, name: ProductFilter) => void;
  disabled?: boolean;
}

const MinPrice = ({ value, onChange, disabled = false }: IMinPriceProps) => {
  const handleChange = useCallback(({ floatValue }) => onChange(floatValue, ProductFilter.MinPrice), [onChange]);

  return (
    <ReactNumberFormat
      fullWidth
      onValueChange={handleChange}
      decimalScale={0}
      allowNegative={false}
      value={value === null ? '' : value}
      customInput={TextField}
      thousandSeparator
      prefix="$"
      variant="outlined"
      label="Min Gift"
      disabled={disabled}
    />
  );
};

export default memo(MinPrice);
