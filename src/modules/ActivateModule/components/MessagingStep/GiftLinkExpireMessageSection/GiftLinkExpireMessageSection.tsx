import React, { MouseEvent } from 'react';
import { Control, Controller, useFormContext } from 'react-hook-form';
import { Box, BoxProps, FormHelperText, Link } from '@mui/material';
import { CampaignSettings, Messaging } from '@alycecom/modules';
import { LimitInputCharacters } from '@alycecom/ui';
import {
  useGetActivateCampaignPreviewLinksQuery,
  useGetDraftActivateCampaignPreviewLinksQuery,
} from '@alycecom/services';
import { skipToken } from '@reduxjs/toolkit/query';

import {
  ExpirePopupFields,
  IMessageFormValues,
  MessagingFormFields,
} from '../../../store/steps/messaging/messagingForm.schemas';
import { SFormControl, SFormLabel } from '../../../../ProspectingCampaignModule/components/styled/Styled';
import { useActivate } from '../../../hooks/useActivate';
import { useMessaging } from '../../../hooks/useMessaging';
import { giftLinkExpireMessagePlaceholders } from '../../../constants/placeholders.constants';

export interface IGiftLinkExpireMessageSectionProps extends BoxProps {
  control: Control<IMessageFormValues>;
}

const GiftLinkExpireMessageSection = ({ control, ...boxProps }: IGiftLinkExpireMessageSectionProps): JSX.Element => {
  const {
    handleSubmit,
    formState: { isDirty },
  } = useFormContext<IMessageFormValues>();
  const { campaignId, isBuilder } = useActivate();
  const { saveStep } = useMessaging(campaignId);

  const { data: draftPreviewLinks } = useGetDraftActivateCampaignPreviewLinksQuery(
    campaignId && isBuilder ? { draftId: campaignId } : skipToken,
  );
  const { data: activePreviewLinks } = useGetActivateCampaignPreviewLinksQuery(
    campaignId && !isBuilder ? { campaignId } : skipToken,
  );
  const previewLinks = isBuilder ? draftPreviewLinks : activePreviewLinks;

  const handleRecipientExperienceClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handleSubmit(data => {
      if (!isDirty) {
        window.open(previewLinks?.expirePopUpUrl, '__blank');
        return;
      }
      saveStep(data, { openLinkOnSuccess: previewLinks?.expirePopUpUrl ?? '' });
    })();
  };

  return (
    <CampaignSettings.CollapsibleSectionTitle
      mt={5}
      title={
        <Box width={1} display="flex" justifyContent="space-between">
          Gift Link Expire Message
          <Link onClick={handleRecipientExperienceClick} target="__blank" href={previewLinks?.expirePopUpUrl || ''}>
            Expire Message Preview
          </Link>
        </Box>
      }
    >
      <Box {...boxProps}>
        <Controller
          control={control}
          name={`${MessagingFormFields.ExpirePopup}.${ExpirePopupFields.Header}` as const}
          render={({ field, fieldState }) => (
            <SFormControl fullWidth error={!!fieldState.error?.message}>
              <SFormLabel error={!!fieldState.error?.message}>Header</SFormLabel>
              <Messaging.PlaceholdersTextField
                placeholders={giftLinkExpireMessagePlaceholders}
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
          name={`${MessagingFormFields.ExpirePopup}.${ExpirePopupFields.Message}` as const}
          render={({ field, fieldState }) => (
            <SFormControl fullWidth error={!!fieldState.error?.message}>
              <SFormLabel>Message</SFormLabel>
              <Messaging.PlaceholdersTextField
                placeholders={giftLinkExpireMessagePlaceholders}
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
};

export default GiftLinkExpireMessageSection;
