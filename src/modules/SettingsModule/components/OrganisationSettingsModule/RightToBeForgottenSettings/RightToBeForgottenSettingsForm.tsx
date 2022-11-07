import React, { InputHTMLAttributes, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useExternalErrors } from '@alycecom/hooks';
import { Icon, ModalConfirmationMessage, Divider } from '@alycecom/ui';

import { actions, selectors, schemas, types } from '../../../store/organisation/rightToBeForgotten';

import { useTrackRightToBeForgottenRequested } from './useTrackRightToBeForgotten';

const formDefaultValues = {
  firstName: '',
  lastName: '',
  choice: undefined,
  email: '',
  complianceAccepted: false,
};

const RightToBeForgottenSettingsForm = (): React.ReactElement => {
  const [isSuccessConfirmationVisible, setSuccessConfirmationVisibility] = useState(false);

  const dispatch = useDispatch();
  const isLoading = useSelector(selectors.getIsLoading);
  const isLoaded = useSelector(selectors.getIsLoaded);
  const externalErrors = useSelector(selectors.getErrors);

  const trackRequested = useTrackRightToBeForgottenRequested();

  const {
    reset,
    handleSubmit,
    register,
    setError,
    control,
    formState: { errors },
  } = useForm<Record<string, unknown>>({
    mode: 'all',
    resolver: yupResolver(schemas.personalRightSettingsFormSchema),
    defaultValues: formDefaultValues,
  });
  const emailField = register('email');
  const firstNameField = register('firstName');
  const lastNameField = register('lastName');

  useExternalErrors(setError, externalErrors);

  useEffect(() => {
    if (isLoaded) {
      reset(formDefaultValues);
      setSuccessConfirmationVisibility(true);
    }
  }, [isLoaded, reset]);

  const onSubmit = useCallback(
    values => {
      dispatch(actions.sendRightToBeForgotten(values));
      trackRequested(values.choice);
    },
    [dispatch, trackRequested],
  );

  return (
    <Box>
      <ModalConfirmationMessage
        variant="success"
        width="100%"
        icon="check"
        isOpen={isSuccessConfirmationVisible}
        title="Your request is processing"
        onSubmit={useCallback(() => setSuccessConfirmationVisibility(false), [])}
        submitButtonText="Got it"
        submitButtonsProps={{ fullWidth: true }}
        backdropStyles={{ top: 0 }}
      >
        And you&apos;re all set! Please note, Alyce may take up to 30 days to process your request and we will email you
        when the process is completed. Thank you for you patience.
      </ModalConfirmationMessage>
      <Grid container component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
        <Grid item xs={12}>
          <Divider mb={2} />
          <Box mb={2} color="grey.main">
            Please use this form to request Personal data restrict / remove
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TextField
            inputRef={emailField.ref}
            {...emailField}
            fullWidth
            name="email"
            label="Email address"
            variant="outlined"
            error={!!errors.email}
            // @ts-ignore
            helperText={errors.email?.message}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            inputRef={firstNameField.ref}
            {...firstNameField}
            fullWidth
            name="firstName"
            label="First name"
            variant="outlined"
            error={!!errors.firstName}
            // @ts-ignore
            helperText={errors.firstName?.message}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            inputRef={lastNameField.ref}
            {...lastNameField}
            fullWidth
            name="lastName"
            label="Last name"
            variant="outlined"
            error={!!errors.lastName}
            // @ts-ignore
            helperText={errors.lastName?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="choice"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControl fullWidth variant="outlined" error={!!errors.choice}>
                <InputLabel id="forgotten-form-select-choice-label">
                  What would you like to do with this recipient&apos;s data?
                </InputLabel>
                <Select
                  id="forgotten-form-select-choice"
                  labelId="forgotten-form-select-choice-label"
                  label="What would you like to do with this recipient's data?"
                  value={value || ''}
                  onChange={onChange}
                >
                  <MenuItem value={types.ForgottenChoice.ForgetData}>
                    Alyce will remove all personal data that it has about the recipient. Only the email will be stored
                    with a timestamp of removal data.
                  </MenuItem>
                  <MenuItem value={types.ForgottenChoice.RestrictProcessing}>
                    Alyce and the 3rd parties will keep recipient’s data. However, there will be no future
                    communication.
                  </MenuItem>
                  <MenuItem value={types.ForgottenChoice.ExportData}>
                    Alyce will export all personal data to a spreadsheet for which Alyce customers may deliver to a
                    consumer.
                  </MenuItem>
                </Select>
                {/* @ts-ignore */}
                <FormHelperText>{errors.choice?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="complianceAccepted"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControl error={!!errors.complianceAccepted}>
                <FormControlLabel
                  // @ts-ignore
                  checked={value}
                  onChange={(event, checked) => onChange(checked)}
                  control={
                    <Checkbox
                      color="primary"
                      inputProps={
                        {
                          'data-testid': 'OrgSettings.ForgottenChoice.ConfirmationCheckbox',
                        } as InputHTMLAttributes<HTMLInputElement>
                      }
                    />
                  }
                  label="I confirm that I want to continue with this action. All requests will be processed within 30 days. Deleted data cannot be recovered."
                />
                {/* @ts-ignore */}
                <FormHelperText>{errors.complianceAccepted?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={6}>
          <Button
            type="submit"
            disabled={isLoading}
            color="secondary"
            variant="contained"
            startIcon={<Icon icon="paper-plane" />}
          >
            Submit request
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RightToBeForgottenSettingsForm;
