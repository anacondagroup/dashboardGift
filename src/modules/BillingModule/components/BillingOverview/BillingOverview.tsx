import React, { memo } from 'react';
import { Grid, Paper } from '@mui/material';

import Filters from './Filters';
import Overview from './Overview';
import GiftingActivity from './GiftingActivity';

const styles = {
  overviewWrapper: {
    width: 1,
    px: 2,
    py: 3,
  },
} as const;

const BillingOverview = (): JSX.Element => (
  <Grid container>
    <Grid item container xs={12}>
      <Paper sx={styles.overviewWrapper} elevation={4}>
        <Filters />
        <Overview />
      </Paper>
    </Grid>
    <Grid item container xs={12}>
      <GiftingActivity />
    </Grid>
  </Grid>
);

export default memo(BillingOverview);
