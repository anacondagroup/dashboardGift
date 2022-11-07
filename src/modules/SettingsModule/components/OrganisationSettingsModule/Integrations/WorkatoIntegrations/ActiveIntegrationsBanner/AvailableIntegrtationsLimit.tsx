import React from 'react';
import { Box, Skeleton, Theme } from '@mui/material';
import { Icon } from '@alycecom/ui';

import { TIntegrationSubscription } from '../../../../../store/organisation/integrations/workato/subscription/subscription.types';

const styles = {
  banner: {
    display: 'flex',
    alignItems: 'center',
    py: 2,
    px: 3,
    backgroundColor: ({ palette }: Theme) => palette.common.white,
    borderRadius: '5px',
    border: ({ palette }: Theme) => `1px solid ${palette.text.disabled}`,
  },
  text: {
    display: 'flex',
    ml: 2,
    fontSize: 16,
    color: ({ palette }: Theme) => palette.primary.dark,
  },
  icon: {
    cursor: 'default',
  },
} as const;

interface IActiveIntegrationsBannerProps {
  isLoading: boolean;
  subscription?: TIntegrationSubscription;
}

const ActiveIntegrationsBanner = ({ subscription, isLoading }: IActiveIntegrationsBannerProps): JSX.Element => (
  <Box sx={styles.banner}>
    <Icon icon="lightbulb-on" color="link.main" sx={styles.icon} />
    <Box sx={styles.text}>
      You are using{' '}
      {isLoading ? (
        <Box mx={1}>
          <Skeleton width={70} />
        </Box>
      ) : (
        <>
          {subscription?.enabled} out of {subscription?.allowed}
        </>
      )}{' '}
      automations with Alyce. Please reach out to your CSM to unlock more automations.
    </Box>
  </Box>
);

export default ActiveIntegrationsBanner;
