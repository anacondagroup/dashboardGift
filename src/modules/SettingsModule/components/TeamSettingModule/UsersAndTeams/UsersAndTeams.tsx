import React, { memo, Suspense } from 'react';
import { Box, Tab, Tabs, Toolbar } from '@mui/material';
import { Route } from 'react-router-dom';
import { useRouting } from '@alycecom/hooks';
import { safeLazy } from '@alycecom/modules';
import { Divider } from '@alycecom/ui';

import TeamListTable from '../SettingsTeamsList/TeamListTable/TeamListTable';

const UsersManagementModule = safeLazy(() => import('../../../../UsersManagement'));

export interface IUsersAndTeamsProps {
  url: string;
  parentUrl: string;
  onTeamSelect: (id: number) => void;
}

const styles = {
  wrapper: {
    width: 1,
    p: 2,
  },
} as const;

const UsersAndTeams = ({ url, parentUrl, onTeamSelect }: IUsersAndTeamsProps): JSX.Element => {
  const go = useRouting();
  return (
    <Box mt={3}>
      <Toolbar disableGutters>
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
      </Toolbar>
      <Divider mb={1} />
      <Box sx={styles.wrapper}>
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
    </Box>
  );
};

export default memo(UsersAndTeams);
