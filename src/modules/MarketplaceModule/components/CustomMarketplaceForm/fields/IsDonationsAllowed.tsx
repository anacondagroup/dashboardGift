import React, { memo } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Controller } from 'react-hook-form';

import { CustomMarketplaceField } from '../../../store/customMarketplace/customMarketplace.types';

import { IFieldProps } from './Field';

const IsDonationsAllowed = ({ control, trigger, setValue }: IFieldProps<'trigger' | 'setValue'>): JSX.Element => (
  <Controller
    control={control}
    name={CustomMarketplaceField.IsDonationsAllowed}
    render={({ field: { onChange, value } }) => (
      <FormControlLabel
        control={
          <Checkbox
            checked={value}
            onChange={(event, checked) => {
              onChange(checked);
              trigger(CustomMarketplaceField.IsGiftCardsAllowed);
              setValue(CustomMarketplaceField.DonationPrice, null, { shouldDirty: true, shouldValidate: true });
            }}
            color="primary"
            name={CustomMarketplaceField.IsDonationsAllowed}
          />
        }
        label="Allow recipients to donate in lieu of accepting a gift"
      />
    )}
  />
);

export default memo(IsDonationsAllowed);
