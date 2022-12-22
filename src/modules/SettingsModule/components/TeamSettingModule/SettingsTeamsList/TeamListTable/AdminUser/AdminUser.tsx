import React, { memo } from 'react';
import { AlyceTheme } from '@alycecom/ui';
import { Typography, Box, Avatar } from '@mui/material';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    mr: 3,
  },
  adminName: {
    fontSize: 16,
    lineHeight: 1.25,
  },
  adminEmail: {
    fontSize: 12,
    color: ({ palette }: AlyceTheme) => palette.grey.main,
  },
} as const;

export interface IAdminUserProps {
  email: string;
  avatar: string;
  fullName: string;
}

const AdminUser = ({ email, avatar, fullName }: IAdminUserProps): JSX.Element => (
  <Box sx={styles.root} data-testid-table-admin={fullName}>
    <Avatar src={avatar} sizes="30" />
    <Box pl={1}>
      <Typography sx={styles.adminName}>{fullName}</Typography>
      <Typography sx={styles.adminEmail}>{email}</Typography>
    </Box>
  </Box>
);

export default memo(AdminUser);
