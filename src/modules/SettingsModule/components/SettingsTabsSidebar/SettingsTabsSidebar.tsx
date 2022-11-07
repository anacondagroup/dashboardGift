import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Icon } from '@alycecom/ui';
import { useSelector } from 'react-redux';
import { Features, User } from '@alycecom/modules';
import { Box, Tab, Tabs } from '@mui/material';
import { Link } from 'react-router-dom';

import usePermissions from '../../../../hooks/usePermissions';
import { PermissionKeys } from '../../../../constants/permissions.constants';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  tabsIndicator: {
    width: '100%',
    backgroundColor: palette.primary.superLight,
    borderRadius: 1,
  },
  tabs: {
    marginTop: spacing(4),
    marginRight: spacing(1),
    marginLeft: `-${spacing(3)}`,
    width: 250,
  },
  tab: {
    width: '100%',
    height: 42,
    paddingLeft: spacing(4),
    color: palette.link.main,
    zIndex: 1,
  },
  tabWrapper: {
    justifyContent: 'flex-start',
  },
  tabSelected: {
    color: palette.primary.main,
  },
  subTab: {
    paddingLeft: spacing(3),
  },
}));

export enum SettingsTabs {
  OrganizationGeneral = '/organization/general',
  OrganizationSecurity = '/organization/security',
  OrganizationIntegrations = '/organization/integrations',
  OrganizationDataPrivacy = '/organization/data-privacy-portal',
  Billing = '/billing',
  PersonalProfile = '/common/personal',
  PersonalTemplates = '/common/templates',
  PersonalIntegrations = '/common/integrations',
  PersonalNotifications = '/common/email-notifications',
  Teams = '/teams',
  Campaigns = '/campaigns',
}

