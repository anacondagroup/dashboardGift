import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { Features, HasFeature, PersonalIntegration, PersonalTemplateSettings } from '@alycecom/modules';

import Personal from './Personal/Personal';
import EmailNotifications from './EmailNotifications/EmailNotifications';

export const PersonalSettingsComponent = ({ parentUrl }) => (
  <>
    <Route exact path={`${parentUrl}/`} render={() => <Redirect to={`${parentUrl}/personal`} />} />
    <Route
      path={`${parentUrl}/personal`}
      render={({ location }) => <Personal url={location.pathname} parentUrl={`${parentUrl}/personal`} />}
    />
    <Route exact path={`${parentUrl}/integrations`} render={() => <PersonalIntegration.IntegrationModule />} />
    <Route exact path={`${parentUrl}/templates`} render={() => <PersonalTemplateSettings.Module />} />
    <HasFeature featureKey={Features.FLAGS.ASSIST}>
      <Route exact path={`${parentUrl}/email-notifications`} render={() => <EmailNotifications />} />
    </HasFeature>
  </>
);

PersonalSettingsComponent.propTypes = {
  parentUrl: PropTypes.string.isRequired,
};

export default PersonalSettingsComponent;
