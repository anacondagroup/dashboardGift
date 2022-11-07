import React, { Suspense, useMemo } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Auth, Features, HasFeature, GiftingOnTheFly, safeLazy, User, TEmailProviderName } from '@alycecom/modules';
import { useSelector } from 'react-redux';

import SendGiftRedirect from './components/Redirect/SendGiftRedirect';
import ContactRedirect from './components/Redirect/ContactRedirect';
import { ProspectingCampaignRoutes } from './modules/ProspectingCampaignModule/routePaths';
import { SwagCampaignRoutes } from './modules/SwagCampaignModule/routePaths';
import { StandardCampaignRoutes } from './modules/SettingsModule/components/StandardCampaignModule/routePaths';
import { getIsPermissionsLoaded, makeHasPermissionSelector } from './store/common/permissions/permissions.selectors';
import FullPageLoader from './components/Shared/FullPageLoader';
import { PermissionKeys } from './constants/permissions.constants';

const AuthChunk = safeLazy(() => import('./modules/AuthModule'));
const MarketplaceChunk = safeLazy(() => import('./modules/MarketplaceModule'));
const DashboardChunk = safeLazy(() => import('./modules/DashboardModule'));
const SettingsChunk = safeLazy(() => import('./modules/SettingsModule'));
const EmailBrandingChunk = safeLazy(() => import('./modules/EmailBrandingModule'));
const ActivateBuilderChunk = safeLazy(() => import('./modules/ActivateModule/CreateActivateModule'));
const SwagCampaignChunk = safeLazy(() => import('./modules/SwagCampaignModule/SwagCampaignModule'));
const ActivateEditorChunk = safeLazy(() => import('./modules/ActivateModule/EditActivateModule'));
const GiftingOnTheFlyChunk = safeLazy(() => import('./modules/GiftingOnTheFly'));
const ProspectingCampaignChunk = safeLazy(
  () => import('./modules/ProspectingCampaignModule/ProspectingCampaignModule'),
);
const ReportingChunk = safeLazy(() => import('./modules/ReportingModule/ReportingModule'));
const StandardCampaignChunk = safeLazy(
  () => import('./modules/SettingsModule/components/StandardCampaignModule/StandardCampaignModule'),
);
const GiftEmailPreviewChunk = safeLazy(() => import('./modules/GiftEmailPreviewModule'));
const BatchEmailPreviewChunk = safeLazy(() => import('./modules/BatchEmailPreviewModule'));

const { PrivateRoute } = Auth;

export const DASHBOARD_ROUTES = {
  HOME: '/',
  EXTERNAL: '/external',
  EXTERNAL_CONTACT: '/external/contact',
  SETTINGS: '/settings',
  REPORTING: '/reporting',
  GIFT_EMAIL_PREVIEW: '/gift-email-preview',
  BATCH_EMAIL_PREVIEW: '/batch-email-preview',
  BILLING: '/billing',
  MARKETPLACE: '/marketplace',
  ACTIVATE: '/activate/builder',
  ACTIVATE_EDITOR: '/activate/editor',
  SWAG_CAMPAIGN: SwagCampaignRoutes.basePath,
  BRANDING: '/branding/teams',
  GIFTING_ON_THE_FLY: [GiftingOnTheFly.routes.ENTRY_POINT, GiftingOnTheFly.routes.CAMPAIGN_PATH],
  PROSPECTING_CAMPAIGN: ProspectingCampaignRoutes.basePath,
  STANDARD_CAMPAIGN: StandardCampaignRoutes.basePath,
};

