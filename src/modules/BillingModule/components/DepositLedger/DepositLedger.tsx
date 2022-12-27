import React, { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Paper } from '@mui/material';
import { User } from '@alycecom/modules';
import { useGetOrganizationQuery } from '@alycecom/services';

import { useBillingTrackEvent } from '../../hooks/useBillingTrackEvent';

import Transactions from './Transactions';
import Filters from './Filters';
import Overview from './Overview';

const styles = {
  overviewWrapper: {
    width: 1,
    px: 2,
    py: 3,
  },
} as const;

const DepositLedger = () => {
  const trackEvent = useBillingTrackEvent();

  const { data: organization } = useGetOrganizationQuery();
  const orgId = organization?.id;

  const userId = useSelector(User.selectors.getUserId);

  useEffect(() => {
    if (orgId && userId) {
      trackEvent('Deposit ledger tab - Viewed');
    }
  }, [trackEvent, orgId, userId]);

  return (
    <Grid container>
      <Grid item container xs={12}>
        <Paper sx={styles.overviewWrapper} elevation={4}>
          <Filters />
          <Overview />
        </Paper>
      </Grid>
      <Grid item container xs={12}>
        <Transactions />
      </Grid>
    </Grid>
  );
};

export default memo(DepositLedger);
