import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@mui/styles';
import { DashboardIcon } from '@alycecom/ui';
import { Paper, Box } from '@mui/material';

import IconTitle from '../../../../components/Dashboard/Shared/IconTitle';
import KpiValue from '../../../../components/Dashboard/Overview/KpiValue';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4, 0),
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(3),
    height: '153px',
    position: 'relative',
  },
  paperSection: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  splitIcon: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1.5),
    fontSize: '2rem',
    color: theme.palette.grey.dark,
  },
  bottomRectangle: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 4,
    width: '100%',
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
  teal: {
    background: theme.palette.teal.medium,
  },
  green: {
    background: theme.palette.green.light,
  },
  secondary: {
    background: theme.palette.secondary.light,
  },
  splitVerticalLine: {
    width: 1,
    height: 50,
    backgroundColor: theme.palette.divider,
    marginRight: theme.spacing(3),
  },
  kpiWrapper: {
    paddingRight: theme.spacing(2.5),
  },
}));

const KpiBlock = ({ isLoading, title, icon, kpis, color, divider }) => {
  const classes = useStyles();
  const Divider = useMemo(
    () =>
      divider === 'arrow' ? (
        <DashboardIcon icon="caret-right" className={classNames(classes.icon, classes.splitIcon)} />
      ) : (
        <div className={classes.splitVerticalLine} />
      ),
    [classes, divider],
  );
  const kpiKeys = useMemo(() => Object.keys(kpis), [kpis]);

  if (!kpis) {
    return null;
  }

  return (
    <Box mr={3} display="flex">
      <Paper elevation={1} className={classes.paper} data-testid="kpi-wrapper-meetings">
        <Box className={classes.paperSection}>
          <IconTitle color={color} icon={icon} title={title} />
          <Box display="flex" justifyContent="flex-start" alignItems="flex-end">
            {kpiKeys.map((kpi, i) => (
              <Box display="flex" alignItems="center" key={kpi}>
                <div className={classes.kpiWrapper}>
                  <KpiValue isLoading={isLoading} title={kpi.split('_to_').join(' to ')} value={kpis[kpi]} />
                </div>
                {i !== kpiKeys.length - 1 && Divider}
              </Box>
            ))}
          </Box>
        </Box>
        <div className={classNames(classes.bottomRectangle, classes[color])} />
      </Paper>
    </Box>
  );
};

KpiBlock.propTypes = {
  isLoading: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  kpis: PropTypes.object,
  color: PropTypes.string,
  divider: PropTypes.oneOf(['arrow', 'v-line']),
};

KpiBlock.defaultProps = {
  isLoading: false,
  kpis: undefined,
  color: 'teal',
  divider: 'arrow',
};

export default KpiBlock;
