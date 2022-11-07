import { makeStyles } from '@mui/styles';
import { AlyceTheme, Icon } from '@alycecom/ui';
import { Box } from '@mui/material';
import React, { memo } from 'react';
import classNames from 'classnames';

import { CAMPAIGN_STATUS } from '../../../../../constants/campaignSettings.constants';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  campaignStatus: {
    fontSize: 12,
    color: palette.primary.main,
    textTransform: 'capitalize',
  },
  statusIcon: {
    marginRight: 8,
    marginTop: 3,
    height: 10,
  },
  activeIcon: {
    color: palette.green.dark,
  },
  draftIcon: {
    color: palette.grey.chambray50,
  },
  expiredIcon: {
    color: palette.red.light,
  },
}));

export interface ICampaignStatusLabelProps {
  campaignStatus: CAMPAIGN_STATUS;
}

const campaignStatusLabelValue = {
  [CAMPAIGN_STATUS.ACTIVE]: 'Active',
  [CAMPAIGN_STATUS.DRAFT]: 'Draft',
  [CAMPAIGN_STATUS.EXPIRED]: 'Expired',
  [CAMPAIGN_STATUS.DISABLED]: 'Expired',
  [CAMPAIGN_STATUS.ARCHIVED]: 'Archived',
};

const CampaignStatusLabel = ({ campaignStatus }: ICampaignStatusLabelProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Box display="flex">
      {campaignStatus !== CAMPAIGN_STATUS.ARCHIVED && (
        <Icon
          icon="circle"
          width={10}
          className={classNames(classes.statusIcon, {
            [classes.activeIcon]: campaignStatus === CAMPAIGN_STATUS.ACTIVE,
            [classes.draftIcon]: campaignStatus === CAMPAIGN_STATUS.DRAFT,
            [classes.expiredIcon]:
              campaignStatus === CAMPAIGN_STATUS.EXPIRED || campaignStatus === CAMPAIGN_STATUS.DISABLED,
          })}
        />
      )}
      <Box className={classes.campaignStatus}>{campaignStatusLabelValue[campaignStatus]}</Box>
    </Box>
  );
};

export default memo(CampaignStatusLabel);
