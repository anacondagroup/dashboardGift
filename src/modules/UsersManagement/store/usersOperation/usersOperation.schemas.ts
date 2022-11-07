import { array, BaseSchema, object, string, ValidationError } from 'yup';

import { ITeam, IUser, UserRoles } from '../usersManagement.types';

export const userAssignTeamsValidation = object().shape({
  teams: array()
    .label('Teams')
    .min(1)
    .when('$users', (users: IUser[], schema: BaseSchema<ITeam[] | undefined>) =>
      schema.test('validate', 'A team needs at least one admin', newTeams => {
        if (newTeams) {
          const lastAdminTeams = users.reduce<ITeam[]>((acc, user) => {
            user.teams.forEach(team => {
              if (team.isLastAdmin) {
                acc.push(team);
              }
            });
            return acc;
          }, []);
          const newTeamsIds = new Set(newTeams.map(team => team.id));
          const removedAdministratedTeam = lastAdminTeams.find(team => !newTeamsIds.has(team.id));
          if (removedAdministratedTeam) {
            return new ValidationError(`${removedAdministratedTeam.name} needs at least one admin`, newTeams, 'teams');
          }
        }
        return true;
      }),
    ),
});

export const editUserValidation = object().shape({
  role: string()
    .label('Access level')
    .required()
    .oneOf([UserRoles.member, UserRoles.admin])
    .when('$user', (user: IUser, schema: BaseSchema<string | undefined>) =>
      schema.test('validate', 'A team needs at least one admin', newRole => {
        if (user.isLastAdmin && newRole !== UserRoles.admin) {
          return false;
        }
        return true;
      }),
    ),
  teams: array()
    .label('Teams')
    .required()
    .min(1, 'Teams is a required field')
    .when('$user', (user: IUser, schema: BaseSchema<ITeam[] | undefined>) =>
      schema.test('validate', 'A team needs at least one admin', newTeams => {
        if (newTeams) {
          const lastAdminTeams = user.teams.filter(team => team.isLastAdmin);
          const newTeamsIds = new Set(newTeams.map(team => team.id));
          const removedAdministratedTeam = lastAdminTeams.find(team => !newTeamsIds.has(team.id));
          if (removedAdministratedTeam) {
            return new ValidationError(`${removedAdministratedTeam.name} needs at least one admin`, newTeams, 'teams');
          }
        }
        return true;
      }),
    ),
});
