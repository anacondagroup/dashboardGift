import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Auth, Features } from '@alycecom/modules';

import { getIsWorkatoIntegrationEnabled } from '../../store/organisation/integrations/workato/workato.selectors';

import OrganisationGeneral from './OrganisationGeneral/OrganisationGeneral';
import IntegrationsPage from './Integrations/IntegrationsPage';
import OrganisationIntegrationMarketo from './Integrations/InHouseIntegrations/MarketoIntegration/MarketoIntegrationConfiguration/OrganisationIntegrationMarketo';
import OrganisationApplicationsSalesforce from './OrganisationApplications/Salesforce/OrganisationApplicationsSalesforce';
import SecuritySettings from './SecuritySettings';
import RightToBeForgottenSettings from './RightToBeForgottenSettings/RightToBeForgottenSettings';
import { SlackIntegration } from './Integrations/WorkatoIntegrations/Slack/SlackIntegration';
import { SixthSenseIntegration } from './Integrations/WorkatoIntegrations/6Sense/SixthSenseIntegration';
import { DemandbaseIntegration } from './Integrations/WorkatoIntegrations/Demandbase/DemandbaseIntegration';
import MsTeamsIntegration from './Integrations/WorkatoIntegrations/MsTeams/MsTeamsIntegration';
import { WorkatoEmbeddedPage } from './Integrations/WorkatoIntegrations/builder/templates/WorkatoEmbeddedPage';
import SalesforceIntegration from './Integrations/WorkatoIntegrations/Salesforce/SalesforceIntegration';
import { RollworksIntegration } from './Integrations/WorkatoIntegrations/Rollworks/RollworksIntegration';

const { PrivateRoute } = Auth;

interface IOrganisationSettingsProps {
  parentUrl: string;
}

const OrganisationSettings = ({ parentUrl }: IOrganisationSettingsProps) => {
  const marketoAvailable = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.MARKETO_INTEGRATION), []),
  );
  const salesforceAvailable = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.SALES_FORCE_APP_ACCESS), []),
  );
  const workatoAvailable = useSelector(getIsWorkatoIntegrationEnabled);

  return (
    <>
      <Route exact path={`${parentUrl}/`} render={() => <Redirect to={`${parentUrl}/general`} />} />
      <Route path={`${parentUrl}/general`} render={() => <OrganisationGeneral />} />
      <Route
        exact
        path={`${parentUrl}/integrations`}
        render={() => <IntegrationsPage url={`${parentUrl}/integrations`} />}
      />
      <Route
        exact
        path={`${parentUrl}/integrations/slack/:integrationId`}
        render={({ match }) => {
          if (!workatoAvailable) {
            return <Redirect to={`${parentUrl}/integrations`} />;
          }
          return <SlackIntegration integrationId={match.params.integrationId as string} />;
        }}
      />
      <Route
        exact
        path={`${parentUrl}/integrations/6sense/:integrationId`}
        render={({ match }) => {
          if (!workatoAvailable) {
            return <Redirect to={`${parentUrl}/integrations`} />;
          }
          return <SixthSenseIntegration integrationId={match.params.integrationId as string} />;
        }}
      />
      <Route
        exact
        path={`${parentUrl}/integrations/demandbase/:integrationId`}
        render={({ match }) => {
          if (!workatoAvailable) {
            return <Redirect to={`${parentUrl}/integrations`} />;
          }
          return <DemandbaseIntegration integrationId={match.params.integrationId as string} />;
        }}
      />
      <Route
        exact
        path={`${parentUrl}/integrations/rollworks/:integrationId`}
        render={({ match }) => {
          if (!workatoAvailable) {
            return <Redirect to={`${parentUrl}/integrations`} />;
          }
          return <RollworksIntegration integrationId={match.params.integrationId as string} />;
        }}
      />
      <Route
        exact
        path={`${parentUrl}/integrations/ms-teams/:integrationId`}
        render={({ match }) => {
          if (!workatoAvailable) {
            return <Redirect to={`${parentUrl}/integrations`} />;
          }
          return <MsTeamsIntegration integrationId={match.params.integrationId as string} />;
        }}
      />
      <Route
        exact
        path={`${parentUrl}/integrations/:integrationId/logs/recipes/:recipeId`}
        render={({ match }) => <WorkatoEmbeddedPage integrationId={match.params.integrationId as string} />}
      />
      <Route
        exact
        path={`${parentUrl}/integrations/salesforce/:integrationId`}
        render={({ match }) => {
          if (!workatoAvailable) {
            return <Redirect to={`${parentUrl}/integrations`} />;
          }
          return <SalesforceIntegration integrationId={match.params.integrationId as string} />;
        }}
      />
      <Route
        exact
        path={`${parentUrl}/integrations/marketo/:uuid?`}
        render={({ match }) => {
          if (!marketoAvailable) {
            return <Redirect to={`${parentUrl}/integrations`} />;
          }
          const uuid = match.params.uuid ? match.params.uuid : '';
          return <OrganisationIntegrationMarketo parentUrl={`${parentUrl}/integrations/`} uuid={uuid} />;
        }}
      />
      <PrivateRoute isAuthenticated exact path={`${parentUrl}/security`} render={() => <SecuritySettings />} />
      <Route
        exact
        path={`${parentUrl}/integrations/salesforce`}
        render={() => {
          if (!salesforceAvailable) {
            return <Redirect to={`${parentUrl}/integrations`} />;
          }
          return <OrganisationApplicationsSalesforce parentUrl={`${parentUrl}/integrations`} />;
        }}
      />
      <Route exact path={`${parentUrl}/data-privacy-portal`} render={() => <RightToBeForgottenSettings />} />
    </>
  );
};

OrganisationSettings.propTypes = {
  parentUrl: PropTypes.string.isRequired,
};

export default memo(OrganisationSettings);
