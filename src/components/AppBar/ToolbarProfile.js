import React, { useCallback, useState, memo } from 'react';
import {
  Button,
  Grow,
  ClickAwayListener,
  Paper,
  MenuList,
  MenuItem,
  Popper,
  Avatar,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import { Auth, GiftingOnTheFly, User } from '@alycecom/modules';
import { LinkButton, Icon } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  toolbarMenu: {
    top: 84,
    zIndex: theme.zIndex.modal,
    width: 190,
  },
}));

const ToolbarProfile = () => {
  const { logoutUrl } = Auth.hooks.useAuthService();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const userName = useSelector(User.selectors.getUserName);
  const orgName = useSelector(User.selectors.getOrgName);
  const avatarUrl = useSelector(User.selectors.getUserImage);
  const canViewGiftingOnTheFly = useSelector(User.selectors.getCanViewGiftingOnTheFly);

  const handleMenu = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const logout = useCallback(() => {
    dispatch(Auth.actions.logoutRequest(logoutUrl));
  }, [dispatch, logoutUrl]);

  return (
    <>
      <Button
        data-testid="AppBar.ProfileMenu"
        aria-owns={isOpen ? 'menu-appbar' : undefined}
        aria-haspopup="true"
        color="inherit"
        onClick={handleMenu}
      >
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <Box component={Avatar} width={36} height={36} alt="Profile Picture" src={avatarUrl} ml={1.5} />
          <Grid item>
            <Box ml={2}>
              <Typography variant="h4" color="inherit">
                <Grid container direction="column" justifyContent="center" alignItems="flex-start">
                  {userName}
                  <Box variant="inherit" component={Typography} align="left" fontSize="0.75rem">
                    {orgName}
                  </Box>
                </Grid>
              </Typography>
            </Box>
          </Grid>
          <Box component={Icon} ml={2} icon="angle-down" color="white" />
        </Grid>
      </Button>
      <Popper open={isOpen} anchorEl={anchorEl} transition className={classes.toolbarMenu}>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <span>
              <ClickAwayListener onClickAway={handleClose}>
                <Paper>
                  <MenuList>
                    <MenuItem
                      data-testid="Toolbar.PersonalSettingsLink"
                      component={Link}
                      to="/settings/common/personal/profile"
                    >
                      Your Preferences
                    </MenuItem>
                    {canViewGiftingOnTheFly && (
                      <MenuItem
                        data-testid="Toolbar.GiftingSettingsLink"
                        component={Link}
                        to={GiftingOnTheFly.routes.ENTRY_POINT}
                      >
                        Gifting On The Fly
                      </MenuItem>
                    )}
                    <MenuItem data-testid="Toolbar.Logout" onClick={logout}>
                      <LinkButton>Logout</LinkButton>
                    </MenuItem>
                  </MenuList>
                </Paper>
              </ClickAwayListener>
            </span>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default memo(ToolbarProfile);
