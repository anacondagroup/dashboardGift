import React from 'react';
import { Box, CircularProgress, TextField, Typography } from '@mui/material';
import { Button } from '@alycecom/ui';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

const styles = {
  emailField: {
    width: 300,
  },
} as const;

const formatEmail = (email: string) => {
  if (email.length <= 16) {
    return email;
  }
  return `${email.slice(0, 16)}...`;
};

type TSendReportForm = {
  email: string;
};

const popoverFormSchema = object().shape({
  email: string()
    .default('')
    .trim()
    .email('Please provide a properly formatted email')
    .required('Please provide an email'),
});

const popoverFormResolver = yupResolver(popoverFormSchema);

interface ISendReportFormProps {
  isLoading: boolean;
  onSubmit: (formValues: TSendReportForm) => void;
}

const SendReportForm = ({ isLoading, onSubmit }: ISendReportFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = useForm<TSendReportForm>({ mode: 'onChange', defaultValues: { email: '' }, resolver: popoverFormResolver });
  const { ref: emailFieldRef, ...emailField } = register('email');
  const email = watch('email');

  const handleSendReportClick = () => {
    handleSubmit(formValues => {
      onSubmit(formValues);
    })();
  };

  return (
    <>
      <Typography variant="h4">Who should we email to?</Typography>
      <Box my={2}>
        <TextField
          ref={emailFieldRef}
          {...emailField}
          placeholder="Email address"
          variant="outlined"
          sx={styles.emailField}
          disabled={isLoading}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </Box>
      <Button
        variant="contained"
        color="secondary"
        disabled={!isValid || isLoading}
        startIcon={isLoading && <CircularProgress size={20} />}
        onClick={handleSendReportClick}
      >
        Send report {formatEmail(email)}
      </Button>
    </>
  );
};

export default SendReportForm;
