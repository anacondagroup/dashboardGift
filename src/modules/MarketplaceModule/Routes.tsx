import React from 'react';
import { RouteChildrenProps, Route, Switch, Redirect } from 'react-router-dom';

import AppBarLayout from '../../components/Dashboard/Shared/AppBarLayout';

import CampaignMarketplace from './components/CampaignMarketplace';
import CustomMarketplace from './components/CustomMarketplace';
import { MARKETPLACE_ROUTES } from './routePaths';

const MarketplaceRoutes = ({ match }: RouteChildrenProps): JSX.Element => {
  const parentUrl = match?.url ?? '/';
  return (
    <AppBarLayout disabledGutters>
      <Switch>
        <Route path={`${parentUrl}${MARKETPLACE_ROUTES.CAMPAIGN_PATH}`} component={CampaignMarketplace} />
        <Route path={`${parentUrl}${MARKETPLACE_ROUTES.CUSTOM_PATH}`} component={CustomMarketplace} />
        <Route path={parentUrl} render={() => <Redirect to={MARKETPLACE_ROUTES.buildCampaignPath()} />} />
      </Switch>
    </AppBarLayout>
  );
};

export default MarketplaceRoutes;
