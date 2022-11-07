import React, { memo } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Controller } from 'react-hook-form';

import { CustomMarketplaceField } from '../../../store/customMarketplace/customMarketplace.types';

import { IFieldProps } from './Field';

const IsPhysicalGiftsAllowed = ({ control, trigger }: IFieldProps<'trigger', false>): JSX.Element => (
  <Controller
    control={control}
    name={CustomMarketplaceField.IsPhysicalGiftsAllowed}
    render={({ field: { onChange, value } }) => (
      <FormControlLabel
        control={
          <Checkbox
            checked={value}
            onChange={(event, checked) => {
              onChange(checked);
              trigger([CustomMarketplaceField.IsGiftCardsAllowed, CustomMarketplaceField.IsDonationsAllowed]);
            }}
            color="primary"
            name={CustomMarketplaceField.IsPhysicalGiftsAllowed}
          />
        }
        label="Include physical gifts, subscription boxes, on-demand services, and/or experiences in this marketplace. "
      />
    )}
  />
);

export default memo(IsPhysicalGiftsAllowed);
