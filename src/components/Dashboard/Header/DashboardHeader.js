import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(5),
    minHeight: '136px',
    justifyContent: 'space-between',
  },
}));

const DashboardHeader = ({ controls, header, subHeader }) => {
  const classes = useStyles();

  return (
    <Grid container alignItems="flex-start" className={classes.root}>
      <Grid item container direction="column" justifyContent="flex-start" alignItems="flex-start" xs={7}>
        <Typography className="H1-Chambray">{header}</Typography>
        <Typography className="H3-Light">{subHeader}</Typography>
      </Grid>
      {controls}
    </Grid>
  );
};

DashboardHeader.propTypes = {
  header: PropTypes.string,
  subHeader: PropTypes.string,
  controls: PropTypes.node,
};

DashboardHeader.defaultProps = {
  header: '',
  subHeader: '',
  controls: null,
};

export default memo(DashboardHeader);
