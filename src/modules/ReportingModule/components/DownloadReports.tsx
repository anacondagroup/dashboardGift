import React, { memo, useEffect } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';

import reportingSummary from '../../../assets/images/reportingSummary.png';
import throphy from '../../../assets/images/throphy.svg';
import giftBox from '../../../assets/images/giftBox.svg';
import DashboardLayout from '../../../components/Dashboard/Shared/DashboardLayout';
import { fetchReports } from '../store/reporting/reporting.actions';
import {
  GiftingInsights,
  giftingInsightsDetails,
  performanceSummaryDetalils,
  teamUsageDetails,
} from '../store/reporting/reporting.constants';

import ReportCard from './ReportCard';

const DownloadReports = (): JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchReports.pending());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <Box mb={2}>
        <Typography className="H3-Dark">Download Reports</Typography>
      </Box>
      <Paper elevation={1}>
        <Grid container direction="column">
          <ReportCard
            image={reportingSummary}
            stepName={GiftingInsights.performanceSummary}
            details={performanceSummaryDetalils}
          />

          <ReportCard image={throphy} stepName={GiftingInsights.teamUsage} details={teamUsageDetails} />

          <ReportCard image={giftBox} stepName={GiftingInsights.giftingTrends} details={giftingInsightsDetails} />
        </Grid>
      </Paper>
    </DashboardLayout>
  );
};

export default memo(DownloadReports);
