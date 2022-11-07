import React, { memo } from 'react';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

import { CustomMarketplaceField } from '../../../store/customMarketplace/customMarketplace.types';

import { IFieldProps } from './Field';

const MarketplaceName = ({ control, error }: IFieldProps<never, false>): JSX.Element => (
  <Controller
    control={control}
    name={CustomMarketplaceField.Name}
    render={({ field }) => (
      <TextField {...field} error={!!error} helperText={error} fullWidth variant="outlined" label="Marketplace Name" />
    )}
  />
);

export default memo(MarketplaceName);
