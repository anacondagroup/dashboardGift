import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Box, TextField } from '@mui/material';
import { ActionButton } from '@alycecom/ui';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { applyEach } from '@alycecom/utils';

import { selectors, schemas } from '../../../../store/teams/generalSettings';

const UnsubscribeLinkForm = ({ onSubmit }) => {
  const isLoading = useSelector(selectors.getIsLoading);
  const outerUnsubscribeUrl = useSelector(selectors.getOuterUnsubscribeUrl);
  const error = useSelector(useMemo(() => selectors.getErrorByProp('outerUnsubscribeUrl'), []));

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setError,
    reset,
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schemas.unsubscribeFormSchema),
    defaultValues: {
      outerUnsubscribeUrl,
    },
  });
  const outerUnsubscribeUrlField = register('outerUnsubscribeUrl');
  const isSubmitDisabled = isLoading || !isValid || !isDirty;

  useEffect(() => {
    if (error) {
      setError('outerUnsubscribeUrl', {
        type: 'manual',
        message: error,
      });
    }
  }, [error, setError]);

  return (
    <Box
      component="form"
      mt={2}
      width={{ sm: 1, md: 1 / 2, lg: 1 / 4 }}
      onSubmit={handleSubmit(applyEach([onSubmit, reset]))}
    >
      <TextField
        inputRef={outerUnsubscribeUrlField.ref}
        {...outerUnsubscribeUrlField}
        fullWidth
        name="outerUnsubscribeUrl"
        variant="outlined"
        label="What is your company's unsubscribe link?"
        error={!!errors.outerUnsubscribeUrl}
        helperText={errors.outerUnsubscribeUrl && errors.outerUnsubscribeUrl.message}
      />
      <Box mt={2}>
        <ActionButton type="submit" disabled={isSubmitDisabled}>
          Save
        </ActionButton>
      </Box>
    </Box>
  );
};

UnsubscribeLinkForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default UnsubscribeLinkForm;
