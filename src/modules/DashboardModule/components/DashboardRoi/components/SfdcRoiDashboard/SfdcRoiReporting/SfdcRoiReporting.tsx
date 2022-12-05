import React from 'react';
import { Grid } from '@mui/material';
import { Redirect, Route, Switch } from 'react-router-dom';

import SfdcPipelineSummary from '../SfdcPipelineSummary/SfdcPipelineSummary';
import { ROI_ROOT, ROI_ROUTES } from '../../../routePaths';

import SfdcRoiInfluencedARR from './SfdcRoiInfluencedArr/SfdcRoiInfluencedArr';
import SfdcInfluencedAccountTable from './SfdcInfluencedAccountTable/SfdcInfluencedAccountTable';
import GiftsByAccountTable from './GiftsByAccountTable/GiftsByAccountTable';

const SfdcRoiReporting = (): JSX.Element => (
  <Grid container spacing={5} direction="column">
    <Grid item>
      <SfdcPipelineSummary />
    </Grid>
    <Grid item>
      <SfdcRoiInfluencedARR />
    </Grid>
    <Grid item>
      <Switch>
        <Route exact path={ROI_ROUTES.REPORTING} component={SfdcInfluencedAccountTable} />
        <Route exact path={`${ROI_ROUTES.REPORTING}/:accountId/accepted-gifts`} component={GiftsByAccountTable} />
        <Redirect from="*" to={`/${ROI_ROOT}`} />
      </Switch>
    </Grid>
  </Grid>
);

export default SfdcRoiReporting;
