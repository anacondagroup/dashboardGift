import React, { memo, useCallback } from 'react';
import ReactNumberFormat from 'react-number-format';
import { TextField } from '@mui/material';

import { ProductFilter } from '../../../../store/products/products.types';

export interface IMaxPriceProps {
  value?: number | null;
  onChange: (value: number | undefined, name: ProductFilter) => void;
  disabled?: boolean;
}

const MaxPrice = ({ value, onChange, disabled = false }: IMaxPriceProps): JSX.Element => {
  const handleChange = useCallback(({ floatValue }) => onChange(floatValue, ProductFilter.MaxPrice), [onChange]);

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
      label="Max Gift"
      disabled={disabled}
    />
  );
};

export default memo(MaxPrice);
