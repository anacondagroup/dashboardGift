import React, { memo } from 'react';

import { IGroup } from '../../../types';

import Team from './Team';

export interface IGroupTeamsProps {
  group: IGroup;
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
