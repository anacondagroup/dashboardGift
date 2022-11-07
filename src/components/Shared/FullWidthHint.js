import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
  container: {
    borderTop: `1px solid ${theme.palette.text.disabled}`,
    borderBottom: `1px solid ${theme.palette.text.disabled}`,
    backgroundColor: theme.palette.green.fruitSaladLight,
    padding: 24,
    color: theme.palette.text.primary,
  },
}));

const FullWidthHint = ({ children }) => {
  const classes = useStyles();

  return <Box className={classes.container}>{children}</Box>;
};

FullWidthHint.propTypes = {
  children: PropTypes.node,
};

FullWidthHint.defaultProps = {
  children: undefined,
};

export default FullWidthHint;
