import React, { memo } from 'react';
import { useScrollTop } from '@alycecom/hooks';

import CampaignsManagement from './CampaignsManagement/CampaignsManagement';

const DashboardCampaigns = (): JSX.Element => {
  useScrollTop();

  return <CampaignsManagement />;
};

export default memo(DashboardCampaigns);
