import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { CampaignSettings } from '@alycecom/modules';

import { ProspectingCampaignRoutes } from './routePaths';
import { CreateProspectingCampaignPage } from './pages/CreateProspectingCampaignPage';
import { EditProspectingCampaignPage } from './pages/EditProspectingCampaignPage';

const ProspectingCampaignModule = (): JSX.Element => (
  <CampaignSettings.BuilderThemeProvider theme="green">
    <Switch>
      <Route exact path={ProspectingCampaignRoutes.builderPath} component={CreateProspectingCampaignPage} />
      <Route exact path={ProspectingCampaignRoutes.editorPath} component={EditProspectingCampaignPage} />
    </Switch>
  </CampaignSettings.BuilderThemeProvider>
);

export default ProspectingCampaignModule;
