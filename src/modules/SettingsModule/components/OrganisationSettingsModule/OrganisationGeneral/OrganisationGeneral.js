import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Tab, Tabs } from '@mui/material';
import { Redirect, Route, useRouteMatch, useLocation } from 'react-router-dom';
import { Features, HasFeature } from '@alycecom/modules';
import { useRouting } from '@alycecom/hooks';

import DashboardLayout from '../../../../../components/Dashboard/Shared/DashboardLayout';
import { organisationSettingsLoadRequest } from '../../../store/organisation/general/organisationGeneral.actions';
import { loadBrandingRequest } from '../../../store/organisation/branding/branding.actions';

import OrganizationSettings from './OrganizationSettings/OrganizationSettings';
import CustomFields from './CustomFields/CustomFields';
import OrganizationDKIM from './OrganizationDkim/OrganizationDkim';

const OrganisationGeneral = () => {
  const dispatch = useDispatch();
  const go = useRouting();
  const { url: parentUrl } = useRouteMatch();
  const { pathname } = useLocation();

  const hasDkimSettings = useSelector(useMemo(() => Features.selectors.hasFeatureFlag('mailSenderAuthentication'), []));
  const hasCustomFieldSetting = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.CAN_USE_CUSTOM_FIELDS), []),
  );

  const tabs = useMemo(() => {
    const tabItems = [<Tab key="settings" label="Settings" value={`${parentUrl}/settings`} />];
    if (hasDkimSettings) {
      tabItems.push(
        <Tab key="domain-authentication" label="Domain Authentication" value={`${parentUrl}/domain-authentication`} />,
      );
    }
    if (hasCustomFieldSetting) {
      tabItems.push(<Tab key="custom-fields" label="Custom Fields" value={`${parentUrl}/custom-fields`} />);
    }
    return [...tabItems];
  }, [hasCustomFieldSetting, hasDkimSettings, parentUrl]);

  useEffect(() => {
    dispatch(organisationSettingsLoadRequest());
    dispatch(loadBrandingRequest({ showBranding: false }));
  }, [dispatch]);

  return (
    <DashboardLayout>
      <Paper elevation={1}>
        <Tabs value={pathname} onChange={(_, tabValue) => go(tabValue)} indicatorColor="primary" textColor="primary">
          {tabs}
        </Tabs>
        <Route exact path={parentUrl} render={() => <Redirect to={`${parentUrl}/settings`} />} />
        <Route exact path={`${parentUrl}/settings`} component={OrganizationSettings} />
        <HasFeature featureKey="mailSenderAuthentication">
          <Route exact path={`${parentUrl}/domain-authentication`} component={OrganizationDKIM} />
        </HasFeature>
        <HasFeature featureKey={Features.FLAGS.CAN_USE_CUSTOM_FIELDS}>
          <Route exact path={`${parentUrl}/custom-fields`} component={CustomFields} />
        </HasFeature>
      </Paper>
    </DashboardLayout>
  );
};

export default OrganisationGeneral;
