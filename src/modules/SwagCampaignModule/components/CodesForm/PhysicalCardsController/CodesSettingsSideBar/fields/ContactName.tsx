import React from 'react';
import { Control, useController } from 'react-hook-form';
import { Box, TextField } from '@mui/material';

import {
  TPhysicalCardsFormValues,
  CodesSettingsDataFields,
  CodesSettingsLabels,
} from '../../../../../store/swagCampaign/steps/codes/codes.types';

export interface IContactNameProps {
  control: Control<TPhysicalCardsFormValues>;
}

const ContactName = ({ control }: IContactNameProps): JSX.Element => {
  const name = CodesSettingsDataFields.ContactName;
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <>
      <Box>Where would you like the cards to be shipped to?</Box>
      <TextField
        {...field}
        label={CodesSettingsLabels.ContactName}
        variant="outlined"
        margin="normal"
        fullWidth
        required
        error={!!error?.message}
        helperText={error?.message}
        inputProps={{ 'data-testid': 'SwagBuilder.CodesStep.PhysicalCodes.ContactName' }}
      />
    </>
  );
};

export default ContactName;
