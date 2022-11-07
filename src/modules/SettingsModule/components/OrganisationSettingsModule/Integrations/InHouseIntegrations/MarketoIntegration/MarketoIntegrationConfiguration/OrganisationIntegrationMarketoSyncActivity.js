import React from 'react';
import PropTypes from 'prop-types';
import { Box, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';

const OrganisationIntegrationMarketoSyncActivityComponent = ({ activity, handleChange }) => (
  <Grid container>
    <Grid item xs={6}>
      <Box pt={1} pb={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={activity.active}
              onChange={e => handleChange(activity.apiName, e.target.checked)}
              color="primary"
            />
          }
          label={activity.alyceName}
        />
      </Box>
    </Grid>
    <Grid item xs={6} container alignItems="center">
      <Typography className={activity.active ? 'Body-Regular-Left-Static-Bold' : 'Body-Regular-Left-Inactive'}>
        {activity.marketoName}
      </Typography>
    </Grid>
    {activity.error && (
      <Grid item xs={12}>
        <Typography className="Subcopy-Error">{activity.error}</Typography>
      </Grid>
    )}
  </Grid>
);

OrganisationIntegrationMarketoSyncActivityComponent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  activity: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

OrganisationIntegrationMarketoSyncActivityComponent.defaultProps = {};

export default OrganisationIntegrationMarketoSyncActivityComponent;
