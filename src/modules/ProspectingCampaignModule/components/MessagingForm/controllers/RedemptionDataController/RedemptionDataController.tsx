import React, { useEffect } from 'react';
import { Control, useController, Controller } from 'react-hook-form';
import { Box, Checkbox, Collapse, FormControlLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material';

import {
  RedemptionAfterClaimAction,
  TProspectingMessaging,
} from '../../../../store/prospectingCampaign/prospectingCampaign.types';
import { SFormControl, SFormLabel } from '../../../styled/Styled';
import {
  MessagingStepFields,
  RedemptionDataFields,
} from '../../../../store/prospectingCampaign/steps/messaging/messaging.schemas';
import { RedemptionPopUpFields } from '../../../../../ActivateModule/store/steps/messaging/messagingForm.schemas';

export interface IRedemptionDataControllerProps {
  control: Control<TProspectingMessaging>;
}

const RedemptionDataController = ({ control }: IRedemptionDataControllerProps): JSX.Element => {
  const { field: afterClaimField } = useController({
    control,
    name: `${MessagingStepFields.RedemptionData}.${RedemptionDataFields.AfterClaimAction}` as const,
  });
  const { field: enablePopupField } = useController({
    control,
    name: `${MessagingStepFields.RedemptionData}.${RedemptionDataFields.RedemptionPopupEnabled}` as const,
  });
  const { field: redemptionPopupField } = useController({
    control,
    name: `${MessagingStepFields.RedemptionData}.${RedemptionDataFields.RedemptionPopup}` as const,
  });
  const { field: afterClaimRedirectField } = useController({
    control,
    name: `${MessagingStepFields.RedemptionData}.${RedemptionDataFields.AfterClaimRedirectUrl}` as const,
  });

  const { onChange: onEnablePopupFieldChange, value: onEnablePopupFieldValue } = enablePopupField;
  const { value: afterClaimFieldValue } = afterClaimField;
  const { onChange: onAfterClaimRedirectFieldChange } = afterClaimRedirectField;
  useEffect(() => {
    if (afterClaimFieldValue === RedemptionAfterClaimAction.NoCta) {
      onEnablePopupFieldChange(false);
      onAfterClaimRedirectFieldChange(null);
    }
  }, [afterClaimFieldValue, onEnablePopupFieldChange, onAfterClaimRedirectFieldChange]);

  useEffect(() => {
    if (!onEnablePopupFieldValue) {
      redemptionPopupField.onChange(null);
    }
  }, [onEnablePopupFieldValue, redemptionPopupField]);

  return (
    <SFormControl>
      <SFormLabel>Do you want to redirect the recipient to another page once they have claimed their gift?</SFormLabel>
      <RadioGroup value={afterClaimField.value} onChange={afterClaimField.onChange}>
        <FormControlLabel
          value={RedemptionAfterClaimAction.NoCta}
          control={<Radio color="primary" />}
          label="No Redirect"
        />
        <FormControlLabel
          value={RedemptionAfterClaimAction.Redirect}
          control={<Radio color="primary" />}
          label="Redirect to a specific landing page"
        />
        <Collapse in={afterClaimField.value === RedemptionAfterClaimAction.Redirect} mountOnEnter unmountOnExit>
          <Box ml={4}>
            <Grid component={Box} py={3} container spacing={3} direction="column">
              <Grid item>
                <Controller
                  control={control}
                  name={`${MessagingStepFields.RedemptionData}.${RedemptionDataFields.AfterClaimRedirectUrl}` as const}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      variant="outlined"
                      label="Landing Page"
                      error={!!error?.message}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={enablePopupField.value}
                      onChange={(_, checked) => enablePopupField.onChange(checked)}
                    />
                  }
                  label="Enable Call-to-action pop-up before redirect (recipient will have the option to click through) "
                />
              </Grid>
            </Grid>
            <Collapse in={enablePopupField.value} mountOnEnter unmountOnExit>
              <Grid container spacing={3} direction="column">
                <Grid item>
                  <Controller
                    control={control}
                    name={
                      `${MessagingStepFields.RedemptionData}.${RedemptionDataFields.RedemptionPopup}.${RedemptionPopUpFields.Header}` as const
                    }
                    shouldUnregister
                    render={({ field: { value, ...field }, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        value={value || ''}
                        fullWidth
                        variant="outlined"
                        label="Popup Header"
                        error={!!error?.message}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item>
                  <Controller
                    control={control}
                    name={
                      `${MessagingStepFields.RedemptionData}.${RedemptionDataFields.RedemptionPopup}.${RedemptionPopUpFields.Message}` as const
                    }
                    shouldUnregister
                    render={({ field: { value, ...field }, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        value={value || ''}
                        multiline
                        rows={5}
                        fullWidth
                        variant="outlined"
                        label="Popup Message"
                        error={!!error?.message}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item>
                  <Controller
                    control={control}
                    name={
                      `${MessagingStepFields.RedemptionData}.${RedemptionDataFields.RedemptionPopup}.${RedemptionPopUpFields.ButtonLabel}` as const
                    }
                    shouldUnregister
                    render={({ field: { value, ...field }, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        value={value || ''}
                        fullWidth
                        variant="outlined"
                        label="Popup Button Label"
                        error={!!error?.message}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Collapse>
          </Box>
        </Collapse>
      </RadioGroup>
    </SFormControl>
  );
};

export default RedemptionDataController;
