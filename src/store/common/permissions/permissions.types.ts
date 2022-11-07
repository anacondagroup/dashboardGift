import { PermissionKeys } from '../../../constants/permissions.constants';

export type TPermissions = PermissionKeys[];

export interface IPermissionsResponse {
  success: boolean;
  permissions: TPermissions;
}
