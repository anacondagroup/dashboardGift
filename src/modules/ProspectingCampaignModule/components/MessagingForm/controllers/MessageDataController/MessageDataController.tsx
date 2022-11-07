import React, { useEffect, useMemo } from 'react';
import { Control, useController, UseFormTrigger } from 'react-hook-form';
import {
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Autocomplete,
  FormControl,
  FormHelperText,
  Box,
  Theme,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { CampaignSettings, CommonData, Messaging } from '@alycecom/modules';
import { LimitInputCharacters } from '@alycecom/ui';

import { TProspectingMessaging } from '../../../../store/prospectingCampaign/prospectingCampaign.types';
import {
  MESSAGE_HEADER_LIMIT,
  MessageDataFields,
  MessagingStepFields,
} from '../../../../store/prospectingCampaign/steps/messaging/messaging.schemas';
import { SFormLabel } from '../../../styled/Styled';
import { getDetailsData } from '../../../../store/prospectingCampaign/steps/details/details.selectors';
import { transformNullableStringValue } from '../../../../store/prospectingCampaign/steps/messaging/messaging.helpers';

export interface IMessageDataControllerProps {
  control: Control<TProspectingMessaging>;
  trigger: UseFormTrigger<TProspectingMessaging>;
}

const styles = {
  templateHelperBox: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  templateHelperLimit: {
    marginTop: ({ spacing }: Theme) => spacing(1),
  },
} as const;

const MessageDataController = ({ control, trigger }: IMessageDataControllerProps): JSX.Element => {
  const { teamId } = useSelector(getDetailsData) || {};
  const bodyCharsLimit = useSelector(CommonData.selectors.getEmailCharLimit);

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
  const { field: overrideField } = useController({
    control,
    name: `${MessagingStepFields.MessageData}.${MessageDataFields.Override}` as const,
  });

  const {
    useAll: useAllTeamTemplates,
    isPending: isTeamTemplatesPending,
  } = CampaignSettings.hooks.useTeamMessageTemplates({ teamId });
  const {
    useAll: useAllUserTemplates,
    isPending: isUserTemplatesPending,
  } = CampaignSettings.hooks.useUserMessageTemplates();
  const teamTemplates = useAllTeamTemplates();
  const userTemplates = useAllUserTemplates();
  const templates = useMemo(() => [...teamTemplates, ...userTemplates], [teamTemplates, userTemplates]);

  const handleSelectTemplateChange = (_: unknown, template: typeof templates[number] | null) => {
    if (template) {
      headerField.onChange(template.subject);
      textField.onChange(template.message);
    }
  };

  useEffect(() => {
    if (overrideField.value === false && !headerField.value && !textField.value) {
      overrideField.onChange(true);
    }
  }, [headerField, textField, overrideField]);
  const isOverrideDisabled = !headerField.value && !textField.value;

  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <SFormLabel>Set default messaging for the email to the recipient & gift redemption page</SFormLabel>
      </Grid>
      <Grid item>
        <Autocomplete
          renderInput={params => <TextField {...params} label="Select Template" variant="outlined" />}
          getOptionLabel={option => option.name}
          groupBy={option => (teamTemplates.includes(option) ? 'Team templates' : 'User templates')}
          loading={isTeamTemplatesPending && isUserTemplatesPending}
          onChange={handleSelectTemplateChange}
          options={templates}
        />
      </Grid>
      <Grid item>
        <FormControl error={!!headerError?.message} fullWidth>
          <Messaging.PlaceholdersTextField
            label="Preview Subject"
            variant="outlined"
            value={transformNullableStringValue.output(headerField.value)}
            onChange={value => {
              headerField.onChange(transformNullableStringValue.input(value));
              if (value === '') {
                trigger(textName);
              }
            }}
            onBlur={headerField.onBlur}
          />
          <Box sx={styles.templateHelperBox}>
            {!!headerError?.message && <FormHelperText>{headerError.message}</FormHelperText>}
            <LimitInputCharacters
              sx={styles.templateHelperLimit}
              value={headerField.value || ''}
              limit={MESSAGE_HEADER_LIMIT}
            />
          </Box>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl fullWidth error={!!textError?.message}>
          <Messaging.PlaceholdersTextField
            label="Preview Body Text"
            multiline
            rows={10}
            variant="outlined"
            value={transformNullableStringValue.output(textField.value)}
            onChange={value => {
              textField.onChange(transformNullableStringValue.input(value));
              if (value === '') {
                trigger(headerName);
              }
            }}
            onBlur={textField.onBlur}
          />
          <Box sx={styles.templateHelperBox}>
            {!!textError?.message && <FormHelperText>{textError.message}</FormHelperText>}
            <LimitInputCharacters
              sx={styles.templateHelperLimit}
              value={textField.value || ''}
              limit={bodyCharsLimit}
            />
          </Box>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControlLabel
          disabled={isOverrideDisabled}
          control={
            <Checkbox
              color="primary"
              onChange={(event, isChecked) => {
                overrideField.onChange(isChecked);
              }}
              checked={overrideField.value}
            />
          }
          label="Allow users to use any template"
        />
      </Grid>
    </Grid>
  );
};

export default MessageDataController;
