import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Icon, SidebarHeader as HeaderTopBar } from '@alycecom/ui';

import giftingFlowImage from '../../../../assets/images/contact-details-top-bar.svg';

const styles = {
  icon: {
    fontSize: 48,
    color: 'common.white',
    mr: 2,
  },
  title: {
    maxWidth: 280,
  },
} as const;

export interface ISendGiftHeaderProps {
  onClose: () => void;
}

const SendGiftHeader = ({ onClose }: ISendGiftHeaderProps): JSX.Element => (
  <HeaderTopBar onClose={onClose} bgImage={giftingFlowImage}>
    <Icon icon="gift" sx={styles.icon} />
    <Grid>
      <Typography className="H4-White" sx={styles.title}>
        Let’s make someone’s day awesome!
      </Typography>
    </Grid>
  </HeaderTopBar>
);

export default SendGiftHeader;
