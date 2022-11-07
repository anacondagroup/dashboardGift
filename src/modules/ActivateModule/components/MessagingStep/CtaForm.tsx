import { Controller, useFormContext } from 'react-hook-form';
import { Box, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, LimitInputCharacters, TextAreaField } from '@alycecom/ui';
import React, { memo } from 'react';

import { MessagingFormFields, RedemptionPopUpFields } from '../../store/steps/messaging/messagingForm.schemas';

const useStyles = makeStyles<AlyceTheme>(() => ({
  control: {
    marginBottom: 7,
  },

  header: {
    marginTop: 13,
    marginBottom: 47,
    display: 'flex',
    flexDirection: 'column',
  },

  container: {
    marginLeft: 30,
    width: 468,
  },
}));

interface ICtaFormProps {
  parentField: MessagingFormFields;
}

const CtaForm = ({ parentField }: ICtaFormProps): JSX.Element => {
  const classes = useStyles();
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const getFullControlName = (name: RedemptionPopUpFields) => `${parentField}.${name}`;
  const getControlError = (name: RedemptionPopUpFields) => errors[parentField] && errors[parentField][name];

  return (
    <Box className={classes.container}>
      <Controller
        control={control}
        name={getFullControlName(RedemptionPopUpFields.Header)}
        render={({ field }) => (
          <Box className={classes.header}>
            <TextField
              {...field}
              label="CTA header"
              variant="outlined"
              error={!!getControlError(RedemptionPopUpFields.Header)}
              helperText={getControlError(RedemptionPopUpFields.Header)?.message}
              className={classes.control}
              inputProps={{ 'data-testid': 'MessagingCampaignStepper.RedemptionHeader' }}
            />
            <LimitInputCharacters value={field.value} limit={50} />
          </Box>
        )}
      />
      <Controller
        control={control}
        name={getFullControlName(RedemptionPopUpFields.Message)}
        render={({ field }) => (
          <Box className={classes.header}>
            <TextAreaField
              {...field}
              label="CTA body"
              variant="outlined"
              fullWidth
              rows={6}
              error={!!getControlError(RedemptionPopUpFields.Message)}
              helperText={getControlError(RedemptionPopUpFields.Message)?.message}
              className={classes.control}
              inputProps={{ 'data-testid': 'MessagingCampaignStepper.RedemptionMessage' }}
            />
            <LimitInputCharacters value={field.value} limit={300} />
          </Box>
        )}
      />
      <Controller
        control={control}
        name={getFullControlName(RedemptionPopUpFields.ButtonLabel)}
        render={({ field }) => (
          <Box className={classes.header}>
            <TextField
              {...field}
              label="CTA button copy"
              variant="outlined"
              error={!!getControlError(RedemptionPopUpFields.ButtonLabel)}
              helperText={getControlError(RedemptionPopUpFields.ButtonLabel)?.message}
              className={classes.control}
              inputProps={{ 'data-testid': 'MessagingCampaignStepper.RedemptionButton' }}
            />
            <LimitInputCharacters value={field.value} limit={20} />
          </Box>
        )}
      />
    </Box>
  );
};

export default memo(CtaForm);
