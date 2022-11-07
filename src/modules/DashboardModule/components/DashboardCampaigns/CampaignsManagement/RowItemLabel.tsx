import React, { memo } from 'react';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';
import { Chip } from '@mui/material';
import classNames from 'classnames';

import { CAMPAIGN_STATUS } from '../../../../../constants/campaignSettings.constants';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  activeBadge: {
    color: palette.green.dark,
    borderColor: palette.green.dark,
  },
  draftBadge: {
    color: palette.grey.chambray50,
    borderColor: palette.grey.chambray50,
  },
  expiredBadge: {
    color: palette.red.light,
    borderColor: palette.red.light,
  },
  badge: {
    marginLeft: spacing(1.5),
    backgroundColor: 'transparent',
    height: spacing(2.25),
    borderWidth: '2px',
    borderStyle: 'solid',
    fontSize: '12px',
  },
}));

const rowItemLabelValue = {
  [CAMPAIGN_STATUS.ACTIVE]: 'Active',
  [CAMPAIGN_STATUS.DRAFT]: 'Draft',
  [CAMPAIGN_STATUS.EXPIRED]: 'Expired',
  [CAMPAIGN_STATUS.DISABLED]: 'Expired',
};

export interface IRowItemLabel {
  campaignStatus: CAMPAIGN_STATUS;
}

const RowItemLabel = ({ campaignStatus }: IRowItemLabel): JSX.Element => {
  const classes = useStyles();
  return campaignStatus !== CAMPAIGN_STATUS.ARCHIVED ? (
    <Chip
      size="small"
      label={rowItemLabelValue[campaignStatus]}
      className={classNames(classes.badge, {
        [classes.activeBadge]: campaignStatus === CAMPAIGN_STATUS.ACTIVE,
        [classes.draftBadge]: campaignStatus === CAMPAIGN_STATUS.DRAFT,
        [classes.expiredBadge]:
          campaignStatus === CAMPAIGN_STATUS.EXPIRED || campaignStatus === CAMPAIGN_STATUS.DISABLED,
      })}
    />
  ) : (
    <></>
  );
};

export default memo(RowItemLabel);
