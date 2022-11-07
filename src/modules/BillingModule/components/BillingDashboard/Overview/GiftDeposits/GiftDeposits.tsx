import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer, Typography, Box, Button, FormControl, TextField, Select, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Icon, SidebarHeader as HeaderTopBar } from '@alycecom/ui';
import ReactNumberFormat from 'react-number-format';
import classNames from 'classnames';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import { pipe, prop } from 'ramda';

import giftingFlowImage from '../../../../../../assets/images/contact-details-top-bar.svg';
import { addGiftDeposit, setGiftDepositIsOpen } from '../../../../store/giftDeposits/giftDeposits.actions';
import { getIsSaveInProgress, getGiftDepositsModalIsOpen } from '../../../../store/giftDeposits/giftDeposits.selectors';
import {
  giftDepositsFormDefaultValues,
  giftDepositsResolverSchema,
} from '../../../../store/giftDeposits/giftDepositsForm.schemas';
import {
  GiftDepositsFormFields,
  TGiftDepositsCreatePayload,
  TGiftDepositsForm,
} from '../../../../store/giftDeposits/giftDeposits.types';

const initialWidth = 550;
const useStyles = makeStyles<AlyceTheme>(({ palette, spacing, zIndex }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: spacing(1),
    background: 'none',
  },
  container: {
    width: initialWidth,
    paddingTop: spacing(2),
    paddingRight: spacing(3),
    paddingLeft: spacing(3),
  },
  title: {
    maxWidth: '280px',
    fontWeight: 'bolder',
  },
  subtitle: {
    fontWeight: 'bolder',
  },
  drawer: {
    width: initialWidth,
  },
  margin: {
    width: '35%',
  },
  marginPurchase: {
    width: '49%',
  },
  buttonSubmit: {
    marginLeft: spacing(3),
    '& svg': {
      marginRight: spacing(1),
    },
    color: palette.common.white,
  },
  buttonCancel: {
    color: palette.link.main,
    marginRight: spacing(5),
  },
  hintText: {
    fontSize: '0.7em',
  },
  footer: {
    zIndex: zIndex.speedDial,
    flex: '0 0 76px',
    marginTop: spacing(4),
    padding: spacing(2, 4),
    position: 'fixed',
    bottom: 10,
    right: '1em',
  },
}));

