import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { DashboardIcon } from '@alycecom/ui';
import { withStyles } from '@mui/styles';

const styles = () => ({
  icon: {
    fontSize: '32px',
    color: '#dcdcdc',
    marginRight: '16px',
  },
});

export const EmptyDatasetComponent = ({ dataSetName, teamName, customText, classes }) => (
  <Grid container direction="row" justifyContent="center" alignItems="center">
    <DashboardIcon icon="info-circle" className={classes.icon} />
    <Typography className="H3-Dark">
      {customText || `There’s no ${dataSetName} data available ${teamName ? `for the ${teamName} team` : ''}`}
    </Typography>
  </Grid>
);

EmptyDatasetComponent.propTypes = {
  dataSetName: PropTypes.string,
  teamName: PropTypes.string,
  customText: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

EmptyDatasetComponent.defaultProps = {
  dataSetName: '',
  teamName: '',
  customText: '',
};

export default withStyles(styles)(EmptyDatasetComponent);
