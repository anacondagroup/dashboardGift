import React from 'react';
import { Control, useController } from 'react-hook-form';
import { TextField } from '@mui/material';

import {
  DetailsFormFields,
  TDetailsFormValues,
} from '../../../store/prospectingCampaign/steps/details/details.schemas';

export interface ICampaignNameProps {
  control: Control<TDetailsFormValues>;
}

const CampaignName = ({ control }: ICampaignNameProps): JSX.Element => {
  const name = DetailsFormFields.Name;

  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  return (
    <TextField
      {...field}
      fullWidth
      label="Campaign Name *"
      variant="outlined"
      error={!!error?.message}
      helperText={error?.message}
      inputProps={{ 'data-testid': 'ProspectingDetailsForm.CampaignName' }}
    />
  );
};

export default CampaignName;
