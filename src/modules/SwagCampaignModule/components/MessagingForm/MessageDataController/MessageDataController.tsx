import React, { useCallback } from 'react';
import { Control, useController, UseFormTrigger } from 'react-hook-form';
import { Grid, Box, FormHelperText, TextField } from '@mui/material';
import { SFormLabel } from '@alycecom/modules';

import { TSwagMessaging } from '../../../store/swagCampaign/swagCampaign.types';
import { MessageDataFields, MessagingStepFields } from '../../../store/swagCampaign/steps/messaging/messaging.schemas';
import { transformNullableStringValue } from '../../../store/swagCampaign/steps/messaging/messaging.helpers';

export interface IMessageDataControllerProps {
  control: Control<TSwagMessaging>;
  trigger: UseFormTrigger<TSwagMessaging>;
}

const MessageDataController = ({ control, trigger }: IMessageDataControllerProps): JSX.Element => {
  const headerName = `${MessagingStepFields.MessageData}.${MessageDataFields.Header}` as const;
  const textName = `${MessagingStepFields.MessageData}.${MessageDataFields.Message}` as const;

  const {
    field: headerField,
    fieldState: { error: headerError },
  } = useController({
    control,
    name: headerName,
  });

  const {
    field: textField,
    fieldState: { error: textError },
  } = useController({
    control,
    name: textName,
  });

  const handleChangeHeaderText = useCallback(
    (value: string, limit: number) => {
      const letterCount = value.length ?? 0;
      if (letterCount <= limit) {
        headerField.onChange(transformNullableStringValue.input(value));
      }
      if (value === '') {
        trigger(textName);
      }
    },
    [textName, headerField, trigger],
  );

  const handleChangeBodyText = useCallback(
    (value: string, limit: number) => {
      const letterCount = value.length ?? 0;
      if (letterCount <= limit) {
        textField.onChange(transformNullableStringValue.input(value));
      }
      if (value === '') {
        trigger(headerName);
      }
    },
    [headerName, textField, trigger],
  );

  const getHelperText = (value: number, limit: number) => {
    const letterCount = value ?? 0;
    return (
      <Box
        component="span"
        width={1}
        textAlign="right"
        className={limit > letterCount ? 'Body-Small-Success' : 'Body-Small-Error'}
      >
        {`${limit - letterCount} characters left`}
      </Box>
    );
  };

  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <Box pb={2}>
          <SFormLabel>Header*</SFormLabel>
        </Box>
        <TextField
          placeholder="Preview Subject"
          fullWidth
          helperText={getHelperText(headerField.value?.length, 70)}
          variant="outlined"
          value={transformNullableStringValue.output(headerField.value)}
          onChange={event => handleChangeHeaderText(event.target.value, 70)}
          onBlur={headerField.onBlur}
        />
        {!!headerError?.message && <FormHelperText error>{headerError?.message}</FormHelperText>}
      </Grid>
      <Grid item>
        <Box pb={2}>
          <SFormLabel>Landing Page Content*</SFormLabel>
        </Box>
        <TextField
          placeholder="Preview Body Text"
          fullWidth
          multiline
          rows={10}
          helperText={getHelperText(textField.value?.length, 560)}
          variant="outlined"
          value={transformNullableStringValue.output(textField.value)}
          onChange={event => handleChangeBodyText(event.target.value, 560)}
          onBlur={textField.onBlur}
        />
        {!!textError?.message && <FormHelperText error>{textError?.message}</FormHelperText>}
      </Grid>
    </Grid>
  );
};

export default MessageDataController;
