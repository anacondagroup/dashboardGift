import React, { memo, useCallback } from 'react';
import ReactNumberFormat from 'react-number-format';
import { TextField } from '@mui/material';

import { ProductFilter } from '../../../../store/products/products.types';

export interface IDonationPriceProps {
  value?: number | null;
  onChange: (value: number | undefined, name: ProductFilter) => void;
  disabled?: boolean;
}

const DonationPrice = ({ value, onChange, disabled = false }: IDonationPriceProps): JSX.Element => {
  const handleChange = useCallback(({ floatValue }) => onChange(floatValue, ProductFilter.DonationPrice), [onChange]);

  return (
    <ReactNumberFormat
      fullWidth
      onValueChange={handleChange}
      decimalScale={0}
      allowNegative={false}
      customInput={TextField}
      thousandSeparator
      prefix="$"
      value={value || 0}
      variant="outlined"
      label="Donation"
      disabled={disabled}
    />
  );
};

export default memo(DonationPrice);
