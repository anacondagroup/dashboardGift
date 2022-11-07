import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionButton, SelectFilter } from '@alycecom/ui';
import { Box, MenuItem } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';

import {
  getIsLoading,
  getNumberOfRecipientsOptions,
  getPurposesOptions,
} from '../../../store/campaign/purposes/purposes.selectors';
import { loadPurposesRequest } from '../../../store/campaign/purposes/purposes.actions';
import { TNumberOfRecipientsOption, TPurposeOption } from '../../../store/campaign/purposes/purposes.types';

export interface ICampaignPurposeProps {
  purpose?: TPurposeOption;
  numberOfRecipients?: TNumberOfRecipientsOption;
  onSubmit: (value: { purpose: TPurposeOption; numberOfRecipients: TNumberOfRecipientsOption }) => void;
  isLoading: boolean;
}

interface ICampaignPurposeForm {
  purpose?: TPurposeOption;
  numberOfRecipients?: TNumberOfRecipientsOption;
}

const campaignPurposeValidation = object().shape({
  purpose: string().label('Campaign Purpose').nullable().required(),
  numberOfRecipients: string().label('Estimated Total Recipients').nullable().required(),
});

const CampaignPurpose = ({ purpose, numberOfRecipients, isLoading, onSubmit }: ICampaignPurposeProps) => {
  const dispatch = useDispatch();

  const purposesOptions = useSelector(getPurposesOptions);
  const numberOfRecipientsOptions = useSelector(getNumberOfRecipientsOptions);
  const isPurposesLoading = useSelector(getIsLoading);

  useEffect(() => {
    dispatch(loadPurposesRequest());
  }, [dispatch]);

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<ICampaignPurposeForm>({
    mode: 'all',
    resolver: yupResolver(campaignPurposeValidation),
  });

  useEffect(() => reset({ purpose, numberOfRecipients }), [reset, purpose, numberOfRecipients]);

  return (
    <>
      <Box width={0.5}>
        <Controller
          control={control}
          name="purpose"
          render={({ field: { onChange, value } }) => (
            <SelectFilter
              label="Campaign Purpose *"
              name="purpose"
              value={value || ''}
              disabled={isLoading || isPurposesLoading}
              onFilterChange={({ purpose: selected }) => onChange(selected)}
              fullWidth
              error={Boolean(errors.purpose)}
              helperText={errors.purpose?.message}
            >
              {purposesOptions.map(purposeOption => (
                <MenuItem key={purposeOption} value={purposeOption}>
                  {purposeOption}
                </MenuItem>
              ))}
            </SelectFilter>
          )}
        />
      </Box>
      <Box width={0.5} mt={2}>
        <Controller
          control={control}
          name="numberOfRecipients"
          render={({ field: { onChange, value } }) => (
            <SelectFilter
              label="Estimated Total Recipients *"
              name="recipients"
              value={value || ''}
              disabled={isLoading || isPurposesLoading}
              onFilterChange={({ recipients: selected }) => onChange(selected)}
              error={Boolean(errors.numberOfRecipients)}
              helperText={errors.numberOfRecipients?.message}
              fullWidth
            >
              {numberOfRecipientsOptions.map(numberOfRecipientsOption => (
                <MenuItem key={numberOfRecipientsOption} value={numberOfRecipientsOption}>
                  {numberOfRecipientsOption}
                </MenuItem>
              ))}
            </SelectFilter>
          )}
        />
      </Box>
      <Box mt={2}>
        {/* @ts-ignore */}
        <ActionButton onClick={handleSubmit(onSubmit)}>Save</ActionButton>
      </Box>
    </>
  );
};

export default memo(CampaignPurpose);
