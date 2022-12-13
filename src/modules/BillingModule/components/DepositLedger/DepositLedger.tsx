import React, { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import { User } from '@alycecom/modules';
import { useGetOrganizationQuery } from '@alycecom/services';

import { useBillingTrackEvent } from '../../hooks/useBillingTrackEvent';

import Transactions from './Transactions';
import Filters from './Filters';
import Overview from './Overview';

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
        <Filters />
      </Grid>
      <Grid item container xs={12}>
        <Overview />
      </Grid>
      <Grid item container xs={12}>
        <Transactions />
      </Grid>
    </Grid>
  );
};

export default memo(DepositLedger);
