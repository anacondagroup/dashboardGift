import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Box, TextField } from '@mui/material';
import { ActionButton } from '@alycecom/ui';
import { applyEach } from '@alycecom/utils';
import { useForm } from 'react-hook-form';

import { selectors } from '../../../../store/teams/generalSettings';

const TeamNameForm = ({ onSubmit }) => {
  const isLoading = useSelector(selectors.getIsLoading);
  const teamName = useSelector(selectors.getTeamName);
  const error = useSelector(useMemo(() => selectors.getErrorByProp('teamName'), []));

  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty, errors },
    setError,
    reset,
  } = useForm({
    mode: 'all',
    defaultValues: {
      teamName,
    },
  });
  const teamNameField = register('teamName');
  const isSubmitDisabled = isLoading || !isValid || !isDirty;

  useEffect(() => {
    if (error) {
      setError('teamName', {
        type: 'manual',
        message: error,
      });
    }
  }, [error, setError]);

  return (
    <Box
      component="form"
      width={{ sm: 1, md: 1 / 2, lg: 1 / 4 }}
      mt={2}
      onSubmit={handleSubmit(applyEach([onSubmit, reset]))}
    >
      <TextField
        inputRef={teamNameField.ref}
        {...teamNameField}
        fullWidth
        name="teamName"
        variant="outlined"
        label="What's the name of your team?"
        error={!!errors.teamName}
        helperText={errors.teamName && errors.teamName.message}
      />
      <Box mt={2}>
        <ActionButton type="submit" disabled={isSubmitDisabled}>
          Save
        </ActionButton>
      </Box>
    </Box>
  );
};

TeamNameForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default TeamNameForm;
