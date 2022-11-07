import React, { memo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, Typography, Skeleton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Icon, LinkButton } from '@alycecom/ui';
import { FormProvider, useForm, FieldError } from 'react-hook-form';

import {
  createBillingGroupRequest,
  updateBillingGroupRequest,
} from '../../../../store/editBillingGroups/editBillingGroups.actions';
import {
  editBillingGroupFormDefaultValue,
  editBillingGroupResolver,
} from '../../../../store/editBillingGroups/editBillingGroups.schemas';
import {
  TBillingGroupCreatePayload,
  TBillingGroupUpdatePayload,
  TCreateBillingGroupForm,
} from '../../../../store/editBillingGroups/editBillingGroups.types';
import { getIsLoadingBillingContacts } from '../../../../store/billingGroupsContacts/billingGroupsContacts.selectors';
import {
  getIsSaveInProgress,
  getBillingGroupData,
} from '../../../../store/editBillingGroups/editBillingGroups.selectors';
import { useBillingTrackEvent } from '../../../../hooks/useBillingTrackEvent';

import BillingGroupName from './fields/BillingGroupName';
import PrimaryContactSelector from './fields/PrimaryContactSelector';
import SendInvoicesTo from './fields/SendInvoicesTo';
import PurchaseOrderNumber from './fields/PurchaseOrderNumber';

export interface IBillingGroupEditFormProps {
  onAddPrimaryBillingContact: () => void;
  onAddSecondaryBillingContact: () => void;
  onCancel: () => void;
}

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing, zIndex }) => ({
  container: {
    height: '100vh',
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
  modalButton: {
    color: palette.link.main,
    marginRight: spacing(5),
  },
  submitButton: {
    color: palette.primary.main,
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: '1.125rem',
    color: palette.text.primary,
  },
  subTitles: {
    fontWeight: 'bolder',
  },
  addLink: {
    marginLeft: spacing(4),
    marginTop: spacing(1),
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
}));

const BillingGroupEditForm = ({
  onCancel,
  onAddPrimaryBillingContact,
  onAddSecondaryBillingContact,
}: IBillingGroupEditFormProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const trackEvent = useBillingTrackEvent();

  const billingGroupData = useSelector(getBillingGroupData);
  const isSaveInProgress = useSelector(getIsSaveInProgress);
  const isBillingGroupLoading = useSelector(getIsLoadingBillingContacts);

  const formMethods = useForm<TCreateBillingGroupForm>({
    mode: 'all',
    defaultValues: editBillingGroupFormDefaultValue,
    resolver: editBillingGroupResolver,
  });
  const {
    handleSubmit,
    formState: { isValid, errors },
    control,
    reset,
    trigger,
  } = formMethods;

  const isCancelDisabled = isSaveInProgress;

  const isSubmitDisabled = !isValid || isBillingGroupLoading || isSaveInProgress;

  useEffect(() => {
    reset(billingGroupData);
  }, [billingGroupData, reset]);

  const onSubmit = useCallback(
    (form: TCreateBillingGroupForm) => {
      if (!isValid) {
        trigger();
        return;
      }
      if (billingGroupData.groupId) {
        const modForm = {
          ...form,
          groupId: billingGroupData.groupId,
        };
        dispatch(updateBillingGroupRequest(modForm as TBillingGroupUpdatePayload));
        trackEvent('Manage Billing - BillingGroups - Update Billing Group', form);
      } else {
        dispatch(createBillingGroupRequest(form as TBillingGroupCreatePayload));
        trackEvent('Manage Billing - BillingGroups - Create New Billing Group', form);
      }
    },
    [dispatch, trackEvent, billingGroupData, isValid, trigger],
  );

  return (
    <FormProvider {...formMethods}>
      <Box className={classes.container} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box ml={2} py={2} pl={2} pr={5} flex="1 1 auto">
          <Box className={classes.sectionTitle} mt={1} mb={1.5}>
            Billing Group Details
          </Box>

          <Box mb={1.5}>
            <Typography>
              Billing Groups are a way to group your teams for separate invoices as well as delineate separate
              contacts/workflows for your automated invoicing.
            </Typography>
          </Box>

          <Box mt={3}>
            <BillingGroupName control={control} error={errors.name?.message} />
          </Box>
          <Box mt={4}>
            {isBillingGroupLoading ? (
              <Skeleton variant="text" width="100%" height={80} />
            ) : (
              <>
                <PrimaryContactSelector
                  control={control}
                  error={(errors.primaryBillingContact as FieldError)?.message}
                />
                <LinkButton
                  className={classes.addLink}
                  onClick={onAddPrimaryBillingContact}
                  disabled={isBillingGroupLoading}
                  data-testid="BillingGroups.BillingGroupForm.AddBillingContactPrimary"
                >
                  <Icon fontSize="inherit" icon="plus" className={classes.icon} />
                  Add Primary Billing Contact
                </LinkButton>
              </>
            )}
          </Box>
          <Box mt={3}>
            {isBillingGroupLoading ? (
              <Skeleton variant="text" width="100%" height={80} />
            ) : (
              <>
                {/* @ts-ignore */}
                <SendInvoicesTo control={control} error={errors.sendInvoicesTo?.message} />
                <LinkButton
                  className={classes.addLink}
                  onClick={onAddSecondaryBillingContact}
                  disabled={isBillingGroupLoading}
                  data-testid="BillingGroups.BillingGroupForm.AddBillingContactEmailsCc"
                >
                  <Icon fontSize="inherit" icon="plus" className={classes.icon} />
                  Add Secondary Billing Contact
                </LinkButton>
              </>
            )}
          </Box>
          <Box mt={3} mb={1.5}>
            <Typography className={classes.subTitles}>
              Using an automatic intake system like bill.com or coupa?
            </Typography>
            <Typography>
              Let us know the contact name and email for your system and we&lsquo;ll automatically send new invoices to
              that address
            </Typography>
          </Box>
          <Box mt={3}>
            <PurchaseOrderNumber control={control} error={errors.poNumber?.message} />
          </Box>
        </Box>

        <Box className={classes.footer}>
          <Button
            onClick={onCancel}
            variant="outlined"
            className={classes.modalButton}
            disabled={isCancelDisabled}
            data-testid="BillingGroups.BillingGroupForm.CancelButton"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            className={classes.submitButton}
            disabled={isSubmitDisabled}
            data-testid="BillingGroups.BillingGroupForm.SubmitButton"
            startIcon={isSaveInProgress && <Icon spin icon="spinner" color="inherit" />}
          >
            {billingGroupData.groupId ? 'Edit' : 'Create'} Group
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default memo(BillingGroupEditForm);
