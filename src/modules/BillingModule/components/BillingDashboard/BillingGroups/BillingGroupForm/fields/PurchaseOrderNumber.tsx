import React, { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, FormControl } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

import { setCreateBillingGroupPoNumber } from '../../../../../store/editBillingGroups/editBillingGroups.actions';
import {
  CreateBillingGroupField,
  TCreateBillingGroupForm,
} from '../../../../../store/editBillingGroups/editBillingGroups.types';

export type IBillingGroupNameProps = {
  control: Control<TCreateBillingGroupForm>;
  error?: string;
};

const PurchaseOrderNumber = ({ control, error }: IBillingGroupNameProps): JSX.Element => {
  const dispatch = useDispatch();

  const handleOnBlur = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      dispatch(setCreateBillingGroupPoNumber(value));
      return value;
    },
    [dispatch],
  );
  return (
    <FormControl error={!!error} variant="outlined" fullWidth>
      <Controller
        control={control}
        name={CreateBillingGroupField.PurchaseOrderNumber}
        render={({ field: { onChange, value, onBlur } }) => (
          <TextField
            name={CreateBillingGroupField.PurchaseOrderNumber}
            error={!!error}
            value={value}
            helperText={error}
            fullWidth
            variant="outlined"
            label="(Optional) Add PO # for Group"
            onChange={onChange}
            onBlur={e => {
              onBlur();
              handleOnBlur(e as React.ChangeEvent<HTMLInputElement>);
            }}
          />
        )}
      />
    </FormControl>
  );
};

export default memo(PurchaseOrderNumber);
