import React, { memo, useCallback, useEffect } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { Box, Paper, Tab, Tabs, Toolbar } from '@mui/material';
import { Divider } from '@alycecom/ui';
import { Features, User } from '@alycecom/modules';
import { useUnmount } from 'react-use';
import { useGetOrganizationQuery } from '@alycecom/services';

import { acceptedInvitesRequest, sentInvitesRequest } from '../../store/breakdowns';
import { loadLastInvoiceRequest, loadResourcesRequest, loadStatsRequest } from '../../store/customerOrg';
import { getGroupsListRequest } from '../../store/billingGroups';
import { useBillingTrackEvent } from '../../hooks/useBillingTrackEvent';
import TabPanel from '../../../../components/AppBar/TabPanel';
import DepositLedger from '../DepositLedger/DepositLedger';
import BillingOverview from '../BillingOverview';
import { BillingTab, BillingTabName } from '../../store/ui/tab/tab.types';
import { tabsList } from '../../store/ui/tab/tab.constants';
import { getCurrentTab } from '../../store/ui/tab/tab.selectors';
import { setBillingTab } from '../../store/ui/tab/tab.reducer';
import { resetBillingUi } from '../../store/ui/ui.actions';

import { BillingGroupSidebar } from './BillingGroups/BillingGroupSidebar';
import BillingGroups from './BillingGroups/BillingGroups';
import Overview from './Overview/Overview';

const tabProps = (index: number) => ({
  id: `manage-billing-tab-${index}`,
  'aria-controls': `manage-billing-tabpanel-${index}`,
});

const BillingDashboard = () => {
  const dispatch = useDispatch();
  const trackEvent = useBillingTrackEvent();

  const { data: organization } = useGetOrganizationQuery();

  const isUpdatedBillingOverview = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.BILLING_OVERVIEW_2_0));

  const userId = useSelector(User.selectors.getUserId);
  const currentTab = useSelector(getCurrentTab);

  const handleChangeTab = useCallback(
    (event: React.ChangeEvent<{}>, newValue: number) => {
      dispatch(setBillingTab(newValue));
      trackEvent(`Manage billing - ${tabsList[newValue]} - Viewed`);
    },
    [trackEvent, dispatch],
  );

  useEffect(() => {
    batch(() => {
      if (!isUpdatedBillingOverview) {
        dispatch(loadStatsRequest());
        dispatch(loadResourcesRequest());
        dispatch(loadLastInvoiceRequest());
        dispatch(sentInvitesRequest());
        dispatch(acceptedInvitesRequest());
        dispatch(getGroupsListRequest({ isSearching: false }));
      }
    });
  }, [dispatch, isUpdatedBillingOverview]);

  useEffect(() => {
    if (organization?.id && userId) {
      trackEvent('Manage billing - Viewed');
    }
  }, [trackEvent, organization, userId]);

  useUnmount(() => dispatch(resetBillingUi()));

  return (
    <>
      <Box ml={5} mr={5}>
        <Paper elevation={2}>
          <Toolbar>
            <Tabs
              value={currentTab}
              onChange={handleChangeTab}
              aria-label="manage billing tabs"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label={BillingTabName.Overview} {...tabProps(BillingTab.Overview)} />
              <Tab label={BillingTabName.BillingGroups} {...tabProps(BillingTab.Groups)} />
              <Tab label={BillingTabName.Transactions} {...tabProps(BillingTab.Transactions)} />
            </Tabs>
          </Toolbar>
          <Divider mb={1} />
          <TabPanel value={currentTab} index={BillingTab.Overview}>
            {isUpdatedBillingOverview ? <BillingOverview /> : <Overview />}
          </TabPanel>
          <TabPanel value={currentTab} index={BillingTab.Groups}>
            <BillingGroups />
          </TabPanel>
          <TabPanel value={currentTab} index={BillingTab.Transactions}>
            <DepositLedger />
          </TabPanel>
        </Paper>
      </Box>
      <BillingGroupSidebar />
    </>
  );
};

export default memo(BillingDashboard);
