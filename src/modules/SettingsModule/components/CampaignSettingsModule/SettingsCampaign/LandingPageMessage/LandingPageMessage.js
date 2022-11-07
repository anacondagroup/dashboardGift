import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, Typography } from '@mui/material';
import { ActionButton, ModalConfirmationMessage } from '@alycecom/ui';
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import useLandingPageSettings from '../../../../hooks/useLandingPageSettings';

const getHelperText = (value, limit, error) => {
  const letterCount = value ? value.length : 0;
  const helperText = error || `You have ${limit - letterCount} characters left (${letterCount} out of ${limit})`;

  return (
    <Box
      component="span"
      style={{ display: 'inline-block' }}
      width={1}
      textAlign="right"
      className={!error && limit > letterCount ? 'Body-Small-Success' : 'Body-Small-Error'}
    >
      {helperText}
    </Box>
  );
};

const HEADER_LIMIT = 70;
const MESSAGE_LIMIT = 560;

const headerLengthRule = string().required().trim().max(HEADER_LIMIT);

const messageLengthRule = string().required().trim().max(MESSAGE_LIMIT);

const landingPageValidationSchema = object().shape({
  header: headerLengthRule,
  message: messageLengthRule,
});

export const LandingPageMessage = ({ campaignId }) => {
  const { settings, errors, isLoading, onSave } = useLandingPageSettings(campaignId);
  const [showConfirmationLandingPage, setShowConfirmationLandingPage] = useState(false);

  const {
    watch,
    register,
    reset,
    handleSubmit,
    formState: { isValid, isDirty },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(landingPageValidationSchema),
  });
  const headerField = register('header');
  const messageField = register('message');

  useEffect(() => {
    reset({
      header: settings.header,
      message: settings.message,
    });
  }, [settings, reset]);

  const submitConfirmationLandingPage = useCallback(
    ({ message, header }) => {
      setShowConfirmationLandingPage(false);
      onSave({ message, header });

      reset({
        message,
        header,
      });
    },
    [reset, onSave, setShowConfirmationLandingPage],
  );

  const isSaveDisabled = isLoading || !isValid || !isDirty;

  return (
    <>
      <Box>
        <Box mb={-1} className="Label-Table-Left-Active">
          YOUR LANDING PAGE HEADER
        </Box>
        <Box style={{ maxWidth: 580 }}>
          <TextField
            inputRef={headerField.ref}
            {...headerField}
            fullWidth
            helperText={getHelperText(watch('header'), HEADER_LIMIT, errors.header)}
            variant="outlined"
            placeholder="Landing page header"
            margin="normal"
            name="header"
            error={!!errors.header}
            errors={errors}
          />
        </Box>
      </Box>
      <Box mt={4}>
        <Box mb={-1} className="Label-Table-Left-Active">
          YOUR LANDING PAGE MESSAGE
        </Box>
        <TextField
          inputRef={messageField.ref}
          {...messageField}
          rows="7"
          helperText={getHelperText(watch('message'), MESSAGE_LIMIT, errors.message)}
          placeholder="Landing page message"
          variant="outlined"
          margin="normal"
          multiline
          name="message"
          error={!!errors.message}
          fullWidth
        />
      </Box>

      <ActionButton
        data-testid="LandingPageMessage-ActionButton"
        width={100}
        onClick={() => {
          setShowConfirmationLandingPage(true);
        }}
        disabled={isSaveDisabled}
      >
        Save
      </ActionButton>

      <ModalConfirmationMessage
        title="Are you sure?"
        icon="copy"
        submitButtonText="Yes, continue"
        cancelButtonText="No, don't continue"
        backdropStyles={{ top: 0 }}
        width="100%"
        isOpen={showConfirmationLandingPage}
        onSubmit={handleSubmit(submitConfirmationLandingPage)}
        onDiscard={() => {
          setShowConfirmationLandingPage(false);
        }}
      >
        <Typography className="Body-Regular-Left-Static" data-testid="confirmationLandingPageText">
          Only recipients who have not yet viewed their gift will see this change
        </Typography>
      </ModalConfirmationMessage>
    </>
  );
};

LandingPageMessage.propTypes = {
  campaignId: PropTypes.number.isRequired,
};
