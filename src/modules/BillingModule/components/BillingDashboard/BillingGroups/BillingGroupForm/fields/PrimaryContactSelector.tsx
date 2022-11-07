import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormControl, TextField, Autocomplete } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

import { IBillingContact } from '../../../../../store/billingGroupsContacts/billingGroupsContacts.types';
import {
  CreateBillingGroupField,
  TCreateBillingGroupForm,
} from '../../../../../store/editBillingGroups/editBillingGroups.types';
import {
  getContactList,
  getIsLoadingBillingContacts,
} from '../../../../../store/billingGroupsContacts/billingGroupsContacts.selectors';
import { setCreateBillingGroupPrimaryContact } from '../../../../../store/editBillingGroups/editBillingGroups.actions';
import {
  getBillingGroupContactOptionLabel,
  getBillingGroupContactOptionSelected,
} from '../../../../../helpers/billingGroupForm.helpers';

export type IPrimaryContactSelectorProps = {
  control: Control<TCreateBillingGroupForm>;
  error?: string;
};

const PrimaryContactSelector = ({ control, error }: IPrimaryContactSelectorProps): JSX.Element => {
  const dispatch = useDispatch();

  const contactList = useSelector(getContactList);
  const isLoading = useSelector(getIsLoadingBillingContacts);

  const handleOnchange = useCallback(
    (value: IBillingContact) => {
      dispatch(setCreateBillingGroupPrimaryContact(value));
    },
    [dispatch],
  );

  return (
    <FormControl error={!!error} variant="outlined" fullWidth>
      <Controller
        control={control}
        name={CreateBillingGroupField.PrimaryBillingContact}
        render={({ field: { onChange, value } }) => (
          <Autocomplete<IBillingContact, false, true>
            size="small"
            // @ts-ignore
            value={value}
            onChange={(_, selValue) => {
              onChange(selValue);
              handleOnchange(selValue);
            }}
            renderInput={props => (
              <TextField
                {...props}
                name={CreateBillingGroupField.PrimaryBillingContact}
                variant="outlined"
                label="Primary Billing Contact"
                error={!!error}
                helperText={error}
                fullWidth
              />
            )}
            loading={isLoading}
            options={contactList}
            getOptionLabel={getBillingGroupContactOptionLabel}
            isOptionEqualToValue={getBillingGroupContactOptionSelected}
          />
        )}
      />
    </FormControl>
  );
};

export default memo(PrimaryContactSelector);