// TODO: Use it when Recurly will update API. (temporarily unused component)
const GiftDeposits = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const formMethods = useForm<TGiftDepositsForm>({
    mode: 'all',
    defaultValues: giftDepositsFormDefaultValues,
    resolver: giftDepositsResolverSchema,
  });
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
  } = formMethods;

  const isOpen = useSelector(getGiftDepositsModalIsOpen);
  const isSaveInProgress = useSelector(getIsSaveInProgress);

  const formIsValid = isSaveInProgress || !isValid;

  const onSubmit = useCallback(
    (form: TGiftDepositsForm) => {
      const settings = {
        accountId: form.billingGroup,
        money: { amount: form.giftDepositAmount, currency: 'USD' },
        poNumber: form.purchaseOrderNumber,
        memo: form.memoNote,
      } as TGiftDepositsCreatePayload;
      dispatch(addGiftDeposit(settings));
    },
    [dispatch],
  );

  const onCancel = useCallback(() => {
    dispatch(setGiftDepositIsOpen(false));
  }, [dispatch]);

  return (
    <Drawer disableEnforceFocus open={isOpen} anchor="right" className={classes.drawer}>
      <HeaderTopBar onClose={onCancel} bgTheme="green-gradient" bgImage={giftingFlowImage}>
        <Box ml={3}>
          <Typography className={classNames('H4-White', classes.title)}>Add A Gift Deposit</Typography>
        </Box>
      </HeaderTopBar>

      <Box className={classes.container}>
        <Box mt={2} mr={2} ml={2}>
          <Typography className={classes.subtitle} data-testid="GiftDeposit.Description">
            Gift deposits are immediately applied to your Gift Budget balance, and an invoice will be automatically
            generated and sent to the contact(s) for the given account or billing group.
          </Typography>
        </Box>
      </Box>

      <Box ml={2}>
        <FormProvider {...formMethods}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl className={classes.root}>
              <Box mt={2} mb={1} mr={2} ml={2} className={classes.margin}>
                <Typography className={classes.subtitle}>Gift Deposit Amount</Typography>
                <Controller
                  control={control}
                  name={GiftDepositsFormFields.GiftDepositAmount}
                  render={({ field: { onChange, value } }) => (
                    <ReactNumberFormat
                      decimalScale={2}
                      prefix="$"
                      thousandSeparator
                      placeholder="$"
                      allowNegative={false}
                      error={!!errors[GiftDepositsFormFields.GiftDepositAmount]}
                      helperText={errors.giftDepositAmount?.message}
                      value={value}
                      onValueChange={pipe(prop('floatValue'), onChange)}
                      customInput={TextField}
                      variant="outlined"
                      inputProps={{
                        'data-testid': 'GiftDeposit.GiftDepositAmount',
                      }}
                    />
                  )}
                />
              </Box>

              <Box mt={2} mb={1} mr={2} ml={2} className={classes.margin}>
                <Typography className={classes.subtitle}>Confirm Deposit Amount</Typography>
                <Controller
                  control={control}
                  name={GiftDepositsFormFields.ConfirmDepositAmount}
                  render={({ field: { onChange, value } }) => (
                    <ReactNumberFormat
                      decimalScale={2}
                      prefix="$"
                      placeholder="$"
                      thousandSeparator
                      allowNegative={false}
                      value={value}
                      error={!!errors[GiftDepositsFormFields.ConfirmDepositAmount]}
                      helperText={errors.confirmDepositAmount?.message}
                      onValueChange={pipe(prop('floatValue'), onChange)}
                      customInput={TextField}
                      variant="outlined"
                      inputProps={{
                        'data-testid': 'GiftDeposit.ConfirmDeposit',
                      }}
                    />
                  )}
                />
              </Box>

              <Box mt={2} ml={2} mr={2}>
                <Typography className={classes.subtitle}>(Optional) Billing Group</Typography>
                <Controller
                  control={control}
                  name={GiftDepositsFormFields.BillingGroup}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      value={value}
                      fullWidth
                      variant="outlined"
                      onChange={onChange}
                      displayEmpty
                      inputProps={{
                        'data-testid': 'GiftDeposit.BillingGroup',
                      }}
                      renderValue={() => `Bill to Organization (no billing group)`}
                    />
                  )}
                />

                <Box mt={1} data-testid="GiftDeposit.BillingGroupHint">
                  <Typography className={classes.hintText}>Selecting a Biling Group will:</Typography>
                  <Grid>
                    <Typography className={classes.hintText}>
                      1. Send the inbox for this deposit to the Billing Group&apos;s contact(s)
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography className={classes.hintText}>
                      2. Restrict use of this deposit to teams contained in that Billing Group
                    </Typography>
                  </Grid>
                </Box>
              </Box>

              <Box mt={2} mb={1} mr={2} ml={2} className={classes.marginPurchase}>
                <Typography className={classes.subtitle}>(Optional) Purchase Order Number</Typography>
                <Controller
                  control={control}
                  name={GiftDepositsFormFields.PurchaseOrderNumber}
                  render={({ field: { onChange, value } }) => (
                    <ReactNumberFormat
                      value={value}
                      onChange={onChange}
                      allowNegative={false}
                      fullWidth
                      variant="outlined"
                      customInput={TextField}
                      inputProps={{
                        'data-testid': 'GiftDeposit.PurchaseOrderNumber',
                      }}
                    />
                  )}
                />
              </Box>

              <Box m={2}>
                <Typography className={classes.subtitle}>(Optional) Memo</Typography>
                <Controller
                  control={control}
                  name={GiftDepositsFormFields.MemoNote}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      value={value}
                      onChange={onChange}
                      variant="outlined"
                      multiline
                      fullWidth
                      rows={4}
                      inputProps={{
                        'data-testid': 'GiftDeposit.Memo',
                      }}
                    />
                  )}
                />
              </Box>
            </FormControl>

            <Box className={classes.footer}>
              <Button
                onClick={onCancel}
                className={classes.buttonCancel}
                variant="outlined"
                data-testid="GiftDeposit.ConfirmDeposit.Cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                data-testid="GiftDeposit.ConfirmDeposit.AddDeposit"
                disabled={formIsValid}
                className={classes.button}
                startIcon={isSaveInProgress && <Icon spin icon="spinner" color="inherit" />}
              >
                <Typography>Add Deposit</Typography>
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </Drawer>
  );
};

export default memo(GiftDeposits);
