import { PermissionKeys, UserRoles } from '../../../constants/permissions.constants';

import { TPermissions } from './permissions.types';

export const getUserRole = (permissions: TPermissions): UserRoles => {
  const isOrgAdmin = permissions.includes(PermissionKeys.OrganisationAdmin);
  const canEditTeams = permissions.includes(PermissionKeys.EditTeams);
  const memberOrTeamAdminRole = canEditTeams ? UserRoles.Admin : UserRoles.Member;
  return isOrgAdmin ? UserRoles.OrgAdmin : memberOrTeamAdminRole;
};
