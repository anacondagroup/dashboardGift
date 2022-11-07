import React, { memo } from 'react';
import { TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

import {
  CreateBillingGroupAddContactField,
  TBillingGroupAddContactForm,
} from '../../../../../store/billingGroupsContacts/billingGroupsContacts.types';

export type IBillingContactEmailProps = {
  control: Control<TBillingGroupAddContactForm>;
  error?: string;
};

const BillingContactEmail = ({ control, error }: IBillingContactEmailProps): JSX.Element => (
  <Controller
    control={control}
    name={CreateBillingGroupAddContactField.Email}
    render={({ field: { onChange, value } }) => (
      <TextField
        value={value}
        onChange={onChange}
        error={!!error}
        helperText={error}
        fullWidth
        variant="outlined"
        label="Email Address"
      />
    )}
  />
);

export default memo(BillingContactEmail);
