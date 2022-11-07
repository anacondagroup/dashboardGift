import React, { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, LimitInputCharacters } from '@alycecom/ui';
import { CampaignSettings } from '@alycecom/modules';

import { IMessageFormValues, MessagingFormFields } from '../../store/steps/messaging/messagingForm.schemas';
import InfoTooltip from '../InfoTooltip';
import { useActivate } from '../../hooks/useActivate';

import MessagingSelectContentSection from './MesagingSelectContentSection/MessagingSelectContentSection';
import CtaSelectSection from './CtaSelectSection/CtaSelectSection';
import GiftLinkExpireMessageSection from './GiftLinkExpireMessageSection';
import RecipientMetaSection from './RecipientMetaSection';

const useStyles = makeStyles<AlyceTheme>(({ spacing }) => ({
  control: {
    marginBottom: spacing(1),
  },

  headerControlWrapper: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginBottom: spacing(1),
  },

  headerExclamationMarkWrapper: {
    position: 'absolute',
    right: spacing(-4),
  },

  list: {
    paddingLeft: 15,
  },

  enableCTAPopUp: {
    marginTop: spacing(1),
    marginLeft: spacing(2),
  },

  useCTARadioBtn: {
    marginTop: spacing(2),
    marginBottom: spacing(3),
  },

  ctaWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: spacing(2),
  },

  landingUrlWrapper: {
    marginLeft: spacing(4),
    width: 468,
  },
}));

const MessagingForm = (): JSX.Element => {
  const classes = useStyles();
  const { campaignId } = useActivate();

  const {
    control,
    formState: { errors },
  } = useFormContext<IMessageFormValues>();

  return (
    <Box display="flex" flexDirection="column" width={792}>
      <Box maxWidth={580}>
        <Controller
          control={control}
          name={MessagingFormFields.PageHeader}
          render={({ field }) => (
            <>
              <Box className={classes.headerControlWrapper}>
                <TextField
                  {...field}
                  label="Header"
                  variant="outlined"
                  required
                  fullWidth
                  error={!!errors[MessagingFormFields.PageHeader]}
                  helperText={errors[MessagingFormFields.PageHeader]?.message}
                  inputProps={{ 'data-testid': 'MessagingCampaignStepper.PageHeader' }}
                />
                <Box className={classes.headerExclamationMarkWrapper}>
                  <InfoTooltip title="Pro-tip: the best subject lines are 6-10 words long and should spark curiosity, lead with a number/statistic or ask a question." />
                </Box>
              </Box>
              <LimitInputCharacters value={field.value} limit={70} />
            </>
          )}
        />
      </Box>

      <Box maxWidth={580} display="flex" flexDirection="column">
        <Typography className="Body-Regular-Left-Static-Bold">
          Landing Page Content <span>*</span>
        </Typography>
        <MessagingSelectContentSection campaignId={campaignId as number} control={control} />
      </Box>

      <CampaignSettings.StyledSectionTitle mt={5} mb={3}>
        Post-Acceptance Call to Action (CTA)
      </CampaignSettings.StyledSectionTitle>
      <Box maxWidth={580}>
        <CtaSelectSection control={control} />
      </Box>

      <GiftLinkExpireMessageSection maxWidth={580} mt={3} control={control} />
      <RecipientMetaSection maxWidth={580} mt={3} control={control} />
    </Box>
  );
};

export default memo(MessagingForm);
