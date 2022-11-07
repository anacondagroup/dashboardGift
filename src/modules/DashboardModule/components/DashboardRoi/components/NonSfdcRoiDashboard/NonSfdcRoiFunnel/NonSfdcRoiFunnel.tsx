import React from 'react';
import { Card, CardContent } from '@mui/material';

import { AcceptedGiftsByCampaignPurposeChart } from '../../Shared/RoiCharts';

const NonSfdcRoiFunnel = (): JSX.Element => (
  <Card>
    <CardContent>
      <AcceptedGiftsByCampaignPurposeChart />
    </CardContent>
  </Card>
);

export default NonSfdcRoiFunnel;
