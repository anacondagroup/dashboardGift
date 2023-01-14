import moment from 'moment-timezone';

import type { ITeam } from '../store/teams/teams.types';

export const renderTeamLabel = (option: ITeam): string => {
  if (option.archivedAt) {
    return `${option.name} (Archived ${moment(option.archivedAt).format('MM/DD/YYYY')})`;
  }

  return option.name;
};
