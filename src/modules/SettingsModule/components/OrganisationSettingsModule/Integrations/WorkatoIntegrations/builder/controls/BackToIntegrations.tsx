import React from 'react';
import { Icon, LinkButton } from '@alycecom/ui';
import { useRouting } from '@alycecom/hooks';
import { Box } from '@mui/material';

const styles = {
  icon: {
    mr: 2,
    fontSize: '1rem',
  },
} as const;

export const BackToIntegrationsArrow = (): JSX.Element => {
  const go = useRouting();
  return (
    <Box mb={3}>
      <LinkButton onClick={() => go(`/settings/organization/integrations`)}>
        <Icon icon="arrow-left" color="link" sx={styles.icon} />
        Back to all integrations
      </LinkButton>
    </Box>
  );
};
