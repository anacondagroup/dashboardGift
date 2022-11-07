import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyle = makeStyles(theme => ({
  previewBox: {
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: 4,
    width: 47,
    height: 47,
  },
  inputBox: {
    width: 55,
    marginLeft: theme.spacing(1),
    '& input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
}));

// hexColor prop - string with # symbol
const CmykColorInput = ({ cmyk, hex, onChange }) => {
  const [CMYK, setCMYK] = useState({ ...cmyk });

  const classes = useStyle();

  const handleOnChangeCmyk = (value, letter) => {
    let validatedValue;
    if (value > 100) {
      validatedValue = 100;
    } else if (value < 0) {
      validatedValue = 0;
    } else {
      validatedValue = value;
    }
    const updatedCMYK = { ...CMYK, [letter]: validatedValue };
    setCMYK(updatedCMYK);
    onChange(updatedCMYK);
  };

  return (
    <Box display="flex" justifyContent="space-between">
      <Box className={classes.previewBox} bgcolor={hex} />
      <Box display="flex" justifyContent="space-between">
        <TextField
          className={classes.inputBox}
          type="number"
          step={1}
          variant="outlined"
          label="C"
          value={CMYK.c}
          onChange={e => handleOnChangeCmyk(parseInt(e.target.value || 0, 10), 'c')}
        />
        <TextField
          className={classes.inputBox}
          type="number"
          step={1}
          variant="outlined"
          label="M"
          value={CMYK.m}
          onChange={e => handleOnChangeCmyk(parseInt(e.target.value || 0, 10), 'm')}
        />
        <TextField
          className={classes.inputBox}
          type="number"
          step={1}
          variant="outlined"
          label="Y"
          value={CMYK.y}
          onChange={e => handleOnChangeCmyk(parseInt(e.target.value || 0, 10), 'y')}
        />
        <TextField
          className={classes.inputBox}
          type="number"
          step={1}
          variant="outlined"
          label="K"
          value={CMYK.k}
          onChange={e => handleOnChangeCmyk(parseInt(e.target.value || 0, 10), 'k')}
        />
      </Box>
    </Box>
  );
};

CmykColorInput.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  cmyk: PropTypes.object.isRequired,
  hex: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CmykColorInput;
