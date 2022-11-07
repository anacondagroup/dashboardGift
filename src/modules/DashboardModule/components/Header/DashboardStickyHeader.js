import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { Paper, Grid, Grow } from '@mui/material';
import { useScrollPosition } from '@alycecom/hooks';

import { kpiShape } from '../../shapes/kpi.shape';

import KpiBlockShort from './KpiBlockShort';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    width: '100vw',
    left: 0,
    top: '80px',
    zIndex: 10,
    padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
  },
  splitVerticalLine: {
    width: '1px',
    height: '100%',
    backgroundColor: theme.palette.divider,
    marginLeft: theme.spacing(2.5),
    marginRight: theme.spacing(4),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

export const DashboardStickyHeaderComponent = ({ isLoading, kpi, renderFilter }) => {
  const classes = useStyles();
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(scroll => {
    setIsVisible(scroll.y > 280);
  }, []);

  useScrollPosition(handleScroll);

  return (
    <Grow in={isVisible}>
      <Paper className={classes.root} elevation={2} square>
        <Grid container className={classes.header}>
          <Grid item container xs={7}>
            <Grid
              container
              wrap="nowrap"
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              data-testid="kpi-sticky-wrapper"
            >
              {kpi.meetings && <KpiBlockShort kpi={kpi.meetings} isLoading={isLoading} icon="calendar-alt" />}
              <div className={classes.splitVerticalLine} />
              {kpi.invites && <KpiBlockShort kpi={kpi.invites} isLoading={isLoading} icon="gift" color="green" />}
              {kpi.codes && <KpiBlockShort kpi={kpi.codes} isLoading={isLoading} icon="gift" color="green" />}
            </Grid>
          </Grid>
          {renderFilter()}
        </Grid>
      </Paper>
    </Grow>
  );
};

DashboardStickyHeaderComponent.propTypes = {
  isLoading: PropTypes.bool,
  kpi: kpiShape.isRequired,
  renderFilter: PropTypes.func.isRequired,
};

DashboardStickyHeaderComponent.defaultProps = {
  isLoading: false,
};

export default DashboardStickyHeaderComponent;
