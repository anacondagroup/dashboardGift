import React from 'react';
import { EmbedVideoTip, LimitInputCharacters, SelectFilter } from '@alycecom/ui';
import { Box, Collapse, MenuItem, TextField } from '@mui/material';
import { Controller, Control, useWatch } from 'react-hook-form';

import { LandingPageContents } from '../../../store/steps/messaging/messaging.types';
import { IMessageFormValues, MessagingFormFields } from '../../../store/steps/messaging/messagingForm.schemas';
import VidyardIntegration from '../VidyardIntegration';

interface IMessagingSelectProps {
  campaignId: number | undefined;
  control: Control<IMessageFormValues>;
}

const MessagingSelectContentSection = ({ campaignId, control }: IMessagingSelectProps): JSX.Element => {
  const contentOptions = [
    {
      label: 'Write a short message',
      value: LandingPageContents.Text,
    },
    {
      label: 'Add or record a Vidyard video',
      value: LandingPageContents.Vidyard,
    },
    {
      label: 'Embed a video link',
      value: LandingPageContents.EmbedVideo,
    },
  ];

  const landingPageContentType = useWatch({ name: MessagingFormFields.LandingPageContentType, control });

  return (
    <>
      <Controller
        control={control}
        name="landingPageContentType"
        render={({ field: { onChange, value } }) => (
          <SelectFilter
            label=""
            name="landingPageContentType"
            value={value}
            fullWidth
            onFilterChange={({ landingPageContentType: selected }) => onChange(selected)}
            renderItems={() =>
              contentOptions.map(option => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  data-testid={option.value}
                  className="Body-Regular-Center-Chambray"
                >
                  {option.label}
                </MenuItem>
              ))
            }
          />
        )}
      />

      <Collapse in={landingPageContentType === LandingPageContents.Text} unmountOnExit>
        <Box display="flex" flexDirection="column" mt={2} ml={4}>
          <Controller
            control={control}
            name={MessagingFormFields.PageBody}
            render={({ field: bodyField, fieldState: { error } }) => (
              <>
                <TextField
                  {...bodyField}
                  variant="outlined"
                  multiline
                  rows={7}
                  error={!!error?.message}
                  helperText={error?.message}
                  inputProps={{ 'data-testid': 'MessagingCampaignStepper.PageBody' }}
                />
                <LimitInputCharacters value={bodyField.value as string} limit={560} />
              </>
            )}
          />
        </Box>
      </Collapse>

      <Collapse in={landingPageContentType === LandingPageContents.Vidyard} unmountOnExit>
        {campaignId && (
          <Controller
            control={control}
            name={MessagingFormFields.Vidyard}
            render={({ field: { value, onChange } }) => (
              <VidyardIntegration campaignId={campaignId} value={value} onChange={onChange} />
            )}
          />
        )}
      </Collapse>

      <Collapse in={landingPageContentType === LandingPageContents.EmbedVideo} unmountOnExit>
        <Box display="flex" flexDirection="column" ml={4} mt={2}>
          <Controller
            control={control}
            name={MessagingFormFields.EmbedVideoUrl}
            render={({ field: embedVideoUrlField, fieldState: { error } }) => (
              <TextField
                {...embedVideoUrlField}
                label="Set default landing page video (URL)"
                variant="outlined"
                error={!!error}
                helperText={error?.message}
                inputProps={{ 'data-testid': 'MessagingCampaignStepper.EmbedVideoURL' }}
              />
            )}
          />
          <Box mt={1}>
            <EmbedVideoTip display="flex" justifyContent="flex-start" alignItems="flex-start" />
          </Box>
        </Box>
      </Collapse>
    </>
  );
};

export default MessagingSelectContentSection;
