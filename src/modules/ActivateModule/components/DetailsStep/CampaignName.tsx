import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { DetailsFormFields } from '../../store/steps/details/detailsForm.schemas';

type TCampaignNameProps = Omit<TextFieldProps, 'error'> & {
  error?: string;
};

const CampaignName = ({ error = '', ...textFieldProps }: TCampaignNameProps): JSX.Element => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={DetailsFormFields.Name}
      render={({ field }) => (
        <TextField
          {...textFieldProps}
          {...field}
          label="Campaign Name"
          variant="outlined"
          error={!!error}
          helperText={error}
          inputProps={{ 'data-testid': 'CreateActivateCampaignStepper.CampaignName' }}
          required
        />
      )}
    />
  );
};

export default CampaignName;
