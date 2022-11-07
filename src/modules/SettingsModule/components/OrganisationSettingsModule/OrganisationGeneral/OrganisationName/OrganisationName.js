import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BaseField, ActionButton } from '@alycecom/ui';
import { Box, Grid } from '@mui/material';
import { useKeyPressEnter } from '@alycecom/hooks';

const OrganisationName = ({ name, errors, isLoading, onSubmit }) => {
  const [localOrganisationName, setLocalOrganisationName] = useState(name);
  const saveOnEnter = useKeyPressEnter(() => onSubmit(localOrganisationName));

  return (
    <Grid item xs={5} container direction="row">
      <BaseField
        value={localOrganisationName}
        name="name"
        label="Organization name"
        placeholder="Input organization name"
        fullWidth
        disabled={isLoading}
        errors={errors}
        onChange={e => setLocalOrganisationName(e.target.value)}
        onKeyPress={saveOnEnter}
      />
      <Box mt={2}>
        <ActionButton onClick={() => onSubmit(localOrganisationName)}>Save</ActionButton>
      </Box>
    </Grid>
  );
};

OrganisationName.propTypes = {
  name: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
};

OrganisationName.defaultProps = {
  name: '',
  errors: {},
  isLoading: false,
  onSubmit: () => {},
};

export default OrganisationName;
