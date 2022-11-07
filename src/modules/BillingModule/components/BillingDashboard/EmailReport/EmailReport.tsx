import React, { memo, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ClickAwayListener, Grow, TextField, Popper, Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Icon } from '@alycecom/ui';
import { Auth } from '@alycecom/modules';

import { emailReportRequest } from '../../../store/breakdowns';
import { useBillingTrackEvent } from '../../../hooks/useBillingTrackEvent';

const useStyles = makeStyles<AlyceTheme>(({ spacing, palette }) => ({
  emailReport: {
    marginLeft: spacing(4),
    color: palette.link.main,
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'right',
    cursor: 'pointer',
  },
  icon: {
    color: palette.link.main,
    marginRight: spacing(1),
    fontSize: '1rem',
  },
  popup: {
    zIndex: 100,
    width: 292,
    marginTop: 6,
  },
  paper: {
    padding: spacing(3),
    paddingBottom: spacing(2),
  },
  title: {
    marginBottom: spacing(2),
  },
  sendButton: {
    marginTop: spacing(2),
    color: palette.common.white,
    backgroundColor: palette.green.dark,
    '&:hover': {
      backgroundColor: palette.green.mountainMeadowLight,
    },
  },
}));

const EmailReport = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const trackEvent = useBillingTrackEvent();

  const userEmail = useSelector(Auth.selectors.getUserEmail) as string;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const openPopup = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);

  const closePopup = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const [email, setEmail] = useState(userEmail);
  const isEmailValid = useMemo(() => email === userEmail || /^\S+@alyce\.com$/i.test(email), [email, userEmail]);

  const handleChangeEmail = useCallback(event => {
    setEmail(event.target.value);
  }, []);

  const handleClickSend = useCallback(() => {
    closePopup();
    dispatch(emailReportRequest(email));
    trackEvent('Billing insights XLS report - Requested', { email });
  }, [dispatch, trackEvent, closePopup, email]);

  return (
    <>
      <Typography onClick={openPopup} className={classes.emailReport} data-testid="BillingInsight.EmailReport.Link">
        <Icon fontSize="inherit" icon="envelope" className={classes.icon} />
        Email report
      </Typography>
      <Popper open={open} anchorEl={anchorEl} transition placement="bottom-end" className={classes.popup}>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <span>
              <ClickAwayListener onClickAway={closePopup}>
                <Paper className={classes.paper} elevation={3}>
                  <Typography variant="h4" className={classes.title}>
                    Who should we email it to?
                  </Typography>
                  <TextField
                    value={email}
                    onChange={handleChangeEmail}
                    error={!isEmailValid}
                    helperText={!isEmailValid && 'Should match current user email OR “%@alyce.com“'}
                    type="email"
                    placeholder="Email address"
                    fullWidth
                    autoFocus
                    variant="outlined"
                    data-testid="BillingInsight.EmailReport.Input"
                  />
                  <Button
                    onClick={handleClickSend}
                    disabled={!isEmailValid}
                    className={classes.sendButton}
                    variant="contained"
                    fullWidth
                    data-testid="BillingInsight.EmailReport.Submit"
                  >
                    Send report
                  </Button>
                </Paper>
              </ClickAwayListener>
            </span>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default memo(EmailReport);
