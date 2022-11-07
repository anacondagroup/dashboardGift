import React, { useCallback, useEffect } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@alycecom/ui';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useExternalErrors } from '@alycecom/hooks';

import {
  ISingleContactFormValues,
  singleContactFormDefaultValues,
  SingleContactFormFields,
  singleContactFormSchema,
} from '../../../store/steps/recipients/contact/contactForm.schemas';
import {
  getCreatedContact,
  getErrors,
  getIsContactSaving,
  resetErrors,
  saveContactRequest,
} from '../../../store/steps/recipients/contact';

const resolver = yupResolver(singleContactFormSchema);

interface IAddSingleRecipientFormProps {
  campaignId: number;
  onCancel: () => void;
}

const AddSingleRecipientForm = ({ campaignId, onCancel }: IAddSingleRecipientFormProps): JSX.Element => {
  const dispatch = useDispatch();

  const isSaving = useSelector(getIsContactSaving);
  const createdContact = useSelector(getCreatedContact);
  const externalErrors = useSelector(getErrors);

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
    reset,
    setError,
  } = useForm<ISingleContactFormValues>({
    mode: 'all',
    defaultValues: singleContactFormDefaultValues,
    resolver,
  });

  const onSubmit = useCallback(
    (formValues: ISingleContactFormValues) => {
      dispatch(saveContactRequest({ campaignId, contact: formValues }));
    },
    [dispatch, campaignId],
  );

  useEffect(() => {
    if (createdContact) {
      reset();
    }
  }, [reset, createdContact]);

  useExternalErrors<ISingleContactFormValues>(setError, externalErrors);

  useEffect(
    () => () => {
      dispatch(resetErrors());
    },
    [dispatch],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box py={3} display="flex" justifyContent="flex-start">
        <Box display="flex">
          <Box width="71">
            <Controller
              control={control}
              name={SingleContactFormFields.FirstName}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First name"
                  variant="outlined"
                  error={!!errors[SingleContactFormFields.FirstName]}
                  helperText={errors[SingleContactFormFields.FirstName]?.message}
                  inputProps={{ 'data-testid': 'AddSingleContactForm.FirstName' }}
                />
              )}
            />
          </Box>

          <Box ml={1} width="71">
            <Controller
              control={control}
              name={SingleContactFormFields.LastName}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last name"
                  variant="outlined"
                  error={!!errors[SingleContactFormFields.LastName]}
                  helperText={errors[SingleContactFormFields.LastName]?.message}
                  inputProps={{ 'data-testid': 'AddSingleContactForm.LastName' }}
                />
              )}
            />
          </Box>

          <Box ml={1} width="236">
            <Controller
              control={control}
              name={SingleContactFormFields.Email}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="outlined"
                  error={!!errors[SingleContactFormFields.Email]}
                  helperText={errors[SingleContactFormFields.Email]?.message}
                  inputProps={{ 'data-testid': 'AddSingleContactForm.Email' }}
                />
              )}
            />
          </Box>

          <Box ml={1} width="236">
            <Controller
              control={control}
              name={SingleContactFormFields.Company}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Company"
                  variant="outlined"
                  error={!!errors[SingleContactFormFields.Company]}
                  helperText={errors[SingleContactFormFields.Company]?.message}
                  inputProps={{ 'data-testid': 'AddSingleContactForm.Company' }}
                />
              )}
            />
          </Box>
        </Box>

        <Box pt={0.5} ml={2}>
          <Button
            type="submit"
            color="inherit"
            className={isValid ? 'Body-Regular-Center-Link-Bold' : ''}
            disabled={isSaving || !isValid}
            startIcon={isSaving && <Icon spin icon="spinner" color="inherit" />}
          >
            Add recipient
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Box>
      </Box>
    </form>
  );
};

export default AddSingleRecipientForm;
