import React, { memo } from 'react';
import { TextField } from '@mui/material';
import { Controller, Control } from 'react-hook-form';

import {
  CreateBillingGroupAddContactField,
  TBillingGroupAddContactForm,
} from '../../../../../store/billingGroupsContacts/billingGroupsContacts.types';

export type IBillingContactFirstNameProps = {
  control: Control<TBillingGroupAddContactForm>;
  error?: string;
};

const BillingContactFirstName = ({ control, error }: IBillingContactFirstNameProps): JSX.Element => (
  <Controller
    control={control}
    name={CreateBillingGroupAddContactField.FirstName}
    render={({ field: { onChange, value } }) => (
      <TextField
        value={value}
        onChange={onChange}
        error={!!error}
        helperText={error}
        fullWidth
        variant="outlined"
        label="First Name"
      />
    )}
  />
);

export default memo(BillingContactFirstName);
