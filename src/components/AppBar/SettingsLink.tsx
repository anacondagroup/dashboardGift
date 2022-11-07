import React, { memo, useCallback } from 'react';
import { Icon } from '@alycecom/ui';
import { Button, Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { TrackEvent } from '@alycecom/services';

const SettingsLink = () => {
  const history = useHistory();
  const { trackEvent } = TrackEvent.useTrackEvent();
  const handleCLick = useCallback(() => {
    history.push('/settings');
    trackEvent('Setting gear icon — clicked');
  }, [trackEvent, history]);

  return (
    <Button data-testid="AppBar.SettingsLink" color="inherit" onClick={handleCLick}>
      <Box alignSelf="center" pt={1}>
        <Icon icon="cog" width={20} fontSize={2} />
      </Box>
    </Button>
  );
};

export default memo(SettingsLink);
