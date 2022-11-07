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
  },
  content: {
    width: 'calc(100% - 215px)',
    padding: spacing(2),
    backgroundColor: palette.common.white,
  },
  dashboardLayout: {
    padding: 0,
  },
}));

export interface ISettingsLayout {
  children: React.ReactNode;
}

const SettingsLayout = ({ children }: ISettingsLayout): JSX.Element => {
  const classes = useStyles();

  return (
    <AppBarLayout classes={{ dashboardLayout: classes.dashboardLayout }}>
      <Grid container direction="row" className={classes.root} wrap="nowrap" data-testid="SettingsLayout">
        <Grid item className={classes.sideBar}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            flexDirection="column"
            ml={3}
            mt={5}
          >
            <Typography className="H2-Chambray">Settings</Typography>
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
