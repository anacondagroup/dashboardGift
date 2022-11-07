import React from 'react';
import { SelectFilter } from '@alycecom/ui';
import { Box, Checkbox, Collapse, FormControlLabel, MenuItem, TextField } from '@mui/material';
import { Controller, useWatch, Control } from 'react-hook-form';
import { CampaignSettings } from '@alycecom/modules';

import { PostGiftActions } from '../../../store/steps/messaging/messaging.types';
import { IMessageFormValues, MessagingFormFields } from '../../../store/steps/messaging/messagingForm.schemas';
import CtaForm from '../CtaForm';

export interface CtaSelectSectionProps {
  control: Control<IMessageFormValues>;
}
const styles = {
  landingUrlWrapper: {
    width: '468px',
  },
} as const;

const CtaSelectSection = ({ control }: CtaSelectSectionProps): JSX.Element => {
  const contentOptions = [
    {
      label: 'No CTA',
      value: PostGiftActions.NoCta,
    },
    {
      label: 'Redirect to a specific landing page',
      value: PostGiftActions.Redirect,
    },
  ];

  const enableCTA = useWatch({ name: MessagingFormFields.ShowGiftRedemptionPopUp, control });
  const postGiftAction = useWatch({ name: MessagingFormFields.PostGiftAction, control });
  const landingPageUrl = useWatch({ name: MessagingFormFields.PostGiftRedirect, control });

  return (
    <>
      <CampaignSettings.StyledFormLabel>
        Do you want a follow-up CTA after a recipient has claimed their gift?
      </CampaignSettings.StyledFormLabel>
      <Box mt={2}>
        <Controller
          control={control}
          name={MessagingFormFields.PostGiftAction}
          render={({ field: { onChange, value } }) => (
            <SelectFilter
              label=""
              name="postGiftAction"
              value={value}
              fullWidth
              onFilterChange={({ postGiftAction: selected }) => onChange(selected)}
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

        <Collapse in={postGiftAction === PostGiftActions.Redirect} unmountOnExit>
          <Box mt={2} mb={2} ml={4}>
            <Controller
              control={control}
              name={MessagingFormFields.PostGiftRedirect}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Landing Page URL"
                  variant="outlined"
                  error={!!error}
                  helperText={error?.message}
                  sx={styles.landingUrlWrapper}
                  inputProps={{ 'data-testid': 'MessagingCampaignStepper.PostGiftRedirect' }}
                  onChange={(inputValue: { target: { value: string } }) => {
                    field.onChange(inputValue);
                  }}
                />
              )}
            />
            <FormControlLabel
              label="Enable CTA pop-up"
              className="Body-Regular-Left-Static"
              control={
                <Controller
                  name={MessagingFormFields.ShowGiftRedemptionPopUp}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      disabled={!landingPageUrl}
                      color="primary"
                      checked={field.value || false}
                      onChange={e => field.onChange(e.target.checked)}
                    />
                  )}
                />
              }
            />
            <Collapse in={enableCTA} unmountOnExit>
              <CtaForm parentField={MessagingFormFields.RedemptionPopUp} />
            </Collapse>
          </Box>
        </Collapse>
      </Box>
    </>
  );
};

export default CtaSelectSection;
