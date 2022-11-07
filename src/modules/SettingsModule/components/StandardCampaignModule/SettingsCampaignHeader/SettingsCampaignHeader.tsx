import React from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';

import { getIsActivate, getIsSwag } from '../../../store/campaign/commonData/commonData.selectors';
import { CAMPAIGN_TYPE_NAMES, CAMPAIGN_TYPES } from '../../../../../constants/campaignSettings.constants';

const useStyles = makeStyles(({ spacing }) => ({
  link: {
    fontSize: '18px',
    paddingLeft: spacing(5),
  },
}));

interface ISettingsCampaignHeaderProps {
  name: string;
}

const SettingsCampaignHeader = ({ name }: ISettingsCampaignHeaderProps): JSX.Element => {
  const classes = useStyles();
  const isSwagCampaign = useSelector(getIsSwag);
  const isActivateCampaign = useSelector(getIsActivate);
  const getCampaignSubTitle = () => {
    if (isActivateCampaign) {
      return 'Activate campaign';
    }
    if (isSwagCampaign) {
      return `${CAMPAIGN_TYPE_NAMES[CAMPAIGN_TYPES.SWAG]} campaign`;
    }
    return `${CAMPAIGN_TYPE_NAMES[CAMPAIGN_TYPES.STANDARD]} campaign`;
  };

  return (
    <Box position="relative" pt={6} bgcolor="common.white" display="flex">
      <Link className={classes.link} to="/settings/campaigns">
        &lt; Back
      </Link>
      <Box display="flex" alignItems="center" flexDirection="column" width="85%">
        <Box fontSize="22px" color="text.primary" fontWeight={700}>
          {name}
        </Box>
        <Box fontSize="18px" color="grey.main">
          {getCampaignSubTitle()}
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsCampaignHeader;
