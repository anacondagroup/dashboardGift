import React, { memo } from 'react';
import { Grid } from '@mui/material';

import Filters from './Filters';
import Overview from './Overview';
import GiftingActivity from './GiftingActivity';

const BillingOverview = (): JSX.Element => (
  <Grid container>
    <Grid item container xs={12}>
      <Filters />
    </Grid>
    <Grid item container xs={12}>
      <Overview />
    </Grid>
    <Grid item container xs={12}>
      <GiftingActivity />
    </Grid>
  </Grid>
);

export default memo(BillingOverview);
