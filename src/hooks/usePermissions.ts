import { useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Auth } from '@alycecom/modules';

import { getPermissions } from '../store/common/permissions/permissions.selectors';

const usePermissions = (): string[] => {
  const permissions = useSelector(getPermissions) as string[];
  const permissionsFromToken = useSelector(Auth.selectors.getAuthAbilities, shallowEqual);

  return useMemo(() => permissions.concat(permissionsFromToken), [permissions, permissionsFromToken]);
};

export default usePermissions;
