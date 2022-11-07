import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@mui/styles';
import { DashboardIcon } from '@alycecom/ui';

const styles = theme => ({
  '@keyframes color': {
    '0%': { opacity: 0.3 },
    '50%': { opacity: 1 },
    '100%': { opacity: 0.3 },
  },
  icon: {
    color: theme.palette.link.main,
    marginRight: theme.spacing(1),
    fontSize: '1rem',
  },
  link: {
    marginLeft: theme.spacing(4),
    color: theme.palette.link.main,
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  loadingLink: {
    pointerEvents: 'none',
    userSelect: 'none',
    opacity: 0.5,
    animationName: 'color',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-out',
  },
});

export const DownloadLinkComponent = ({ classes, isLoading, onDownloadClick, iconName, label }) => (
  <div
    role="presentation"
    className={classNames(classes.link, isLoading && classes.loadingLink)}
    onClick={onDownloadClick}
  >
    <DashboardIcon
      fontSize="inherit"
      icon={iconName}
      className={classNames(classes.icon, isLoading && 'ld ldt-bounce-in')}
    />
    {label}
  </div>
);

DownloadLinkComponent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  onDownloadClick: PropTypes.func.isRequired,
  label: PropTypes.string,
  iconName: PropTypes.string,
  isLoading: PropTypes.bool,
};

DownloadLinkComponent.defaultProps = {
  label: 'Download report',
  iconName: 'file-download',
  isLoading: false,
};

export default withStyles(styles)(DownloadLinkComponent);
