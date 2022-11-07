import React, { memo, ReactElement } from 'react';
import { Tab, TabProps, Box, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { AlyceTheme } from '@alycecom/ui';

export interface ITabLInkProps extends Omit<TabProps, 'component' | 'label'> {
  to: string;
  label: string;
  badge?: string;
  showUntil?: string;
  component?: ReactElement;
}

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  chip: {
    marginLeft: spacing(1),
    backgroundColor: palette.green.main,
    color: palette.primary.main,
    lineHeight: 1,
    fontWeight: 500,
  },
  tab: {
    minWidth: 136,
  },
}));

const TabLink = ({ label, badge, showUntil, ...tabProps }: ITabLInkProps) => {
  const classes = useStyles();
  const now = moment();
  const isVisible = showUntil ? moment(showUntil).isAfter(now) : false;
  const labelContent =
    badge && isVisible ? (
      <Box display="flex" alignItems="center">
        {label}
        <Chip className={classes.chip} size="small" label={badge} />
      </Box>
    ) : (
      label
    );
  return <Tab component={Link} label={labelContent} classes={{ root: classes.tab }} {...tabProps} />;
};

export default memo(TabLink);
