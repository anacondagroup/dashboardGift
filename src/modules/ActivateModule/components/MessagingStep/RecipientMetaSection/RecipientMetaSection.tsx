import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Box, BoxProps, FormHelperText } from '@mui/material';
import { CampaignSettings, Messaging } from '@alycecom/modules';
import { LimitInputCharacters } from '@alycecom/ui';

import {
  IMessageFormValues,
  MessagingFormFields,
  RecipientMetaFields,
} from '../../../store/steps/messaging/messagingForm.schemas';
import { SFormControl, SFormLabel } from '../../../../ProspectingCampaignModule/components/styled/Styled';
import { recipientMetaPlaceholders } from '../../../constants/placeholders.constants';

export interface IGiftLinkExpireMessageSectionProps extends BoxProps {
  control: Control<IMessageFormValues>;
}

const RecipientMetaSection = ({ control, ...boxProps }: IGiftLinkExpireMessageSectionProps): JSX.Element => (
  <CampaignSettings.CollapsibleSectionTitle mt={5} title={<Box>Gift Hyperlink Description</Box>}>
    <Box {...boxProps}>
      <Controller
        control={control}
        name={`${MessagingFormFields.RecipientMeta}.${RecipientMetaFields.Header}` as const}
        render={({ field, fieldState }) => (
          <SFormControl fullWidth error={!!fieldState.error?.message}>
            <SFormLabel error={!!fieldState.error?.message}>Header</SFormLabel>
            <Messaging.PlaceholdersTextField
              placeholders={recipientMetaPlaceholders}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
            <Box display="flex" flexDirection="row">
              {fieldState.error && <FormHelperText>{fieldState.error?.message}</FormHelperText>}
              <LimitInputCharacters mt={1} value={field.value} limit={55} flexGrow={1} width="auto" />
            </Box>
          </SFormControl>
        )}
      />
      <Controller
        control={control}
        name={`${MessagingFormFields.RecipientMeta}.${RecipientMetaFields.Description}` as const}
        render={({ field, fieldState }) => (
          <SFormControl fullWidth error={!!fieldState.error?.message}>
            <SFormLabel>Description</SFormLabel>
            <Messaging.PlaceholdersTextField
              placeholders={recipientMetaPlaceholders}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              multiline
              rows={3}
            />
            <Box display="flex" flexDirection="row">
              {fieldState.error && <FormHelperText>{fieldState.error?.message}</FormHelperText>}
              <LimitInputCharacters mt={1} value={field.value} limit={250} flexGrow={1} width="auto" />
            </Box>
          </SFormControl>
        )}
      />
    </Box>
  </CampaignSettings.CollapsibleSectionTitle>
);

export default RecipientMetaSection;
