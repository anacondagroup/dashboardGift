import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField } from '@mui/material';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';
import DatePicker from '@mui/lab/DatePicker';
import { DashboardIcon } from '@alycecom/ui';
import moment from 'moment';

const SetBatchDetails = ({ classes, title, isLoading, data, handleGenerate }) => {
  const [codesAmount, setAmount] = useState(data.codesAmount || 1);
  const [codesExpirationDate, setExpirationDate] = useState(data.codesExpirationDate || moment().add(90, 'days'));
  const [error, setError] = useState({});

  const validate = useCallback(
    (field, value) => {
      const updatedErrors = { ...error };
      if (!value) {
        updatedErrors[field] = 'Required field';
      } else if (field === 'codesAmount' && value < 1) {
        updatedErrors[field] = 'Value should be more than 1';
      } else if (field === 'codesAmount' && value > 100000) {
        updatedErrors[field] = 'Value should be less than 100.000';
      } else {
        delete updatedErrors[field];
      }
      setError(updatedErrors);
    },
    [error, setError],
  );

  const handleCodeAmounts = useCallback(
    value => {
      validate('codesAmount', value);
      setAmount(value);
    },
    [validate, setAmount],
  );

  const isNextStepDisabled = useMemo(() => !codesExpirationDate || !codesAmount || !!Object.values(error).length, [
    codesExpirationDate,
    codesAmount,
    error,
  ]);

  return (
    <>
      <Box pb={2} pl="52px" className="H4-Chambray">
        {title}
        <Box pt={1} className={classes.description}>
          Last step! Before we generate your code(s)… we need to know how many you want out and when they should expire!
          FYI - You can always add more codes after you generate these initial ones!
        </Box>
      </Box>
      <Box px={3}>
        <Box pb={1}>
          <Box className="Body-Medium-Static">How many codes should be generated</Box>
          <Box>
            <TextField
              fullWidth
              error={error && !!error.codesAmount}
              helperText={error.codesAmount}
              label="Enter amount of codes"
              variant="outlined"
              margin="normal"
              type="number"
              value={codesAmount}
              onChange={e => handleCodeAmounts(e.target.value)}
              required
            />
          </Box>
        </Box>
        <Box>
          <Box pb={2} className="Body-Medium-Static">
            When should the codes expire?
          </Box>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              inputFormat="ll"
              value={codesExpirationDate}
              onChange={setExpirationDate}
              disablePast
              renderInput={props => <TextField {...props} variant="outlined" fullWidth label="Expiration date" />}
            />
          </LocalizationProvider>
        </Box>
        <Box width="100%" mt={2} display="flex" justifyContent="flex-end">
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={() => handleGenerate(codesAmount, codesExpirationDate)}
            fullWidth
            disabled={isNextStepDisabled}
          >
            Generate
            {!isLoading ? (
              <DashboardIcon className={classes.buttonIcon} color="inherit" icon="arrow-right" />
            ) : (
              <DashboardIcon className={classes.buttonIcon} spin color="inherit" icon="spinner" />
            )}
          </Button>
        </Box>
      </Box>
    </>
  );
};

SetBatchDetails.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  isLoading: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
  handleGenerate: PropTypes.func.isRequired,
};

SetBatchDetails.defaultProps = {
  classes: {},
  data: {},
};

export default SetBatchDetails;
