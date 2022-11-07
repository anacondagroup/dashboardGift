import React, { useMemo } from 'react';

import usePermissions from '../../hooks/usePermissions';
import { PermissionKeys } from '../../constants/permissions.constants';

export interface IHasPermissionProps {
  children: React.ReactNode;
  permissionKey: PermissionKeys | PermissionKeys[];
}

const hasPermission = (permissions: string[], permissionKey: PermissionKeys | PermissionKeys[]): boolean => {
  if (typeof permissionKey === 'string') {
    return permissions.includes(permissionKey);
  }
  return permissionKey.every(permission => permissions.includes(permission));
};

const HasPermission = ({ children, permissionKey }: IHasPermissionProps): JSX.Element | null => {
  const permissions = usePermissions();
  const isPermissionsGranted = useMemo(() => hasPermission(permissions, permissionKey), [permissions, permissionKey]);

  return isPermissionsGranted ? <>{children}</> : null;
};

export default HasPermission;
