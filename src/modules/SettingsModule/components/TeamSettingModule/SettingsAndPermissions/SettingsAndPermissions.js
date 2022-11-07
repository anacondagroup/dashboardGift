import React, { useMemo } from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Route, Redirect, Link } from 'react-router-dom';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import { useRouting } from '@alycecom/hooks';
import { makeStyles } from '@mui/styles';
import { BreadcrumbItem, DynamicBreadcrumbs, Icon } from '@alycecom/ui';

import DashboardLayout from '../../../../../components/Dashboard/Shared/DashboardLayout';
import { makeGetTeamById } from '../../../../../store/teams/teams.selectors';
import TeamSettingTemplates from '../TeamSettingTemplates/TeamSettingTemplates';

import TeamSettingsGiftInvites from './TeamSettingsGiftInvites/TeamSettingsGiftInvites';
import GeneralSettings from './GeneralSettings/GeneralSettings';

const useStyles = makeStyles(({ palette }) => ({
  breadcrumbItem: {
    color: palette.link.main,
    fontSize: '24px',
  },
  lastBreadcrumbItem: {
    color: palette.primary.main,
    fontWeight: 700,
    fontSize: '24px',
  },
}));

const SettingsAndPermissions = ({ parentUrl, teamId, url }) => {
  const classes = useStyles();
  const team = useSelector(useMemo(() => makeGetTeamById(teamId), [teamId]));
  const teamName = R.propOr('Loading', 'name', team);
  const go = useRouting();

  return (
    <DashboardLayout>
      <Box mb={2}>
        <DynamicBreadcrumbs
          aria-label="breadcrumbs"
          separator={<Icon color="primary.main" icon="angle-right" width={10} fontSize={2} />}
          item={Link}
          itemProps={{ className: classes.breadcrumbItem }}
          finalItemProps={{ className: classes.lastBreadcrumbItem }}
        />
        <BreadcrumbItem to="/settings/teams">All teams</BreadcrumbItem>
        <BreadcrumbItem>{teamName || '...'}</BreadcrumbItem>
      </Box>
      <Paper elevation={0}>
        <>
          <Tabs value={url} onChange={(event, tabValue) => go(tabValue)} indicatorColor="primary" textColor="primary">
            <Tab label="General" value={`${parentUrl}/general`} />
            <Tab label="Gift invites" value={`${parentUrl}/gift-invites`} />
            <Tab label="Templates" value={`${parentUrl}/templates`} />
            <Tab value={parentUrl} style={{ display: 'none' }} />
          </Tabs>
          <Box>
            <Route exact path={`${parentUrl}/general`} render={() => <GeneralSettings teamId={Number(teamId)} />} />
            <Route
              exact
              path={`${parentUrl}/gift-invites`}
              render={() => <TeamSettingsGiftInvites teamId={+teamId} teamName={teamName || 'Team'} />}
            />
            <Route exact path={`${parentUrl}/templates`} render={() => <TeamSettingTemplates teamId={teamId} />} />
            <Route exact path={`${parentUrl}/`} render={() => <Redirect to={`${parentUrl}/general`} />} />
          </Box>
        </>
      </Paper>
    </DashboardLayout>
  );
};

SettingsAndPermissions.propTypes = {
  teamId: PropTypes.string.isRequired,
  parentUrl: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default SettingsAndPermissions;
