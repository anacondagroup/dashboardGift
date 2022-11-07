import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Redirect } from 'react-router-dom';

import logo from '../../../../assets/images/symbols_logo_white.png';
import { parseConfirmationToken } from '../../helpers/token.helpers';

import NewPasswordForm from './NewPasswordForm';

const useStyles = makeStyles(({ palette }) => ({
  wrapper: {
    minHeight: '100vh',
    backgroundImage: 'linear-gradient(319.01deg, #149591 0%, #246c86 36.98%, #33457c 83.07%, #33457c 100%)',
  },
  logo: {
    marginTop: 30,
    marginBottom: 50,
    height: 39,
  },
  white: {
    color: palette.common.white,
  },
}));

export interface IAuthConfirmationPageProps {
  idToken: string;
}

const AuthConfirmationPage = ({ idToken }: IAuthConfirmationPageProps): JSX.Element => {
  const classes = useStyles();

  const { isValid, token, userEmail, userName } = parseConfirmationToken(idToken);

  if (!isValid) {
    return (
      <Redirect
        to={`/callback?error=invalid_token&error_description=${encodeURIComponent(
          'Provided confirmation token is invalid',
        )}`}
      />
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" className={classes.wrapper}>
      <img src={logo} alt="Alyce logo" className={classes.logo} />

      <Typography gutterBottom variant="h1" className={classes.white}>
        <span data-testid="AuthConfirmationPage.UserName">{userName}</span>, you’re almost there...
      </Typography>
      <Typography gutterBottom className={classes.white}>
        Set your password and we’ll take you to your dashboard!
      </Typography>
      <Typography gutterBottom className={classes.white}>
        Your email login: <span data-testid="AuthConfirmationPage.UserEmail">{userEmail}</span>
      </Typography>

      <NewPasswordForm token={token} />
    </Box>
  );
};

export default memo(AuthConfirmationPage);
