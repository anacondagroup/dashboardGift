import React from 'react';
import { Control, useController } from 'react-hook-form';
import { TextField } from '@mui/material';

import {
  TDigitalCodesFormValues,
  CodesSettingsDataFields,
  CodesSettingsLabels,
} from '../../../../store/swagCampaign/steps/codes/codes.types';

export interface IOrderNameProps {
  control: Control<TDigitalCodesFormValues>;
}

const OrderName = ({ control }: IOrderNameProps): JSX.Element => {
  const name = CodesSettingsDataFields.CodesBatchName;

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
      label={CodesSettingsLabels.OrderName}
      variant="outlined"
      margin="normal"
      error={!!error?.message}
      helperText={error?.message}
      inputProps={{ 'data-testid': 'SwagBuilder.CodesStep.DigitalCodes.OrderName' }}
    />
  );
};

export default OrderName;
