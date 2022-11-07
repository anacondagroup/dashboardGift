import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Features, User } from '@alycecom/modules';

import { ROI_ROOT } from '../DashboardRoi/routePaths';

const DashboardHome = (): JSX.Element => {
  const isROIEnabled = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.ROI));
  const defaultTeam = useSelector(User.selectors.getUserDefaultTeam);
  const userId = useSelector(User.selectors.getUserId);
  const isLoading = useSelector(User.selectors.getIsUserLoading);
  const managedTeams = useSelector(User.selectors.getUserCanManageTeams);
  const isPersonalHomePage = defaultTeam && defaultTeam.id && !managedTeams.includes(defaultTeam.id);

  if (isLoading) {
    return <></>;
  }

  if (isROIEnabled) {
    return <Redirect to={`/${ROI_ROOT}`} />;
  }

  if (isPersonalHomePage) {
    return (
      <Redirect
        to={{
          pathname: `/teams/${defaultTeam.id}/members/${userId}`,
          search: window.location.search,
        }}
      />
    );
  }

  return (
    <Redirect
      to={{
        pathname: '/teams',
        search: window.location.search,
      }}
    />
  );
};

export default DashboardHome;
