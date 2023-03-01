import React, { memo } from 'react';

import AppBarLayout from '../../../components/Dashboard/Shared/AppBarLayout';
import CreateCampaignSidebar from '../../SettingsModule/components/CampaignSettingsModule/CreateCampaignSidebar/CreateCampaignSidebar';

import DashboardPreviewRoi from './DashboardPreviewRoi/DashboardPreviewRoi';

const DashboardPreviewModule = () => (
  <>
    <CreateCampaignSidebar />
    <AppBarLayout>
      <DashboardPreviewRoi />
    </AppBarLayout>
  </>
);

export default memo(DashboardPreviewModule);
