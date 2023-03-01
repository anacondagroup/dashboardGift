import React from 'react';
import { Box } from '@mui/material';
import { useGetOrganizationSettingsQuery } from '@alycecom/services';
import { useSelector } from 'react-redux';
import { Features } from '@alycecom/modules';
import { Redirect } from 'react-router-dom';

import usePermissions from '../../../../hooks/usePermissions';
import { PermissionKeys } from '../../../../constants/permissions.constants';
import { getShowNotificationStatus } from '../../../../store/common/notifications/notifications.selectors';

import { useRoiDashboardProtector } from './hooks';
import { RoiDashboardHeader } from './components/Shared';
import SfdcRoiDashboard from './components/SfdcRoiDashboard/SfdcRoiDashboard';
import NonSfdcRoiDashboard from './components/NonSfdcRoiDashboard/NonSfdcRoiDashboard';
import { RoiWelcomeDialog } from './components/Shared/RoiWelcomeDialog';
import SfdcNotification from './components/SfdcRoiDashboard/SfdcNotification/SfdcNotification';

const DashboardRoi = (): JSX.Element => {
  const { data: orgSettingsData, isSuccess: isOrganizationSettingsFulfilled } = useGetOrganizationSettingsQuery();
  const { isLoaded, isSalesforceConnected } = useRoiDashboardProtector();
  const isRoiEnabled = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.ROI));
  const isSFAppEnabled = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.SALES_FORCE_APP_ACCESS));
  const { status } = useSelector(getShowNotificationStatus);
  const isSfdcRoiDashboardHidden = orgSettingsData?.exclude_salesforce_roi ?? true;
  const isSfdcRoiDashboard = isSFAppEnabled && isSalesforceConnected && !isSfdcRoiDashboardHidden;
  const permissions = usePermissions();
  const isOrgAdmin = permissions.includes(PermissionKeys.OrganisationAdmin);

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
      {status &&
        ((isOrgAdmin && orgSettingsData?.show_update_salesforce_version_cta) ||
          orgSettingsData?.show_salesforce_cta) && <SfdcNotification />}
      {isSfdcRoiDashboard ? <SfdcRoiDashboard /> : <NonSfdcRoiDashboard />}
    </Box>
  );
};

export default DashboardRoi;
