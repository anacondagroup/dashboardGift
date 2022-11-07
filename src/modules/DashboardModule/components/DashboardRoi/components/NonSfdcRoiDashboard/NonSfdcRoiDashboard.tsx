import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { ROI_ROUTES } from '../../routePaths';

import NonSfdcRoiReporting from './NonSfdcRoiReporting/NonSfdcRoiReporting';
import NonSfdcRoiFunnel from './NonSfdcRoiFunnel/NonSfdcRoiFunnel';

const NonSfdcRoiDashboard = (): JSX.Element => (
  <Switch>
    <Route exact path={ROI_ROUTES.FUNNEL} component={NonSfdcRoiFunnel} />
    <Route path={ROI_ROUTES.REPORTING} component={NonSfdcRoiReporting} />
  </Switch>
);

export default NonSfdcRoiDashboard;
