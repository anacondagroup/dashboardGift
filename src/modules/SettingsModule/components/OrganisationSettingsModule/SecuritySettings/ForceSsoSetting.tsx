import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, FormControlLabel, Switch } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Security, SettingsItem } from '@alycecom/modules';

const useStyles = makeStyles({
  firstSettingItem: {
    borderTop: 0,
  },
});

const { getForceSso, toggleForceSsoRequest } = Security;

const ForceSsoSetting = (): React.ReactElement => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const forceSso = useSelector(getForceSso);
  const toggleForceSso = useCallback(() => {
    dispatch(toggleForceSsoRequest());
  }, [dispatch]);

  return (
    <SettingsItem
      isLoading={false}
      collapsible={false}
      title="Forced SSO"
      description="Enabling this will force all Organization users to log in with SSO."
      overrideClasses={{
        root: classes.firstSettingItem,
      }}
    >
      <Box marginTop={1} display="flex" alignItems="center">
        <FormControlLabel
          control={<Switch checked={forceSso} onChange={toggleForceSso} color="primary" />}
          label="Yes, force users to login only with SSO"
        />
      </Box>
    </SettingsItem>
  );
};

export default ForceSsoSetting;
