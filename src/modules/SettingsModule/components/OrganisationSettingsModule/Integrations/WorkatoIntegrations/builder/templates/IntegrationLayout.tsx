import React, { ReactNode } from 'react';
import { Box } from '@mui/material';
import { useScrollTop } from '@alycecom/hooks';

import { BackToIntegrationsArrow } from '../controls/BackToIntegrations';
import { HeaderSection } from '../blocks/HeaderSection';

interface IIntegrationLayout {
  integrationId: string;
  children?: ReactNode;
}

export const IntegrationLayout = ({ integrationId, children }: IIntegrationLayout): JSX.Element => {
  useScrollTop();
  return (
    <>
      <BackToIntegrationsArrow />
      <Box mb={2}>
        <HeaderSection integrationId={integrationId} />
        <Box mt={3}>{children}</Box>
      </Box>
    </>
  );
};