const SettingsTabsSidebar = (): JSX.Element => {
  const classes = useStyles();
  const tabsClasses = {
    indicator: classes.tabsIndicator,
    root: classes.tabs,
  };
  const tabClasses = {
    wrapper: classes.tabWrapper,
    root: classes.tab,
    selected: classes.tabSelected,
    textColorSecondary: classes.tabSelected,
  };

  const getSubTabStyle = (isFocusedOn: boolean) => ({
    height: isFocusedOn ? '42px' : '0px',
    minHeight: isFocusedOn ? '48px' : '0px',
    opacity: isFocusedOn ? 1 : 0,
    paddingTop: isFocusedOn ? '12px' : '0px',
    paddingBottom: isFocusedOn ? '12px' : '0px',
    transition: 'all 0.3s ease-out',
  });

  const permissions = usePermissions();

  const isOrgAdmin = permissions.includes(PermissionKeys.OrganisationAdmin);
  const canEditTeams = permissions.includes(PermissionKeys.EditTeams);
  const hasDashboardAccess = permissions.includes(PermissionKeys.DashboardAccess);
  const managedTeams = useSelector(User.selectors.getUserCanManageTeams);
  const canViewPlatformUsage = managedTeams.length > 0;

  const hasAssistSetting = useSelector(useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.ASSIST), []));
  const listManageTeams = useSelector(User.selectors.getUserCanManageTeams);
  const isEnabledAdminTeams = listManageTeams.length > 0;
  const showUsersAndTeamsTab = isEnabledAdminTeams && canEditTeams && hasDashboardAccess;

  const getDefaultTab = () => {
    if (isOrgAdmin && hasDashboardAccess) {
      return SettingsTabs.OrganizationGeneral;
    }
    if (showUsersAndTeamsTab) {
      return SettingsTabs.Teams;
    }
    return SettingsTabs.PersonalProfile;
  };

  const initialTab = Object.values(SettingsTabs).find(value => window.location.pathname.includes(value));
  const [currentTab, setCurrentTab] = useState(initialTab || getDefaultTab());

  const isFocusedOnOrgSettings = currentTab.toString().includes('/organization/');
  const isFocusedOnPersonalSettings = currentTab.toString().includes('/common/');
  const isFocusedOnBillingSettings = currentTab.toString().includes('/billing');

  const handleChanges = useCallback(
    (event: React.ChangeEvent<unknown>, tabValue: SettingsTabs) => setCurrentTab(tabValue),
    [],
  );

  useEffect(() => {
    if (initialTab) {
      setCurrentTab(initialTab);
    }
  }, [initialTab]);

  return (
    <Tabs
      classes={tabsClasses}
      orientation="vertical"
      value={currentTab}
      onChange={handleChanges}
      data-testid="SettingsTabsSidebar"
    >
      {isOrgAdmin && hasDashboardAccess && (
        <Tab
          classes={tabClasses}
          component={Link}
          label={
            <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
              <Box color={isFocusedOnOrgSettings ? 'primary.main' : 'link.main'}>Org Settings</Box>
              <Box>
                <Icon icon={isFocusedOnOrgSettings ? 'angle-up' : 'angle-down'} color="grey.main" />
              </Box>
            </Box>
          }
          value={SettingsTabs.OrganizationGeneral}
          to={`/settings${SettingsTabs.OrganizationGeneral}/settings`}
          data-testid="Settings.OrgSettings"
        />
      )}
      {isOrgAdmin && hasDashboardAccess && (
        <Tab
          classes={tabClasses}
          style={getSubTabStyle(isFocusedOnOrgSettings)}
          component={Link}
          label={
            <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
              <Box className={classes.subTab}>General</Box>
            </Box>
          }
          value={SettingsTabs.OrganizationGeneral}
          to={`/settings${SettingsTabs.OrganizationGeneral}/settings`}
          data-testid="Settings.OrgSettings.General"
        />
      )}
      {isOrgAdmin && hasDashboardAccess && (
        <Tab
          classes={tabClasses}
          style={getSubTabStyle(isFocusedOnOrgSettings)}
          component={Link}
          label={
            <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
              <Box className={classes.subTab}>Security</Box>
            </Box>
          }
          value={SettingsTabs.OrganizationSecurity}
          to={`/settings${SettingsTabs.OrganizationSecurity}`}
          data-testid="Settings.OrgSettings.Security"
        />
      )}
      {isOrgAdmin && hasDashboardAccess && (
        <Tab
          classes={tabClasses}
          style={getSubTabStyle(isFocusedOnOrgSettings)}
          component={Link}
          label={
            <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
              <Box className={classes.subTab}>Integrations</Box>
            </Box>
          }
          value={SettingsTabs.OrganizationIntegrations}
          to={`/settings${SettingsTabs.OrganizationIntegrations}`}
          data-testid="Settings.OrgSettings.Integrations"
        />
      )}
      {isOrgAdmin && hasDashboardAccess && (
        <Tab
          classes={tabClasses}
          style={getSubTabStyle(isFocusedOnOrgSettings)}
          component={Link}
          label={
            <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
              <Box className={classes.subTab}>Data Privacy Portal</Box>
            </Box>
          }
          value={SettingsTabs.OrganizationDataPrivacy}
          to={`/settings${SettingsTabs.OrganizationDataPrivacy}`}
          data-testid="Settings.OrgSettings.DataPrivacyPortal"
        />
      )}
      {canViewPlatformUsage && hasDashboardAccess && (
        <Tab
          classes={tabClasses}
          component={Link}
          label={
            <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
              <Box color={isFocusedOnBillingSettings ? 'primary.main' : 'link.main'}>Billing</Box>
            </Box>
          }
          value={SettingsTabs.Billing}
          to={`/settings${SettingsTabs.Billing}`}
          data-testid="Settings.Billing"
        />
      )}
      <Tab
        classes={tabClasses}
        component={Link}
        label={
          <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
            <Box color={isFocusedOnPersonalSettings ? 'primary.main' : 'link.main'}>Your Preferences</Box>
            <Box>
              <Icon icon={isFocusedOnPersonalSettings ? 'angle-up' : 'angle-down'} color="grey.main" />
            </Box>
          </Box>
        }
        value={SettingsTabs.PersonalProfile}
        to={`/settings${SettingsTabs.PersonalProfile}/profile`}
        data-testid="Settings.PersonalSettings"
      />
      <Tab
        classes={tabClasses}
        style={getSubTabStyle(isFocusedOnPersonalSettings)}
        component={Link}
        label={
          <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
            <Box className={classes.subTab}>General</Box>
          </Box>
        }
        value={SettingsTabs.PersonalProfile}
        to={`/settings${SettingsTabs.PersonalProfile}/profile`}
        data-testid="Settings.PersonalSettings.General"
      />
      <Tab
        classes={tabClasses}
        style={getSubTabStyle(isFocusedOnPersonalSettings)}
        component={Link}
        label={
          <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
            <Box className={classes.subTab}>Templates</Box>
          </Box>
        }
        value={SettingsTabs.PersonalTemplates}
        to={`/settings${SettingsTabs.PersonalTemplates}`}
        data-testid="Settings.PersonalSettings.Templates"
      />
      <Tab
        classes={tabClasses}
        style={getSubTabStyle(isFocusedOnPersonalSettings)}
        component={Link}
        label={
          <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
            <Box className={classes.subTab}>Integrations</Box>
          </Box>
        }
        value={SettingsTabs.PersonalIntegrations}
        to={`/settings${SettingsTabs.PersonalIntegrations}`}
        data-testid="Settings.PersonalSettings.Integrations"
      />
      {hasAssistSetting && (
        <Tab
          classes={tabClasses}
          style={getSubTabStyle(isFocusedOnPersonalSettings)}
          component={Link}
          label={
            <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
              <Box className={classes.subTab}>Email Notifications</Box>
            </Box>
          }
          value={SettingsTabs.PersonalNotifications}
          to={`/settings${SettingsTabs.PersonalNotifications}`}
          data-testid="Settings.PersonalSettings.EmailNotifications"
        />
      )}
      {showUsersAndTeamsTab && (
        <Tab
          classes={tabClasses}
          component={Link}
          label={
            <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
              <Box>Users & Teams</Box>
            </Box>
          }
          value={SettingsTabs.Teams}
          to={`/settings${SettingsTabs.Teams}/users-management/users`}
          data-testid="Settings.TeamSettings"
        />
      )}
    </Tabs>
  );
};

export default SettingsTabsSidebar;
