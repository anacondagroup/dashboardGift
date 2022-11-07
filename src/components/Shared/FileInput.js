import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { Typography, Box, Button, Grid, Slide } from '@mui/material';
import classNames from 'classnames';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    background: palette.common.white,
    position: 'relative',
  },
  border: {
    border: `1px solid ${palette.grey.main}`,
    borderRadius: 5,
    padding: 12,
  },
  labelText: {
    background: palette.common.white,
    padding: 5,
    position: 'absolute',
    top: -10,
  },
  label: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  button: {
    background: palette.green.dark,
    marginRight: spacing(2),
    color: palette.common.white,
    '&:hover': {
      background: palette.green.superDark,
    },
  },
  hiddenInput: {
    display: 'none',
  },
  noFile: {
    color: palette.grey.main,
  },
}));

const FileInput = ({ fileName, onChange, error, accept }) => {
  const classes = useStyles();
  const labelEl = useRef(null);

  return (
    <div className={classes.root}>
      <div className={classes.border}>
        <Typography className={classNames('Label-Input-Set', classes.labelText)}>Upload file</Typography>
        <Grid container alignItems="center">
          <label htmlFor="input-file" className={classes.label} ref={labelEl}>
            <Button
              className={classes.button}
              onClick={() => {
                labelEl.current.click();
              }}
            >
              Choose file
            </Button>
            {fileName || <span className={classes.noFile}>No file chosen</span>}
            <input accept={accept} type="file" id="input-file" onChange={onChange} className={classes.hiddenInput} />
          </label>
        </Grid>
      </div>
      <Grid>
        <Slide direction="left" in={!!error}>
          <Box mt={2}>
            <Typography className="Body-Regular-Center-Error">{error}</Typography>
          </Box>
        </Slide>
      </Grid>
    </div>
  );
};
FileInput.propTypes = {
  accept: PropTypes.string,
  fileName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

FileInput.defaultProps = {
  accept: '*',
  fileName: '',
  error: '',
};

export default FileInput;
