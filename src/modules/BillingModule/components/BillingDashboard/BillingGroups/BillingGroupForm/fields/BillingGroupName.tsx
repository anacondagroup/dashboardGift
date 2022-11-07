import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Control, Controller } from 'react-hook-form';
import { FormControl, TextField } from '@mui/material';

import { setCreateBillingGroupName } from '../../../../../store/editBillingGroups/editBillingGroups.actions';
import {
  CreateBillingGroupField,
  TCreateBillingGroupForm,
} from '../../../../../store/editBillingGroups/editBillingGroups.types';
import { getBillingGroupData } from '../../../../../store/editBillingGroups/editBillingGroups.selectors';

export type IBillingGroupNameProps = {
  control: Control<TCreateBillingGroupForm>;
  error?: string;
};

const BillingGroupName = ({ control, error }: IBillingGroupNameProps): JSX.Element => {
  const dispatch = useDispatch();

  const billingGroupInfo = useSelector(getBillingGroupData);

  const disableGroupName = billingGroupInfo.groupId === 'Ungrouped';

  const handleOnBlur = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      dispatch(setCreateBillingGroupName(value));
    },
    [dispatch],
  );

  return (
    <FormControl error={!!error} variant="outlined" fullWidth>
      <Controller
        control={control}
        name={CreateBillingGroupField.Name}
        render={({ field: { onChange, value, onBlur } }) => (
          <TextField
            name={CreateBillingGroupField.Name}
            value={value}
            error={!!error}
            helperText={error}
            fullWidth
            disabled={disableGroupName}
            variant="outlined"
            label="Group Name"
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

export default memo(BillingGroupName);
