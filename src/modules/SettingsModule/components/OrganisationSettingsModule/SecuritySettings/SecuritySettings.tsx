import React, { memo } from 'react';
import { Paper } from '@mui/material';

import DashboardLayout from '../../../../../components/Dashboard/Shared/DashboardLayout';

import ForceSsoSetting from './ForceSsoSetting';
import DomainRestrictionsSetting from './DomainRestrictionsSetting';
import DashboardAccess from './DashboardAccess/DashboardAccess';

const SecuritySettings = (): React.ReactElement => (
  <DashboardLayout>
    <Paper elevation={1}>
      <ForceSsoSetting />
      <DomainRestrictionsSetting />
      <DashboardAccess />
    </Paper>
  </DashboardLayout>
);

export default memo(SecuritySettings);
