import React, { memo } from 'react';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';
import { Box, Grid, Typography } from '@mui/material';

import AppBarLayout from '../../../../components/Dashboard/Shared/AppBarLayout';
import SettingsTabsSidebar from '../SettingsTabsSidebar/SettingsTabsSidebar';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  root: {
    padding: 0,
    minHeight: '95vh',
  },
  sideBar: {
    minWidth: 250,
    borderRight: `1px solid ${palette.divider}`,
  },
  sidebarWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginLeft: spacing(3),
    marginTop: spacing(5),
  },
  sidebarHeader: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: '28px',
    color: palette.primary.main,
  },
  content: {
    width: 'calc(100% - 215px)',
    backgroundColor: palette.common.white,
  },
}));

export interface ISettingsLayout {
  children: React.ReactNode;
}

const SettingsLayout = ({ children }: ISettingsLayout): JSX.Element => {
  const classes = useStyles();

  return (
    <AppBarLayout disabledGutters>
      <Grid container direction="row" className={classes.root} wrap="nowrap" data-testid="SettingsLayout">
        <Grid item className={classes.sideBar}>
          <Box className={classes.sidebarWrapper}>
            <Typography className={classes.sidebarHeader}>Settings</Typography>
            <SettingsTabsSidebar />
          </Box>
        </Grid>
        <Grid item className={classes.content}>
          {children}
        </Grid>
      </Grid>
    </AppBarLayout>
  );
};

export default memo(SettingsLayout);
