import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { LinkButton, DashboardIcon } from '@alycecom/ui';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import { DISPLAY_DATE_TIME_FORMAT } from '../../../../../../../../constants/dateFormats.constants';
import { organisationMarketoIntegrationActivitiesEnabledSuccess } from '../../../../../../store/organisation/integrations/marketo/marketo.actions';

import OrganisationIntegrationMarketoSyncActivity from './OrganisationIntegrationMarketoSyncActivity';

const useStyles = makeStyles(({ spacing, palette }) => ({
  activitiesHeader: {
    borderBottom: `1px solid ${palette.divider}`,
    padding: spacing(1),
  },
  syncButton: {
    border: `1px solid ${palette.divider}`,
    padding: spacing(2),
    borderRadius: 5,
    width: 120,
    textAlign: 'center',
  },
  lastSync: {
    paddingLeft: spacing(2),
  },
}));

const OrganisationIntegrationMarketoSyncActivitiesComponent = ({
  enabledActivities,
  availableActivities,
  sync,
  errors,
  onSync,
}) => {
  const dispatch = useDispatch();
  const activities = useMemo(
    () =>
      availableActivities.map(availableItem => ({
        ...availableItem,
        active: enabledActivities.some(activeItem => activeItem.apiName === availableItem.apiName),
        error: errors && errors[availableItem.apiName] ? errors[availableItem.apiName] : [],
      })),
    [availableActivities, enabledActivities, errors],
  );
  const classes = useStyles();
  const syncAt = moment(sync).format(DISPLAY_DATE_TIME_FORMAT);
  const handleOnSync = useCallback(() => onSync(activities), [onSync, activities]);
  const handleActivityUpdate = useCallback(
    (api, active) => {
      const updatedActivities = activities.filter(
        activity => (activity.apiName === api && active) || (activity.apiName !== api && activity.active),
      );

      dispatch(organisationMarketoIntegrationActivitiesEnabledSuccess(updatedActivities));
    },
    [dispatch, activities],
  );

  return (
    <Paper elevation={1}>
      <Box p={3}>
        <Box mb={2}>
          <Typography className="H3-Dark">Sync custom activities</Typography>
          <Typography component="div" className="Subcopy-Static Alt">
            Here you can setup Alyce activities to sync into Marketo, automatically creating the custom activity and
            associated fields in Marketo.
          </Typography>
        </Box>
        <Box mb={2}>
          <Grid container className={classes.activitiesHeader}>
            <Grid item xs={6}>
              <Typography className="Label-Table-Left-Active">Alyce activity</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className="Label-Table-Left-Active">Custom Activity name</Typography>
            </Grid>
          </Grid>

          {activities.map(activity => (
            <OrganisationIntegrationMarketoSyncActivity
              key={activity.apiName}
              activity={activity}
              handleChange={handleActivityUpdate}
            />
          ))}
        </Box>
        <Grid container direction="row" justifyContent="center" alignContent="center">
          <Grid item xs={1} container alignContent="flex-end">
            <LinkButton className={classes.syncButton} color="link" fullWidth onClick={handleOnSync}>
              <DashboardIcon icon="sync" color="link" />
              <Box component="span" pl={1}>
                Save
              </Box>
            </LinkButton>
          </Grid>
          <Grid item xs={11} className={classes.lastSync} container alignItems="center">
            {sync && <Typography className="Subcopy-Static">Last sync on {syncAt}</Typography>}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

OrganisationIntegrationMarketoSyncActivitiesComponent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  enabledActivities: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  availableActivities: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object.isRequired,
  sync: PropTypes.string.isRequired,
  onSync: PropTypes.func.isRequired,
};

OrganisationIntegrationMarketoSyncActivitiesComponent.defaultProps = {};

export default OrganisationIntegrationMarketoSyncActivitiesComponent;
