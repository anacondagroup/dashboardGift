import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { ROI_ROUTES } from '../../routePaths';

import SfdcRoiFunnel from './SfdcRoiFunnel/SfdcRoiFunnel';
import SfdcRoiReporting from './SfdcRoiReporting/SfdcRoiReporting';

const SfdcRoiDashboard = (): JSX.Element => (
  <Switch>
    <Route exact path={ROI_ROUTES.REPORTING} component={SfdcRoiReporting} />
    <Route exact path={ROI_ROUTES.FUNNEL} component={SfdcRoiFunnel} />
  </Switch>
);

export default SfdcRoiDashboard;
