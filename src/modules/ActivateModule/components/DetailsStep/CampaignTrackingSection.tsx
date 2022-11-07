import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';
import { CampaignSettings, ICampaignPurposeValues } from '@alycecom/modules';
import { useFormContext } from 'react-hook-form';

import flourishes from '../../assets/images/flourishes.png';
import InfoTooltip from '../InfoTooltip';

export type ICampaignTrackingSectionProps = BoxProps;

const useStyles = makeStyles<AlyceTheme>(({ spacing, palette }) => ({
  campaignTracking: {
    width: 451,
    padding: spacing(2, 3),
    borderRadius: 5,
    border: 'solid 1px #8accc5',
    backgroundColor: palette.common.white,
  },
  campaignTrackingIcon: {
    width: 32,
    lineHeight: 32,
    margin: spacing(-1, 1),
  },
}));

const CampaignTrackingSection = ({ ...rootProps }: ICampaignTrackingSectionProps): JSX.Element => {
  const classes = useStyles();
  const {
    control,
    formState: { errors },
  } = useFormContext<ICampaignPurposeValues>();

  // @ts-ignore
  const purposeField = <CampaignSettings.CampaignPurpose control={control} errors={errors} />;

  return (
    <Box {...rootProps} className={classes.campaignTracking}>
      <CampaignSettings.SectionTitle>
        <Box display="flex" alignItems="center">
          <img src={flourishes} className={classes.campaignTrackingIcon} alt="campaign-purposes" />
          CAMPAIGN TRACKING
          <Box ml={1}>
            <InfoTooltip title="We know, we know. Another field. BUT filling these two fields out allows our data science team to crunch some fantastic numbers on your behalf." />
          </Box>
        </Box>
      </CampaignSettings.SectionTitle>
      {purposeField}
    </Box>
  );
};

export default CampaignTrackingSection;
