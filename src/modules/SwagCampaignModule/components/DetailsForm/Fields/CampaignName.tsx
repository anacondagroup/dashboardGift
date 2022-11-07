import React from 'react';
import { Control, useController } from 'react-hook-form';
import { TextField } from '@mui/material';

import { SwagDetailsFormFields, TSwagDetailsFormValues } from '../../../store/swagCampaign/swagCampaign.types';

export interface ICampaignNameProps {
  control: Control<TSwagDetailsFormValues>;
}

const CampaignName = ({ control }: ICampaignNameProps): JSX.Element => {
  const name = SwagDetailsFormFields.CampaignName;

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
      inputProps={{ 'data-testid': 'SwagDetailsForm.CampaignName' }}
    />
  );
};

export default CampaignName;
