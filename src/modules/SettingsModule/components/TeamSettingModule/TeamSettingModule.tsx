import React, { useCallback, memo } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { Route, Redirect } from 'react-router-dom';

import SettingsAndPermissions from './SettingsAndPermissions/SettingsAndPermissions';
import UsersAndTeams from './UsersAndTeams/UsersAndTeams';

export interface ITeamSettingsProps {
  parentUrl: string;
}

const TeamSettings = ({ parentUrl }: ITeamSettingsProps): JSX.Element => {
  const dispatch = useDispatch();

  const onTeamSelect = useCallback(teamId => dispatch(push(`${parentUrl}/${teamId}`)), [dispatch, parentUrl]);

  const renderUsersAndTeams = useCallback(
    ({ location: { pathname } }) => <UsersAndTeams parentUrl={parentUrl} url={pathname} onTeamSelect={onTeamSelect} />,
    [onTeamSelect, parentUrl],
  );

  const renderRedirectToSettingsAndPermission = useCallback(
    ({ match: { params } }) => <Redirect to={`${parentUrl}/${params.teamId}/settings-and-permissions/general`} />,
    [parentUrl],
  );

  const renderSettingsAndPermission = useCallback(
    ({ match: { params, url }, location }) => (
      <SettingsAndPermissions parentUrl={url} url={location.pathname} teamId={params.teamId} />
    ),
    [],
  );

  return (
    <>
      <Route exact path={[parentUrl, `${parentUrl}/users-management/users`]} render={renderUsersAndTeams} />
      <Route exact path={`${parentUrl}/:teamId`} render={renderRedirectToSettingsAndPermission} />
      <Route path={`${parentUrl}/:teamId/settings-and-permissions`} render={renderSettingsAndPermission} />
    </>
  );
};

export default memo(TeamSettings);
