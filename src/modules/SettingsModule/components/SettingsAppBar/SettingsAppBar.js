import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Icon } from '@alycecom/ui';

import appBarLogo from '../../../../assets/images/chambray_bird.svg';

const useStyles = makeStyles(({ spacing, palette }) => ({
  title: {
    marginLeft: spacing(9),
    flexGrow: 1,
    fontWeight: 'bold',
    color: palette.primary.main,
  },
  icon: {
    marginRight: spacing(2),
  },
  buttonBack: {
    color: palette.primary.main,
    height: '48px',
    '&:hover': {
      color: palette.primary.main,
    },
  },
  image: {
    width: '37px',
    height: '30px',
  },
}));

const SettingsLink = ({ breadcrumbs }) => {
  const classes = useStyles();
  const history = useHistory();

  const handleGoBack = useCallback(() => {
    history.push('/');
  }, [history]);

  return (
    <AppBar color="secondary" position="static" data-testid="SettingsLink">
      <Toolbar>
        <Link to="/teams" className={classes.icon}>
          <img className={classes.image} src={appBarLogo} alt="Alyce" />
        </Link>
        <div className={classes.title}>{breadcrumbs}</div>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleGoBack}
          className={classes.buttonBack}
          data-testid="Settings.AppBar.GoBackBtn"
          startIcon={<Icon icon="arrow-left" color="inherit" />}
        >
          Go back
        </Button>
      </Toolbar>
    </AppBar>
  );
};

SettingsLink.propTypes = {
  breadcrumbs: PropTypes.node.isRequired,
};

export default SettingsLink;
