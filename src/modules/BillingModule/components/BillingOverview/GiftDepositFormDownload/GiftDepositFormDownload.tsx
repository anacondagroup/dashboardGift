import React, { memo, useCallback } from 'react';
import { Alert, Button, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Download } from '@mui/icons-material';
import { useDispatch } from 'react-redux';

import { downloadGiftDepositForm } from '../../../store/ui/ui.actions';

const useStyles = makeStyles(({ spacing, palette }) => ({
  alert: {
    width: '100%',
    marginBottom: spacing(3),
    padding: spacing(1, 2),
    backgroundColor: '#E7F4F3',
    color: '#33447C',
  },
  action: {
    backgroundColor: palette.green.dark,
    marginRight: 0,
    borderRadius: 5,
    padding: 0,
  },
  button: {
    color: palette.common.white,
  },
}));

const GiftDepositFormDownload = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const handleDownload = useCallback(() => {
    dispatch(downloadGiftDepositForm());
  }, [dispatch]);

  const ButtonItem = (
    <Button className={classes.button} onClick={handleDownload} endIcon={<Download />}>
      Download Gift Deposit Form
    </Button>
  );

  return (
    <Grid item container xs={12}>
      <Alert
        classes={{ root: classes.alert, action: classes.action }}
        severity="success"
        icon={false}
        variant="outlined"
        action={ButtonItem}
      >
        <b>To add a deposit, download Gift Deposit Form.</b> Fill out the Gift Deposit Form and send the file to{' '}
        <a href="mailto:accounting@alyce.com" className="Body-Regular-Left-Link-Bold">
          accounting@alyce.com
        </a>
      </Alert>
    </Grid>
  );
};

export default memo(GiftDepositFormDownload);
