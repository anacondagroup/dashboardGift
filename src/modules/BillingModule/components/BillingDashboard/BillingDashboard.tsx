import React, { memo, useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toolbar, Tabs, Tab, Paper, Box, Typography } from '@mui/material';
import { Divider } from '@alycecom/ui';
import { User } from '@alycecom/modules';

import { acceptedInvitesRequest, sentInvitesRequest } from '../../store/breakdowns';
import {
  customerOrgRequest,
  getOrg,
  loadLastInvoiceRequest,
  loadResourcesRequest,
  loadStatsRequest,
} from '../../store/customerOrg';
import { getGroupsListRequest } from '../../store/billingGroups';
import { useBillingTrackEvent } from '../../hooks/useBillingTrackEvent';
import TabPanel from '../../../../components/AppBar/TabPanel';
import DepositLedger from '../DepositLedger/DepositLedger';

import { BillingGroupSidebar } from './BillingGroups/BillingGroupSidebar';
import BillingGroups from './BillingGroups/BillingGroups';
import Overview from './Overview/Overview';

const tabProps = (index: number) => ({
  id: `manage-billing-tab-${index}`,
  'aria-controls': `manage-billing-tabpanel-${index}`,
});

const tabsList = ['Overview', 'Billing groups', 'Deposit Ledger'];

const BillingDashboard = () => {
  const dispatch = useDispatch();
  const trackEvent = useBillingTrackEvent();

  const { id: orgId, name: orgName } = useSelector(getOrg);
  const userId = useSelector(User.selectors.getUserId);

  const [value, setValue] = useState(0);

  const handleChangeTab = useCallback(
    (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
      trackEvent(`Manage billing - ${tabsList[newValue]} - Viewed`);
    },
    [trackEvent],
  );

  useEffect(() => {
    dispatch(customerOrgRequest());
    dispatch(loadStatsRequest());
    dispatch(loadResourcesRequest());
    dispatch(loadLastInvoiceRequest());
    dispatch(sentInvitesRequest());
    dispatch(acceptedInvitesRequest());
    dispatch(getGroupsListRequest({ isSearching: false }));
  }, [dispatch]);

  useEffect(() => {
    if (orgId && userId) {
      trackEvent('Manage billing - Viewed');
    }
  }, [trackEvent, orgId, userId]);

  return (
    <>
      <Box ml={5} mr={5}>
        <Box pt={3} pb={5}>
          <Typography className="H2-Chambray">{`Manage Billing for ${orgName}`}</Typography>
        </Box>

        <Paper elevation={2}>
          <Toolbar>
            <Tabs
              value={value}
              onChange={handleChangeTab}
              aria-label="manage billing tabs"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Overview" {...tabProps(0)} />
              <Tab label="Billing Groups" {...tabProps(1)} />
              <Tab label="Deposit Ledger" {...tabProps(2)} />
            </Tabs>
          </Toolbar>
          <Divider mb={3} />
          <TabPanel value={value} index={0}>
            <Overview />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <BillingGroups />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <DepositLedger />
          </TabPanel>
        </Paper>
      </Box>
      <BillingGroupSidebar />
    </>
  );
};

export default memo(BillingDashboard);
