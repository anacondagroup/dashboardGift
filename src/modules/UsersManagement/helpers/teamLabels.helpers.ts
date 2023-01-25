import { ITeamExtraData } from '../store/usersManagement.types';

export const prepareLabelForTeam = (option: ITeamExtraData): string =>
  option.isAdmin ? option.name : `${option.name} (Available to admin of the team)`;
