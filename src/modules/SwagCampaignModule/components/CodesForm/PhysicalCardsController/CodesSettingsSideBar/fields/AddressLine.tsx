import React from 'react';
import { Control, useController } from 'react-hook-form';
import { TextField } from '@mui/material';

import {
  TPhysicalCardsFormValues,
  CodesSettingsDataFields,
  DeliveryAddressDataFields,
} from '../../../../../store/swagCampaign/steps/codes/codes.types';

export interface IAddressLine1Props {
  control: Control<TPhysicalCardsFormValues>;
  nameField: DeliveryAddressDataFields;
  labelText: string;
  dataTestId: string;
  isRequired?: boolean;
}

const AddressLine = ({
  control,
  nameField,
  labelText,
  dataTestId,
  isRequired = true,
}: IAddressLine1Props): JSX.Element => {
  const name = `${CodesSettingsDataFields.DeliveryAddress}.${nameField}` as const;
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
      label={labelText}
      variant="outlined"
      margin="normal"
      required={isRequired}
      fullWidth
      error={!!error?.message}
      helperText={error?.message}
      inputProps={{ 'data-testid': dataTestId }}
    />
  );
};

export default AddressLine;
