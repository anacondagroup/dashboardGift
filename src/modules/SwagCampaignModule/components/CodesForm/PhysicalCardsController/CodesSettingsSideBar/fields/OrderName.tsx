import React from 'react';
import { Control, useController } from 'react-hook-form';
import { Box, TextField } from '@mui/material';

import {
  TPhysicalCardsFormValues,
  CodesSettingsDataFields,
  CodesSettingsLabels,
} from '../../../../../store/swagCampaign/steps/codes/codes.types';

export interface IOrderNameProps {
  control: Control<TPhysicalCardsFormValues>;
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
    <>
      <Box>Name this batch of cards</Box>
      <TextField
        {...field}
        label={CodesSettingsLabels.OrderName}
        variant="outlined"
        margin="normal"
        fullWidth
        required
        error={!!error?.message}
        helperText={error?.message}
        inputProps={{ 'data-testid': 'SwagBuilder.CodesStep.PhysicalCodes.AddressLine1' }}
      />
    </>
  );
};

export default OrderName;
