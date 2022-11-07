import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Switch, Typography, FormControlLabel } from '@mui/material';

const OrganisationIntegrationAlyceGIftObject = ({ value, error, syncError, onChange }) => {
  const handleOnChange = useCallback((_, v) => onChange('alyceGift', v), [onChange]);

  return (
    <Paper mt={2} elevation={1}>
      <Box p={3}>
        <Box>
          <Typography className="H3-Dark">Enable Alyce gift objects</Typography>
          <Box mt={0.5} mb={2} className="Subcopy-Static-Alt">
            Enabling this allows Alyce to create a custom object in your Marketo instance to capture Alyce information.
          </Box>
          <FormControlLabel
            control={<Switch color="primary" checked={value} onChange={handleOnChange} />}
            label="Yes, create Alyce gift custom objects"
            labelPlacement="end"
            disabled={error}
          />
          {error && (
            <Box mt={1} className="Subcopy-Error">
              {error}
            </Box>
          )}
          {syncError && (
            <Box mt={1} className="Subcopy-Error">
              {syncError}
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

OrganisationIntegrationAlyceGIftObject.propTypes = {
  value: PropTypes.bool.isRequired,
  syncError: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

OrganisationIntegrationAlyceGIftObject.defaultProps = {
  error: undefined,
  syncError: undefined,
};

export default OrganisationIntegrationAlyceGIftObject;
