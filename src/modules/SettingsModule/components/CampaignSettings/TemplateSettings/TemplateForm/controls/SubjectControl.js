import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  errorText: {
    position: 'absolute',
    marginTop: '3.2rem',
  },
}));

export const SubjectControl = ({ disabled, error, ...formProps }) => {
  const classes = useStyles();

  return (
    <TextField
      error={!!error}
      helperText={error}
      disabled={disabled}
      id="templates-template-subject"
      placeholder="Your Subject Name"
      label="Message subject"
      variant="outlined"
      fullWidth
      FormHelperTextProps={{
        className: classes.errorText,
      }}
      {...formProps}
    />
  );
};

SubjectControl.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.string,
};

SubjectControl.defaultProps = {
  disabled: false,
  error: '',
};
