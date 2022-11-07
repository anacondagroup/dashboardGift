import React, { memo } from 'react';
import { Avatar, Box, Typography, BoxProps } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';

import { IUser } from '../../store/usersManagement.types';

const useStyles = makeStyles<AlyceTheme>(({ spacing }) => ({
  avatar: {
    width: 50,
    height: 50,
    marginRight: spacing(2),
  },
}));

export interface IUserInfoProps extends BoxProps {
  user: IUser;
  size?: 'lg' | 'sm';
}

const UserInfo = ({ user, size = 'lg', ...wrapperProps }: IUserInfoProps): JSX.Element => {
  const classes = useStyles();
  const userTextClassName = size === 'lg' ? 'H4-Chambray' : 'Body-Regular-Left-Chambray';
  return (
    <Box display="flex" alignItems="center" justifyContent="flex-start" {...wrapperProps}>
      <Avatar className={classes.avatar} alt="Profile Picture" src={user.imageUrl} />
      <Box>
        <Typography className={userTextClassName}>
          {user?.firstName} {user?.lastName}
        </Typography>
        <Typography className={userTextClassName}>{user?.email}</Typography>
      </Box>
    </Box>
  );
};

export default memo(UserInfo);
