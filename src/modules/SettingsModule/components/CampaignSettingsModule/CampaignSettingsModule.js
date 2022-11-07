import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';

export const CampaignSettingsComponent = ({ parentUrl }) => (
  <Route exact path={parentUrl} render={() => <Redirect to="/campaigns" />} />
);

CampaignSettingsComponent.propTypes = {
  parentUrl: PropTypes.string.isRequired,
};

export default CampaignSettingsComponent;
