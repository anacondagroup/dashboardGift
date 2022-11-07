import React, { useEffect } from 'react';
import { Control, useController, Controller } from 'react-hook-form';
import { FormControlLabel, RadioGroup, Radio, Collapse, TextField, Box, Checkbox } from '@mui/material';
import { EmbedVideoTip } from '@alycecom/ui';

import {
  TProspectingMessaging,
  MessageVideoType,
} from '../../../../store/prospectingCampaign/prospectingCampaign.types';
import { SFormControl, SFormLabel } from '../../../styled/Styled';
import {
  MessagingStepFields,
  VideoDataEmbedFields,
  VideoDataFields,
} from '../../../../store/prospectingCampaign/steps/messaging/messaging.schemas';

import VidyardField from './fields/VidyardField';

export interface IVideoDataControllerProps {
  control: Control<TProspectingMessaging>;
}

const VideoDataController = ({ control }: IVideoDataControllerProps): JSX.Element => {
  const { field: typeField } = useController({
    control,
    name: `${MessagingStepFields.VideoData}.${VideoDataFields.Type}` as const,
  });
  const {
    field: { onChange: onVidyardChange },
  } = useController({
    control,
    name: `${MessagingStepFields.VideoData}.${VideoDataFields.Vidyard}` as const,
  });
  const {
    field: { onChange: onEmbedChange },
  } = useController({
    control,
    name: `${MessagingStepFields.VideoData}.${VideoDataFields.Embed}` as const,
  });

  const { value: typeFieldValue } = typeField;
  useEffect(() => {
    if (typeFieldValue !== MessageVideoType.Vidyard) {
      onVidyardChange(null);
    }
    if (typeFieldValue !== MessageVideoType.Embed) {
      onEmbedChange(null);
    }
  }, [typeFieldValue, onVidyardChange, onEmbedChange]);

  return (
    <SFormControl>
      <SFormLabel>Do you want to embed video content into the landing page?</SFormLabel>
      <RadioGroup value={typeField.value || ''} onChange={event => typeField.onChange(event.target.value || null)}>
        <FormControlLabel value="" control={<Radio color="primary" />} label="No video" />
        <FormControlLabel
          value={MessageVideoType.Vidyard}
          control={<Radio color="primary" />}
          label="Add or record a Vidyard video"
        />
        <Collapse in={typeField.value === MessageVideoType.Vidyard} mountOnEnter unmountOnExit>
          <VidyardField control={control} />
        </Collapse>
        <FormControlLabel
          value={MessageVideoType.Embed}
          control={<Radio color="primary" />}
          label="Embed a video link"
        />
        <Collapse in={typeField.value === MessageVideoType.Embed} mountOnEnter unmountOnExit>
          <Box display="flex" flexDirection="column" ml={4}>
            <Controller
              name={
                `${MessagingStepFields.VideoData}.${VideoDataFields.Embed}.${VideoDataEmbedFields.VideoUrl}` as const
              }
              shouldUnregister
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Set default landing page video (URL)"
                  variant="outlined"
                  error={!!error?.message}
                  helperText={error?.message}
                />
              )}
            />
            <Box mt={1}>
              <EmbedVideoTip display="flex" justifyContent="flex-start" alignItems="flex-start" />
            </Box>
          </Box>
        </Collapse>
      </RadioGroup>
      <Box mt={5}>
        <Controller
          control={control}
          name={`${MessagingStepFields.VideoData}.${VideoDataFields.Override}` as const}
          render={({ field: { value, onChange } }) => (
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  onChange={(event, isChecked) => {
                    onChange(isChecked);
                  }}
                  checked={value}
                />
              }
              label="Allow team members to override these video settings with their own video content?"
            />
          )}
        />
      </Box>
    </SFormControl>
  );
};

export default VideoDataController;
