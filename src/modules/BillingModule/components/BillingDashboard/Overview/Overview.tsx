import React, { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid } from '@mui/material';
import { DateRangeSelect, Divider } from '@alycecom/ui';

import { acceptedInvitesRequest, getSentFilters, sentInvitesRequest, setFilters } from '../../../store/breakdowns';
import { loadLastInvoiceRequest, loadResourcesRequest, loadStatsRequest } from '../../../store/customerOrg';
import { useBillingTrackEvent } from '../../../hooks/useBillingTrackEvent';
import BreakdownAcceptedGifts from '../BreakdownAcceptedGifts/BreakdownAcceptedGifts';
import BreakdownSentInvites from '../BreakdownSentInvites/BreakdownSentInvites';
import BreakdownHeader from '../BillingTableBreakdown/BreakdownHeader';
import EmailReport from '../../EmailReport/EmailReport';
import BillingOverview from '../BillingOverview/BillingOverview';
import TeamsFilter from '../TeamsFilter/TeamsFilter';
import DepositOverview from '../DepositOverview/DepositOverview';
import { BILLING_DATA_MIN_DATE } from '../../../constants/billing.constants';

const Overview = (): JSX.Element => {
  const dispatch = useDispatch();
  const trackEvent = useBillingTrackEvent();

  useEffect(() => {
    dispatch(loadStatsRequest());
    dispatch(loadResourcesRequest());
    dispatch(loadLastInvoiceRequest());
    dispatch(sentInvitesRequest());
    dispatch(acceptedInvitesRequest());
  }, [dispatch]);

  const filters = useSelector(getSentFilters);
  const handleChangeFilters = useCallback(
    newFilters => {
      dispatch(setFilters(newFilters));
      trackEvent('Billing insights - Filter changed', { filters: newFilters });
    },
    [dispatch, trackEvent],
  );

  return (
    <>
      <Box mb={8}>
        <Grid container item direction="row" justifyContent="flex-start" alignItems="center" spacing={2} xs={12}>
          <Grid item xs={3}>
            <TeamsFilter />
          </Grid>
          <Grid item xs={3}>
            <DateRangeSelect
              from={filters.from}
              to={filters.to}
              onChange={handleChangeFilters}
              format="YYYY-MM-DDTHH:mm:ss[Z]"
              dataTestId="BillingInsight.Overview.DateRange"
              minDate={BILLING_DATA_MIN_DATE}
            />
          </Grid>
          <Grid container item justifyContent="flex-end" xs={6}>
            <EmailReport />
          </Grid>
        </Grid>
      </Box>

      <Grid container item xs={12}>
        <Grid item xs={6}>
          <Box mb={4}>
            <DepositOverview />

            <Box ml={4}>
              <Box mt={2} mb={2} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <BillingOverview />
        </Grid>
      </Grid>

      <Grid container item xs={12}>
        <Grid item xs={6}>
          <Grid item xs={10}>
            <Box mt={8}>
              <Box mt={2}>
                <Grid item xs={12}>
                  <BreakdownHeader title="Invite Activity" subtitle="" />
                  <Box pr={3}>
                    <Divider />
                  </Box>
                </Grid>
              </Box>
              <Box mt={1}>
                <BreakdownSentInvites />
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid item xs={10}>
            <Box mt={8}>
              <Box mt={2}>
                <Grid item xs={12}>
                  <BreakdownHeader title="Gifts-Accepted Activity" subtitle="" />
                  <Box pr={3}>
                    <Divider />
                  </Box>
                </Grid>
              </Box>
              <Box mt={1}>
                <BreakdownAcceptedGifts />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default memo(Overview);
