import React, { memo } from 'react';
import { TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

import {
  CreateBillingGroupAddContactField,
  TBillingGroupAddContactForm,
} from '../../../../../store/billingGroupsContacts/billingGroupsContacts.types';

export type IBillingContactLastNameProps = {
  control: Control<TBillingGroupAddContactForm>;
  error?: string;
};

const BillingContactLastName = ({ control, error }: IBillingContactLastNameProps): JSX.Element => (
  <Controller
    control={control}
    name={CreateBillingGroupAddContactField.LastName}
    render={({ field: { onChange, value } }) => (
      <TextField
        value={value}
        onChange={onChange}
        error={!!error}
        helperText={error}
        fullWidth
        variant="outlined"
        label="Last Name"
      />
    )}
  />
);

export default memo(BillingContactLastName);
