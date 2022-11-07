import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import classNames from 'classnames';
import { DashboardIcon } from '@alycecom/ui';
import { Typography, Grid, Divider, Collapse, Box } from '@mui/material';

import DownloadLink from '../../Shared/DownloadLink';

import IconTitle from './IconTitle';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 0),
    paddingBottom: theme.spacing(3),
  },
  subtitle: {
    color: theme.palette.grey.main,
    paddingBottom: theme.spacing(3),
  },
  divider: {
    marginTop: theme.spacing(3),
  },
  icon: {
    color: theme.palette.teal.main,
    marginRight: theme.spacing(1),
  },
  toggleIcon: {
    marginBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
    color: theme.palette.link.main,
  },
  sectionToggle: {
    cursor: 'pointer',
    userSelect: 'none',
  },
}));

const DashboardSection = ({
  title,
  icon,
  subtitle,
  onDownloadReport,
  children,
  isReportLoading,
  disabledCollapse,
  hidePaper,
  isLoading,
  showDownloadReport,
}) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Grid container direction="column" className={classes.root}>
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-end">
        <Grid
          item
          className={disabledCollapse ? '' : classes.sectionToggle}
          onClick={() => (disabledCollapse ? false : setIsOpen(!isOpen))}
          xs={6}
        >
          <Grid container direction="row" justifyContent="flex-start" alignItems="flex-end">
            <IconTitle
              isLoading={isLoading}
              title={title}
              icon={icon}
              titleColor={isOpen ? '' : 'grey'}
              color={isOpen ? '' : 'light'}
            />
            {!disabledCollapse && (
              <DashboardIcon
                icon={`angle-${isOpen ? 'down' : 'up'}`}
                className={classNames(classes.icon, classes.toggleIcon)}
              />
            )}
          </Grid>
        </Grid>
        {isOpen && (
          <Grid item container direction="row" justifyContent="flex-end" alignItems="flex-end" xs={6}>
            {showDownloadReport && (
              <DownloadLink
                onDownloadClick={onDownloadReport}
                label="Download report"
                iconName="file-download"
                isLoading={isReportLoading}
              />
            )}
          </Grid>
        )}
      </Grid>

      <Collapse direction="up" in={isOpen}>
        <Typography className={classes.subtitle} variant="body2">
          {subtitle}
        </Typography>
        {!hidePaper && (
          <Box borderRadius="5px" boxShadow={1} bgcolor="background.paper" p={3}>
            {children}
          </Box>
        )}
        {hidePaper && children}
      </Collapse>

      <Collapse direction="down" in={!isOpen}>
        <Divider className={classes.divider} />
      </Collapse>
    </Grid>
  );
};

DashboardSection.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  onDownloadReport: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  disabledCollapse: PropTypes.bool,
  isReportLoading: PropTypes.bool,
  showDownloadReport: PropTypes.bool,
  hidePaper: PropTypes.bool,
  isLoading: PropTypes.bool,
};

DashboardSection.defaultProps = {
  disabledCollapse: false,
  showDownloadReport: true,
  isReportLoading: false,
  hidePaper: false,
  isLoading: false,
};

export default memo(DashboardSection);
