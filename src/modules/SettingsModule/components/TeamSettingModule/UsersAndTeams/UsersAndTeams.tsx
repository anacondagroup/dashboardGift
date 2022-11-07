import React, { memo, Suspense } from 'react';
import { Box, Paper, Tab, Tabs } from '@mui/material';
import { Route } from 'react-router-dom';
import { useRouting } from '@alycecom/hooks';
import { safeLazy } from '@alycecom/modules';

import DashboardLayout from '../../../../../components/Dashboard/Shared/DashboardLayout';
import TeamListTable from '../SettingsTeamsList/TeamListTable/TeamListTable';

const UsersManagementModule = safeLazy(() => import('../../../../UsersManagement'));

export interface IUsersAndTeamsProps {
  url: string;
  parentUrl: string;
  onTeamSelect: (id: number) => void;
}

const UsersAndTeams = ({ url, parentUrl, onTeamSelect }: IUsersAndTeamsProps): JSX.Element => {
  const go = useRouting();
  return (
    <DashboardLayout>
      <Paper elevation={1}>
        <>
          <Tabs value={url} onChange={(event, tabValue) => go(tabValue)} indicatorColor="primary" textColor="primary">
            <Tab
              label={
                <Box display="flex" alignItems="center">
                  Users
                </Box>
              }
              value={`${parentUrl}/users-management/users`}
            />
            <Tab label="Teams" value={parentUrl} />
          </Tabs>
          <Box>
            <Route
              exact
              path={`${parentUrl}/users-management/users`}
              render={() => (
                <Suspense fallback={<div />}>
                  <UsersManagementModule />
                </Suspense>
              )}
            />
            <Route exact path={parentUrl} render={() => <TeamListTable onSelect={onTeamSelect} />} />
          </Box>
        </>
      </Paper>
    </DashboardLayout>
  );
};

export default memo(UsersAndTeams);
