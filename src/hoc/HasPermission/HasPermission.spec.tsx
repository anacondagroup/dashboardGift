import React from 'react';

import { cleanup } from '@testing-library/react';

import HasPermission, { IHasPermissionProps } from './HasPermission';
import { PermissionKeys } from '../../constants/permissions.constants';
import { render } from '../../testUtils';
import usePermissions from '../../hooks/usePermissions';

jest.mock('../../hooks/usePermissions');
const mockedUsePermissions = usePermissions as jest.Mock;

describe('HasPermission', () => {
  beforeEach(() => {
    mockedUsePermissions.mockReset();
  });

  afterEach(cleanup);

  const setup = (props: Omit<IHasPermissionProps, 'children'>) =>
    render(
      <HasPermission {...props}>
        <div>Permissions granted</div>
      </HasPermission>,
    );

  it('should render children if key is permitted', () => {
    mockedUsePermissions.mockReturnValue([PermissionKeys.EditTeams]);
    const { getByText } = setup({ permissionKey: PermissionKeys.EditTeams });

    expect(getByText('Permissions granted')).toBeInTheDocument();
  });

  it('should not render content if provided permission key is NOT permitted', () => {
    mockedUsePermissions.mockReturnValue([PermissionKeys.EditCampaigns, PermissionKeys.DashboardAccess]);
    const { queryByText } = setup({ permissionKey: PermissionKeys.EditTeams });

    expect(queryByText('Permissions granted')).not.toBeInTheDocument();
  });

  it('should render content if all provided permission keys are permitted', () => {
    const permissions = [PermissionKeys.EditCampaigns, PermissionKeys.DashboardAccess, PermissionKeys.EditTeams];
    mockedUsePermissions.mockReturnValue(permissions);
    const { getByText } = setup({ permissionKey: [PermissionKeys.EditTeams, PermissionKeys.DashboardAccess] });

    expect(getByText('Permissions granted')).toBeInTheDocument();
  });
});
