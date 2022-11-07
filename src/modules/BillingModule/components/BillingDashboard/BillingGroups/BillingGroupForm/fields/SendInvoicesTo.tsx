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
import { setCreateBillingGroupSendInvoicesTo } from '../../../../../store/editBillingGroups/editBillingGroups.actions';
import {
  getBillingGroupContactOptionLabel,
  getBillingGroupContactOptionSelected,
} from '../../../../../helpers/billingGroupForm.helpers';

export type ISendInvoicesToProps = {
  control: Control<TCreateBillingGroupForm>;
  error?: string;
};

const SendInvoicesTo = ({ control, error }: ISendInvoicesToProps): JSX.Element => {
  const dispatch = useDispatch();

  const contactList = useSelector(getContactList);
  const isLoading = useSelector(getIsLoadingBillingContacts);

  const handleOnchange = useCallback(
    (value: IBillingContact[]) => {
      dispatch(setCreateBillingGroupSendInvoicesTo(value));
    },
    [dispatch],
  );

  return (
    <FormControl error={!!error} variant="outlined" fullWidth>
      <Controller
        control={control}
        name={CreateBillingGroupField.SendInvoicesTo}
        render={({ field: { onChange, value } }) => (
          <Autocomplete<IBillingContact, true, true>
            size="small"
            // @ts-ignore
            value={value}
            multiple
            onChange={(_, selValue) => {
              onChange(selValue);
              handleOnchange(selValue);
            }}
            defaultValue={[] as IBillingContact[]}
            renderInput={props => (
              <TextField
                {...props}
                name={CreateBillingGroupField.SendInvoicesTo}
                variant="outlined"
                label="(Optional) Secondary Billing Contact"
                error={!!error}
                helperText={error}
                fullWidth
              />
            )}
            options={contactList}
            loading={isLoading}
            getOptionLabel={getBillingGroupContactOptionLabel}
            isOptionEqualToValue={getBillingGroupContactOptionSelected}
          />
        )}
      />
    </FormControl>
  );
};

export default memo(SendInvoicesTo);
