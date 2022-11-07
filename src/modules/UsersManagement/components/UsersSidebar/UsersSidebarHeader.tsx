import React, { memo } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Icon } from '@alycecom/ui';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  header: {
    height: 80,
    width: '100%',
    padding: spacing(2, 1, 2, 3),
    position: 'relative',
    '&::before': {
      position: 'absolute',
      content: "''",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      background: `linear-gradient(to right, ${palette.green.dark}, ${palette.teal.main})`,
    },
    color: palette.common.white,
  },
  closeButton: {
    color: palette.common.white,
    '& svg': {
      width: '26px !important',
      height: '26px !important',
    },
    marginLeft: spacing(2),
  },
}));

export interface IUsersSidebarHeaderProps {
  title?: string | null;
  onClose: () => void;
}

const UsersSidebarHeader = ({ title = 'Create users', onClose }: IUsersSidebarHeaderProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Box className={classes.header} display="flex">
      <Box display="flex" flexGrow={1} alignItems="center">
        {title && <Typography variant="h4">{title}</Typography>}
      </Box>
      <IconButton
        className={classes.closeButton}
        onClick={onClose}
        data-testid="UsersManagement.Sidebar.Close"
        size="large"
      >
        <Icon icon={['far', 'times']} />
      </IconButton>
    </Box>
  );
};

export default memo(UsersSidebarHeader);
