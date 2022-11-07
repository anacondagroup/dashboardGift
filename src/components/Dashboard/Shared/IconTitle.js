import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Icon, LoadingLabel } from '@alycecom/ui';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.teal.main,
    width: '1.5em',
  },
  secondary: {
    color: theme.palette.secondary.main,
  },
  green: {
    color: theme.palette.green.main,
  },
  grey: {
    color: theme.palette.grey.main,
  },
  light: {
    color: theme.palette.teal.light,
  },
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

const IconTitle = ({ title, icon, color, titleColor, isLoading }) => {
  const classes = useStyles();

  return (
    <Typography variant="h3" className={classNames(classes[titleColor], classes.root)}>
      <Icon icon={icon} className={classNames(classes.icon, classes[color])} />
      {isLoading ? <LoadingLabel width="200" height="32" /> : title}
    </Typography>
  );
};

IconTitle.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string,
  titleColor: PropTypes.string,
  isLoading: PropTypes.bool,
};

IconTitle.defaultProps = {
  color: '',
  titleColor: '',
  isLoading: false,
};

export default memo(IconTitle);
