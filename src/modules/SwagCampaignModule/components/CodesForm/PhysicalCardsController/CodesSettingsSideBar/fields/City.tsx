import React from 'react';
import { Control, useController } from 'react-hook-form';
import { TextField } from '@mui/material';

import {
  TPhysicalCardsFormValues,
  CodesSettingsDataFields,
  DeliveryAddressDataFields,
  DeliveryAddressLabels,
} from '../../../../../store/swagCampaign/steps/codes/codes.types';

export interface ICityProps {
  control: Control<TPhysicalCardsFormValues>;
}

const City = ({ control }: ICityProps): JSX.Element => {
  const name = `${CodesSettingsDataFields.DeliveryAddress}.${DeliveryAddressDataFields.City}` as const;

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <TextField
      {...field}
      label={DeliveryAddressLabels.City}
      variant="outlined"
      margin="normal"
      fullWidth
      required
      error={!!error?.message}
      helperText={error?.message}
      inputProps={{ 'data-testid': 'SwagBuilder.CodesStep.PhysicalCodes.City' }}
    />
  );
};

export default City;
