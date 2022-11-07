import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { CampaignSettings } from '@alycecom/modules';

import { SwagCampaignRoutes } from './routePaths';
import { CreateSwagCampaignPage } from './pages/CreateSwagCampaignPage';

const SwagCampaignModule = (): JSX.Element => (
  <CampaignSettings.BuilderThemeProvider theme="chambray">
    <Switch>
      <Route exact path={SwagCampaignRoutes.builderPath} component={CreateSwagCampaignPage} />
    </Switch>
  </CampaignSettings.BuilderThemeProvider>
);

export default SwagCampaignModule;
