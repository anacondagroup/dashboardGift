import React from 'react';
import { Control, useController } from 'react-hook-form';
import { TextField } from '@mui/material';

import {
  TPhysicalCardsFormValues,
  CodesSettingsDataFields,
  DeliveryAddressDataFields,
  DeliveryAddressLabels,
} from '../../../../../store/swagCampaign/steps/codes/codes.types';

export interface IZipCodeProps {
  control: Control<TPhysicalCardsFormValues>;
}

const ZipCode = ({ control }: IZipCodeProps): JSX.Element => {
  const name = `${CodesSettingsDataFields.DeliveryAddress}.${DeliveryAddressDataFields.Zip}` as const;
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
      label={DeliveryAddressLabels.ZipCode}
      variant="outlined"
      margin="normal"
      fullWidth
      required
      error={!!error?.message}
      helperText={error?.message}
      inputProps={{ 'data-testid': 'SwagBuilder.CodesStep.PhysicalCodes.ZipCode' }}
    />
  );
};

export default ZipCode;
