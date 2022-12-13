import React, { memo } from 'react';

import { TGroup } from '../../../types';

import Team from './Team';

export interface IGroupTeamsProps {
  group: TGroup;
  isExpanded: boolean;
}

const GroupTeams = ({ group, isExpanded }: IGroupTeamsProps) =>
  isExpanded ? (
    <>
      {group.teams.map(team => (
        <Team team={team} group={group} isExpandedByDefault={group.teams.length === 1} key={`team-id-${team.teamId}`} />
      ))}
    </>
  ) : null;

export default memo(GroupTeams);
