import React from 'react';
import { Icon, SidebarHeader as HeaderTopBar } from '@alycecom/ui';
import { Grid, Typography, Avatar, Theme } from '@mui/material';

import giftingFlowImage from '../../../../assets/images/contact-details-top-bar.svg';

const styles = {
  avatar: {
    width: 50,
    height: 50,
    border: ({ palette }: Theme) => `2px solid ${palette.common.white}`,
    mr: 2,
    backgroundColor: 'palette.divider',
  },
  fakeAvatar: {
    color: 'common.white',
  },
  nameWrapper: {
    overflow: 'hidden',
    pr: 4,
  },
} as const;

export interface IContactDetailsHeaderProps {
  fullName?: string;
  avatar?: string;
  position?: string;
  isLoading: boolean;
  onClose: () => void;
}

const ContactDetailsHeader = ({
  fullName = '',
  avatar = '',
  position = '',
  isLoading,
  onClose,
}: IContactDetailsHeaderProps): JSX.Element => (
  <HeaderTopBar onClose={onClose} bgImage={giftingFlowImage}>
    <Avatar alt={fullName} src={isLoading ? '' : avatar} sx={styles.avatar}>
      <Icon icon="user" />
    </Avatar>
    <Grid data-testid="Dashboard-SidebarHeader-ContactName" sx={styles.nameWrapper}>
      <Typography noWrap className="H4-White">
        {isLoading ? '' : fullName}
      </Typography>
      <Typography noWrap className="Body-Small-White">
        {isLoading ? '' : position}
      </Typography>
    </Grid>
  </HeaderTopBar>
);

export default ContactDetailsHeader;
