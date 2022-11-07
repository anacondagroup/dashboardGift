import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { PersonalGeneralSettings, PersonalProfileSettings } from '@alycecom/modules';
import { Box, Paper, Tab, Tabs } from '@mui/material';
import { push } from 'connected-react-router';

import DashboardLayout from '../../../../../components/Dashboard/Shared/DashboardLayout';

export const PersonalComponent = ({ url, parentUrl }) => {
  const dispatch = useDispatch();
  const changeTab = useCallback((event, tabValue) => dispatch(push(tabValue)), [dispatch]);

  return (
    <DashboardLayout>
      <Paper elevation={1}>
        <Box>
          <Tabs
            value={url}
            onChange={changeTab}
            indicatorColor="primary"
            textColor="primary"
            aria-label="personal settings tabs"
          >
            <Tab label="Profile" data-testid="tab-profile" value={`${parentUrl}/profile`} />
            <Tab label="Settings" data-testid="tab-settings" value={`${parentUrl}/settings`} />
          </Tabs>
          <Route exact path={`${parentUrl}/`} render={() => <Redirect to={`${parentUrl}/profile`} />} />
          <Route exact path={`${parentUrl}/profile`} render={() => <PersonalGeneralSettings.SettingsModule />} />
          <Route exact path={`${parentUrl}/settings`} render={() => <PersonalProfileSettings.SettingsModule />} />
        </Box>
      </Paper>
    </DashboardLayout>
  );
};

PersonalComponent.propTypes = {
  parentUrl: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default PersonalComponent;