export const RoutesComponent = (): JSX.Element => {
  const canViewGiftingOnTheFly = useSelector(User.selectors.getCanViewGiftingOnTheFly);
  const canAccessEnterpriseDashboard = useSelector(
    useMemo(() => makeHasPermissionSelector(PermissionKeys.DashboardAccess), []),
  );
  const isPermissionsLoaded = useSelector(getIsPermissionsLoaded);
  const [isAuthenticated] = Auth.hooks.useAuthTokenInfo();

  /*
   * If a user is authenticated we're waiting for a moment when permission list is loaded
   * */
  if (isAuthenticated && !isPermissionsLoaded) {
    return <FullPageLoader />;
  }

  return (
    <Switch>
      <Route
        path={['/confirm', '/login/redirect', '/callback', '/access-denied']}
        render={() => (
          <Suspense fallback={<div />}>
            <AuthChunk />
          </Suspense>
        )}
      />

      <PrivateRoute<{ giftHashId: string }>
        isAuthenticated={isAuthenticated}
        canAccessDashboard={canAccessEnterpriseDashboard}
        path={`${DASHBOARD_ROUTES.EXTERNAL}/:giftHashId`}
        exact
        render={({
          match: {
            params: { giftHashId },
          },
        }) => <SendGiftRedirect giftHashId={giftHashId} />}
      />
      <PrivateRoute<{ contactId: string }>
        isAuthenticated={isAuthenticated}
        canAccessDashboard={canAccessEnterpriseDashboard}
        path={`${DASHBOARD_ROUTES.EXTERNAL_CONTACT}/:contactId`}
        render={({
          match: {
            params: { contactId },
          },
        }) => <ContactRedirect contactId={contactId} />}
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        path={DASHBOARD_ROUTES.SETTINGS}
        render={() => (
          <Suspense fallback={<div />}>
            <SettingsChunk />
          </Suspense>
        )}
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        path={DASHBOARD_ROUTES.STANDARD_CAMPAIGN}
        render={() => (
          <Suspense fallback={<div />}>
            <StandardCampaignChunk />
          </Suspense>
        )}
      />
      <PrivateRoute<{ giftId: string; provider: TEmailProviderName }>
        isAuthenticated={isAuthenticated}
        canAccessDashboard={canAccessEnterpriseDashboard}
        path={`${DASHBOARD_ROUTES.GIFT_EMAIL_PREVIEW}/:giftId/:provider`}
        render={({
          match: {
            params: { giftId, provider },
          },
        }) => (
          <Suspense fallback={<div />}>
            <GiftEmailPreviewChunk giftId={giftId} provider={provider} />
          </Suspense>
        )}
      />
      <PrivateRoute<{ batchId: string }>
        isAuthenticated={isAuthenticated}
        canAccessDashboard={canAccessEnterpriseDashboard}
        path={`${DASHBOARD_ROUTES.BATCH_EMAIL_PREVIEW}/:batchId`}
        render={({
          match: {
            params: { batchId },
          },
        }) => (
          <Suspense fallback={<div />}>
            <BatchEmailPreviewChunk batchId={batchId} />
          </Suspense>
        )}
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        canAccessDashboard={canAccessEnterpriseDashboard}
        path={DASHBOARD_ROUTES.MARKETPLACE}
        render={renderProps => (
          <Suspense fallback={<div />}>
            <MarketplaceChunk {...renderProps} />
          </Suspense>
        )}
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        canAccessDashboard={canAccessEnterpriseDashboard}
        path={DASHBOARD_ROUTES.ACTIVATE}
        render={() => (
          <Suspense fallback={<div />}>
            <HasFeature featureKey={Features.FLAGS.ALYCE_FOR_MARKETING}>
              <ActivateBuilderChunk />
            </HasFeature>
          </Suspense>
        )}
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        canAccessDashboard={canAccessEnterpriseDashboard}
        path={DASHBOARD_ROUTES.ACTIVATE_EDITOR}
        render={() => (
          <Suspense fallback={<div />}>
            <HasFeature featureKey={Features.FLAGS.ALYCE_FOR_MARKETING}>
              <ActivateEditorChunk />
            </HasFeature>
          </Suspense>
        )}
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        canAccessDashboard={canAccessEnterpriseDashboard}
        path={DASHBOARD_ROUTES.SWAG_CAMPAIGN}
        render={() => (
          <Suspense fallback={<div />}>
            <HasFeature featureKey={Features.FLAGS.GIFT_REDEMPTION_CODES_2_0}>
              <SwagCampaignChunk />
            </HasFeature>
          </Suspense>
        )}
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        canAccessDashboard={canAccessEnterpriseDashboard}
        path={DASHBOARD_ROUTES.PROSPECTING_CAMPAIGN}
        render={() => (
          <Suspense fallback={<div />}>
            <ProspectingCampaignChunk />
          </Suspense>
        )}
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        canAccessDashboard={canAccessEnterpriseDashboard}
        path={DASHBOARD_ROUTES.REPORTING}
        render={() => (
          <Suspense fallback={<div />}>
            <HasFeature featureKey={Features.FLAGS.ANALYTICS_REPORTING}>
              <ReportingChunk />
            </HasFeature>
          </Suspense>
        )}
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        canAccessDashboard={canAccessEnterpriseDashboard}
        path={`${DASHBOARD_ROUTES.BRANDING}/:teamId`}
        exact
        render={() => (
          <Suspense fallback={<div />}>
            <EmailBrandingChunk />
          </Suspense>
        )}
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        isAuthorized={canViewGiftingOnTheFly}
        canAccessDashboard={canAccessEnterpriseDashboard}
        exact
        path={DASHBOARD_ROUTES.GIFTING_ON_THE_FLY}
        render={() => (
          <Suspense fallback={<Auth.AuthLoading />}>
            <GiftingOnTheFlyChunk />
          </Suspense>
        )}
      />
      <PrivateRoute<{ url: string }>
        isAuthenticated={isAuthenticated}
        canAccessDashboard={canAccessEnterpriseDashboard}
        path={DASHBOARD_ROUTES.HOME}
        render={renderProps => (
          <Suspense fallback={<Auth.AuthLoading />}>
            <DashboardChunk {...renderProps} />
          </Suspense>
        )}
      />
    </Switch>
  );
};

export default RoutesComponent;
