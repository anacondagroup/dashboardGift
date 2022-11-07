import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { DynamicBreadcrumbsProvider } from '@alycecom/ui';
import { useSelector } from 'react-redux';
import { User, safeLazy } from '@alycecom/modules';

import HasPermission from '../../../hoc/HasPermission/HasPermission';
import { PermissionKeys } from '../../../constants/permissions.constants';
import usePermissions from '../../../hooks/usePermissions';

import CampaignSettingsModule from './CampaignSettingsModule/CampaignSettingsModule';
import TeamSettingsModule from './TeamSettingModule/TeamSettingModule';
import OrganisationSettingsModule from './OrganisationSettingsModule/OrganisationSettingsModule';
import CreateCampaignSidebar from './CampaignSettingsModule/CreateCampaignSidebar/CreateCampaignSidebar';
import PersonalSettingsModule from './PersonalSettingsModule/PersonalSettingsModule';
import SettingsLayout from './SettingsLayout/SettingsLayout';

const BillingChunk = safeLazy(() => import('../../BillingModule'));

const SettingsModule = (): JSX.Element => {
  const permissions = usePermissions();
  const isOrgAdmin = permissions.includes(PermissionKeys.OrganisationAdmin);
  const canEditTeams = permissions.includes(PermissionKeys.EditTeams);
  const hasDashboardAccess = permissions.includes(PermissionKeys.DashboardAccess);
  const listManageTeams = useSelector(User.selectors.getUserCanManageTeams);
  const isEnabledAdminTeams = listManageTeams.length > 0;
  const allowRedirectToUsersAndTeamsTab = isEnabledAdminTeams && canEditTeams && hasDashboardAccess;

  const getDefaultPath = () => {
    if (isOrgAdmin && hasDashboardAccess) {
      return '/settings/organization/general/settings';
    }
    if (allowRedirectToUsersAndTeamsTab) {
      return '/settings/teams/users-management/users';
    }
    return '/settings/common/personal/profile';
  };

  return (
    <DynamicBreadcrumbsProvider>
      <CreateCampaignSidebar />
      <SettingsLayout>
        <Route exact path="/settings" render={() => <Redirect to={getDefaultPath()} />} />
        <Route
          path="/settings/common"
          render={({ match: { url: commonParentUrl } }) => <PersonalSettingsModule parentUrl={commonParentUrl} />}
        />
        <Route path="/settings/billing" component={BillingChunk} />
        <HasPermission permissionKey={[PermissionKeys.EditTeams, PermissionKeys.DashboardAccess]}>
          <Route path="/settings/campaigns" render={() => <CampaignSettingsModule parentUrl="/settings/campaigns" />} />
        </HasPermission>
        <HasPermission permissionKey={PermissionKeys.DashboardAccess}>
          <Route path="/settings/teams" render={() => <TeamSettingsModule parentUrl="/settings/teams" />} />
        </HasPermission>
        <HasPermission permissionKey={[PermissionKeys.OrganisationAdmin, PermissionKeys.DashboardAccess]}>
          <Route
            path="/settings/organization"
            render={({ match: { url: commonParentUrl } }) => <OrganisationSettingsModule parentUrl={commonParentUrl} />}
          />
        </HasPermission>
      </SettingsLayout>
    </DynamicBreadcrumbsProvider>
  );
};

export default SettingsModule;
