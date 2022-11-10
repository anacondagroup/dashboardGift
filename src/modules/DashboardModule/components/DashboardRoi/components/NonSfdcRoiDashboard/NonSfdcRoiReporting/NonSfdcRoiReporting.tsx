import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ROI_ROUTES } from '../../../routePaths';

import InfluencedAccountsTable from './InfluencedAccountsTable/InfluencedAccountsTable';
import GiftsByEmailDomainTable from './GiftsByEmailDomainTable/GiftsByEmailDomainTable';

const NonSfdcRoiReporting = (): JSX.Element => (
  <Switch>
    <Route exact path={ROI_ROUTES.REPORTING} component={InfluencedAccountsTable} />
    <Route exact path={`${ROI_ROUTES.REPORTING}/:emailDomain/accepted-gifts`} component={GiftsByEmailDomainTable} />
  </Switch>
);

export default NonSfdcRoiReporting;
