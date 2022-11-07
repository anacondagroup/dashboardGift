import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DashboardIcon } from '@alycecom/ui';
import classNames from 'classnames';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/material';

import KpiValue from '../../../../components/Dashboard/Overview/KpiValue';

const useStyles = makeStyles(theme => ({
  icon: {
    marginTop: 13,
    marginRight: 24,
  },
  splitIcon: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
    fontSize: '1rem',
    color: theme.palette.grey.dark,
  },
  teal: {
    color: theme.palette.teal.main,
  },
  green: {
    color: theme.palette.green.main,
  },
  kpiWrapper: {
    paddingRight: theme.spacing(3),
  },
}));

const KpiBlockShort = ({ kpi, isLoading, icon, color }) => {
  const classes = useStyles();
  const kpiKeys = useMemo(() => Object.keys(kpi), [kpi]);

  return (
    <>
      {icon && <DashboardIcon icon={icon} className={classNames(classes.icon, classes[color])} />}
      {kpiKeys.map((key, i) => (
        <Box display="flex" key={key}>
          <div className={classes.kpiWrapper}>
            <KpiValue isLoading={isLoading} title={key} value={kpi[key]} />
          </div>
          {i !== kpiKeys.length - 1 && (
            <DashboardIcon icon="caret-right" className={classNames(classes.icon, classes.splitIcon)} />
          )}
        </Box>
      ))}
    </>
  );
};

KpiBlockShort.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  kpi: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  icon: PropTypes.string,
  color: PropTypes.string,
};

KpiBlockShort.defaultProps = {
  isLoading: false,
  icon: undefined,
  color: 'teal',
};

export default KpiBlockShort;
