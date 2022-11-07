import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid } from '@mui/material';
import { User } from '@alycecom/modules';

import DashboardHeader from '../../../../components/Dashboard/Header/DashboardHeader';
import { useBillingTrackEvent } from '../../hooks/useBillingTrackEvent';
import { customerOrgRequest, getOrg, loadHierarchyRequest } from '../../store/customerOrg';
import { loadTypesRequest } from '../../store/operations';

import Operations from './Operations/Operations';
import OrgHierarchy from './OrgHierarchy/OrgHierarchy';

const DepositLedger = () => {
  const dispatch = useDispatch();
  const trackEvent = useBillingTrackEvent();

  const { id: orgId } = useSelector(getOrg);
  const userId = useSelector(User.selectors.getUserId);

  useEffect(() => {
    dispatch(customerOrgRequest());
    dispatch(loadHierarchyRequest());
    dispatch(loadTypesRequest());
  }, [dispatch]);

  useEffect(() => {
    if (orgId && userId) {
      trackEvent('Deposit ledger tab - Viewed');
    }
  }, [trackEvent, orgId, userId]);

  return (
    <>
      <DashboardHeader subHeader="Here’s a list of all deposit changes of your Teams/Groups" />

      <Grid container>
        <Grid item container xs={3}>
          <Box width="100%">
            <OrgHierarchy />
          </Box>
        </Grid>
        <Grid item container xs={9}>
          <Box pl={2} width="100%">
            <Operations />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default memo(DepositLedger);
