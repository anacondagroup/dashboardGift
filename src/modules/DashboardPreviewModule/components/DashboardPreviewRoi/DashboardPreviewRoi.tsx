import React from 'react';
import { Box } from '@mui/material';

import {
  RoiDashboardHeader,
  RoiWelcomeDialog,
} from '../../../DashboardModule/components/DashboardRoi/components/Shared';

import SfdcRoiReviewReporting from './components/SfdcRoiDashboard/SfdcRoiReporting/SfdcRoiReviewReporting';
import SalesForceModal from './components/SfdcRoiDashboard/SalesforceModal/SalesForceModal';

const DashboardPreviewRoi = (): JSX.Element => (
  <Box>
    <RoiWelcomeDialog />
    <RoiDashboardHeader />
    <SfdcRoiReviewReporting />
    <SalesForceModal />
  </Box>
);

export default DashboardPreviewRoi;
