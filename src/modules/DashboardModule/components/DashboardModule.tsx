import React, { memo } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import CreateCampaignSidebar from '../../SettingsModule/components/CampaignSettingsModule/CreateCampaignSidebar/CreateCampaignSidebar';
import AppBarLayout from '../../../components/Dashboard/Shared/AppBarLayout';

import DashboardTeams from './DashboardTeams/DashboardTeams';
import DashboardTeam from './DashboardTeam/DashboardTeam';
import DashboardSingleCampaign from './DashboardSingleCampaign/DashboardSingleCampaign';
import DashboardCampaigns from './DashboardCampaigns/DashboardCampaigns';
import DashboardCampaignMember from './DashboardCampaignMember/DashboardCampaignMember';
import DashboardTeamMember from './DashboardTeamMember/DashboardTeamMember';
import DashboardHome from './DashboardHome/DashboardHome';
import DashboardRoi from './DashboardRoi/DashboardRoi';
import { ROI_ROOT } from './DashboardRoi/routePaths';

type TDashboardModuleProps = RouteComponentProps<{ url: string }>;

const DashboardModule = ({ match: { url: parentUrl } }: TDashboardModuleProps) => (
  <>
    <CreateCampaignSidebar />
    <AppBarLayout>
      <Switch>
        <Route path={`${parentUrl}/`} component={DashboardHome} />
        <Route path={`${parentUrl}${ROI_ROOT}`} component={DashboardRoi} />
        <Route
          path={`${parentUrl}teams`}
          render={({ match }) => (
            <>
              <Route exact path={`${match.url}/`} component={DashboardTeams} />
              <Route
                exact
                path={`${match.url}/:teamId`}
                render={({
                  match: {
                    params: { teamId = '' },
                  },
                }) => <DashboardTeam teamId={parseInt(teamId, 10)} />}
              />
              <Route
                path={`${match.url}/:teamId/members/:memberId`}
                render={({
                  match: {
                    params: { teamId = '', memberId = '' },
                  },
                }) => <DashboardTeamMember teamId={parseInt(teamId, 10)} memberId={parseInt(memberId, 10)} />}
              />
            </>
          )}
        />
        <Route
          path={`${parentUrl}campaigns`}
          render={({ match }) => (
            <>
              <Route exact path={`${match.url}/`} component={DashboardCampaigns} />
              <Route
                exact
                path={`${match.url}/:campaignId`}
                render={({
                  match: {
                    params: { campaignId = '' },
                  },
                }) => {
                  const parsedCampaignId = parseInt(campaignId, 10);
                  const isValidCampaignId = !Number.isNaN(parsedCampaignId);
                  return isValidCampaignId ? (
                    <DashboardSingleCampaign campaignId={parsedCampaignId} />
                  ) : (
                    <Redirect to={`${parentUrl}campaigns`} />
                  );
                }}
              />
              <Route
                path={`${match.url}/:campaignId/members/:memberId`}
                render={({
                  match: {
                    params: { campaignId = '', memberId = '' },
                  },
                }) => (
                  <DashboardCampaignMember campaignId={parseInt(campaignId, 10)} memberId={parseInt(memberId, 10)} />
                )}
              />
            </>
          )}
        />
        <Redirect from="*" to="/" />
      </Switch>
    </AppBarLayout>
  </>
);

export default memo(DashboardModule);
