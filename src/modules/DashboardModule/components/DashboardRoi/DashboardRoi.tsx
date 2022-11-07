import React from 'react';
import { Box } from '@mui/material';
import { useGetOrganizationSettingsQuery } from '@alycecom/services';
import { useSelector } from 'react-redux';
import { Features } from '@alycecom/modules';
import { Redirect } from 'react-router-dom';

import { useRoiDashboardProtector } from './hooks';
import { RoiDashboardHeader } from './components/Shared';
import SfdcRoiDashboard from './components/SfdcRoiDashboard/SfdcRoiDashboard';
import NonSfdcRoiDashboard from './components/NonSfdcRoiDashboard/NonSfdcRoiDashboard';
import { RoiWelcomeDialog } from './components/Shared/RoiWelcomeDialog';

const DashboardRoi = (): JSX.Element => {
  const { data, isSuccess: isOrganizationSettingsFulfilled } = useGetOrganizationSettingsQuery();
  const { isLoaded, isSalesforceConnected } = useRoiDashboardProtector();
  const isRoiEnabled = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.ROI));
  const isSFAppEnabled = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.SALES_FORCE_APP_ACCESS));
  const isSfdcRoiDashboardHidden = data?.exclude_salesforce_roi ?? true;
  const isSfdcRoiDashboard = isSFAppEnabled && isSalesforceConnected && !isSfdcRoiDashboardHidden;

  if (!isRoiEnabled) {
    return <Redirect to="/" />;
  }

  if (!isLoaded || !isOrganizationSettingsFulfilled) {
    return <></>;
  }

  return (
    <Box>
      <RoiWelcomeDialog />
      <RoiDashboardHeader />
      {isSfdcRoiDashboard ? <SfdcRoiDashboard /> : <NonSfdcRoiDashboard />}
    </Box>
  );
};

export default DashboardRoi;
