import React from 'react';
import { Switch, Route } from 'react-router-dom';

import CreateStandardCampaignPage from './CreateStandardCampaignPage/CreateStandardCampaignPage';
import EditStandardCampaignPage from './EditStandardCampaignPage/EditStandardCampaignPage';
import { StandardCampaignRoutes } from './routePaths';

const StandardCampaignModule = (): JSX.Element => (
  <Switch>
    <Route exact path={StandardCampaignRoutes.creatorPath} component={CreateStandardCampaignPage} />
    <Route exact path={StandardCampaignRoutes.editorPath} component={EditStandardCampaignPage} />
  </Switch>
);

export default StandardCampaignModule;
