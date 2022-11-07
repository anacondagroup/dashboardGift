import React, { memo } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Controller } from 'react-hook-form';

import { CustomMarketplaceField } from '../../../store/customMarketplace/customMarketplace.types';

import { IFieldProps } from './Field';

const IsGIftCardsAllowed = ({ control, trigger, setValue }: IFieldProps<'trigger' | 'setValue'>): JSX.Element => (
  <Controller
    control={control}
    name={CustomMarketplaceField.IsGiftCardsAllowed}
    render={({ field: { onChange, value } }) => (
      <FormControlLabel
        control={
          <Checkbox
            checked={value}
            onChange={(event, checked) => {
              onChange(checked);
              trigger(CustomMarketplaceField.IsDonationsAllowed);
              setValue(CustomMarketplaceField.GiftCardPrice, null, { shouldDirty: false, shouldValidate: true });
            }}
            color="primary"
            name={CustomMarketplaceField.IsGiftCardsAllowed}
          />
        }
        label="Include gift cards in the marketplace"
      />
    )}
  />
);

export default memo(IsGIftCardsAllowed);
