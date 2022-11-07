import React, { memo } from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';

import { CAMPAIGN_TYPES } from '../../../../../constants/campaignSettings.constants';
import personalGifting from '../../../../../assets/images/personal_gifting-icon.svg';
import many1 from '../../../../../assets/images/1_ many-icon.svg';
import giftRedemptionCard from '../../../../../assets/images/gift_redemption_card-icon.svg';
import prospecting from '../../../../../assets/images/prospecting-icon.svg';

const useStyles = makeStyles<AlyceTheme>(() => ({
  icon: {
    objectFit: 'contain',
  },
}));

export interface ICampaignTypeLabelProps {
  campaignType: CAMPAIGN_TYPES;
}

const campaignTypeIcon = {
  [CAMPAIGN_TYPES.ACTIVATE]: many1,
  [CAMPAIGN_TYPES.SWAG]: giftRedemptionCard,
  [CAMPAIGN_TYPES.STANDARD]: personalGifting,
  [CAMPAIGN_TYPES.A4M]: many1,
  [CAMPAIGN_TYPES.SWAG_DIGITAL]: giftRedemptionCard,
  [CAMPAIGN_TYPES.SWAG_PHYSICAL]: giftRedemptionCard,
  [CAMPAIGN_TYPES.PROSPECTING]: prospecting,
};

const CampaignTypeLabel = ({ campaignType }: ICampaignTypeLabelProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Box pr={1.125} pt={0.875}>
      <img src={campaignTypeIcon[campaignType]} alt={campaignType} width={30} height={30} className={classes.icon} />
    </Box>
  );
};

export default memo(CampaignTypeLabel);
