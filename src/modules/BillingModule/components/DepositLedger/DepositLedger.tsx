import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { Grid } from '@mui/material';
import { User } from '@alycecom/modules';

import { useBillingTrackEvent } from '../../hooks/useBillingTrackEvent';
import { customerOrgRequest, getOrg, loadHierarchyRequest } from '../../store/customerOrg';
import { loadTypesRequest } from '../../store/operations';

import Operations from './Operations/Operations';
import Filters from './Filters';
import Overview from './Overview';

const DepositLedger = () => {
  const dispatch = useDispatch();
  const trackEvent = useBillingTrackEvent();

  const { id: orgId } = useSelector(getOrg);
  const userId = useSelector(User.selectors.getUserId);

  useEffect(() => {
    batch(() => {
      dispatch(customerOrgRequest());
      dispatch(loadHierarchyRequest());
      dispatch(loadTypesRequest());
    });
  }, [dispatch]);

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
        <Operations />
      </Grid>
    </Grid>
  );
};

export default memo(DepositLedger);
