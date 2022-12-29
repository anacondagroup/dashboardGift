import React, { memo, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useSetBeaconConfig } from '@alycecom/hooks';

import EmailBrandingSidebar from './EmailBrandingSidebar/EmailBrandingSidebar';
import EmailPreview from './EmailPreview/EmailPreview';
import SwitchEmailContentButton from './SwitchEmailContentButton/SwitchEmailContentButton';

const EmailBrandingModule = () => {
  const setBeaconConfig = useSetBeaconConfig();

  useEffect(
    () => () => {
      setBeaconConfig({ display: { position: 'left' } });
    },
    [setBeaconConfig],
  );

  return (
    <Box minHeight="100vh" width={1} overflow="hidden">
      <EmailBrandingSidebar />
      <SwitchEmailContentButton />
      <EmailPreview />
      <Box
        position="fixed"
        bottom={0}
        pl={44}
        height={30}
        width={1}
        display="flex"
        alignItems="center"
        bgcolor="yellow.sunflower"
      >
        <Typography className="Body-Regular-Center-Chambray">
          <strong>STYLING PREVIEW ONLY:</strong> You will be able to change the content and gifts before sending.
        </Typography>
      </Box>
    </Box>
  );
};

export default memo(EmailBrandingModule);
