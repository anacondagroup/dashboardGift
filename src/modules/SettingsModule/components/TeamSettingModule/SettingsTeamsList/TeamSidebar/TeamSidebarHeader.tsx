import React, { memo } from 'react';
import { useSelector } from 'react-redux';

import { getTeamById } from '../../../../store/teams/teams/teams.selectors';

import HeaderContent from './HeaderContent';

export interface ITeamSidebarHeaderProps {
  teamId: number;
  onClose: () => void;
}

const TeamSidebarHeader = ({ teamId, onClose }: ITeamSidebarHeaderProps): JSX.Element => {
  const team = useSelector(getTeamById(teamId));
  const headerText = team ? `Edit ${team.name}` : 'Create a team';

  return <HeaderContent text={headerText} onClose={onClose} />;
};

export default memo(TeamSidebarHeader);
