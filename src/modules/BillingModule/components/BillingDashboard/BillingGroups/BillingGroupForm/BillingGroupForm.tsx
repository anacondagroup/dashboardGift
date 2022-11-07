import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Slide, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Button, ProductSidebarHeader, Icon } from '@alycecom/ui';
import { useForm } from 'react-hook-form';
import { User } from '@alycecom/modules';

import {
  addContactToList,
  getBillingContactListRequest,
} from '../../../../store/billingGroupsContacts/billingGroupsContacts.actions';
import {
  setCreateBillingGroupPrimaryContact,
  setCreateBillingGroupSendInvoicesTo,
  setModalOpen,
} from '../../../../store/editBillingGroups/editBillingGroups.actions';
import {
  editBillingGroupFormDefaultValue,
  editBillingGroupResolver,
} from '../../../../store/editBillingGroups/editBillingGroups.schemas';
import { TCreateBillingGroupForm } from '../../../../store/editBillingGroups/editBillingGroups.types';
import { getBillingGroupData } from '../../../../store/editBillingGroups/editBillingGroups.selectors';
import { useBillingTrackEvent } from '../../../../hooks/useBillingTrackEvent';

import BillingGroupAddContactForm from './BillingGroupAddContactForm';
import BillingGroupEditForm from './BillingGroupEditForm';

enum BILLING_GROUP_FLOW {
  ADD_PRIMARY_CONTACT = 'addPrimaryContact',
  ADD_SECONDARY_CONTACT = 'addSecondaryContact',
  ADD_BILLING_GROUP = 'addBillingGroup',
}

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: palette.common.white,
    position: 'fixed',
  },
  titleBar: {
    background: palette.green.dark,
  },
  backButton: {
    '& svg': {
      marginRight: spacing(1),
    },
    color: palette.link.main,
    paddingLeft: 0,
    marginBottom: spacing(2),
  },
}));

const BillingGroupForm = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const trackEvent = useBillingTrackEvent();

  const orgId = useSelector(User.selectors.getOrgId);
  const billingGroupData = useSelector(getBillingGroupData);

  const formMethods = useForm<TCreateBillingGroupForm>({
    mode: 'all',
    defaultValues: editBillingGroupFormDefaultValue,
    resolver: editBillingGroupResolver,
  });
  const { trigger, reset } = formMethods;

  const [currentFlow, setFlow] = useState(BILLING_GROUP_FLOW.ADD_BILLING_GROUP);

  useEffect(() => {
    dispatch(getBillingContactListRequest({ orgId }));
  }, [dispatch, orgId]);

  const handleOnSaveContact = useCallback(
    data => {
      dispatch(addContactToList(data));
      if (currentFlow === BILLING_GROUP_FLOW.ADD_PRIMARY_CONTACT) {
        dispatch(setCreateBillingGroupPrimaryContact(data));
      } else if (currentFlow === BILLING_GROUP_FLOW.ADD_SECONDARY_CONTACT) {
        dispatch(setCreateBillingGroupSendInvoicesTo([...(billingGroupData.sendInvoicesTo || []), data]));
      }
      setFlow(BILLING_GROUP_FLOW.ADD_BILLING_GROUP);
    },
    [dispatch, billingGroupData, currentFlow],
  );

  const handleCancel = useCallback(() => {
    dispatch(setModalOpen(false));
    const trackMessage = billingGroupData.groupId ? 'Edit' : 'Create';
    trackEvent(`Manage Billing - BillingGroups - Modal Close ${trackMessage} Billing Group By Cancel`);
  }, [dispatch, trackEvent, billingGroupData]);

  const setFlowAddPrimaryBillingContact = useCallback(() => setFlow(BILLING_GROUP_FLOW.ADD_PRIMARY_CONTACT), []);
  const setFlowAddSecondaryBillingContact = useCallback(() => setFlow(BILLING_GROUP_FLOW.ADD_SECONDARY_CONTACT), []);
  const setFlowAddBillingGroup = useCallback(() => {
    setFlow(BILLING_GROUP_FLOW.ADD_BILLING_GROUP);
    reset(billingGroupData);
    trigger();
  }, [trigger, billingGroupData, reset]);

  const paperEl = useRef(null);

  const getCurrentFlowTitle = useCallback(() => {
    switch (currentFlow) {
      case BILLING_GROUP_FLOW.ADD_BILLING_GROUP:
        return `${billingGroupData.groupId ? 'Edit' : 'Create'} Billing Group Details`;
      case BILLING_GROUP_FLOW.ADD_PRIMARY_CONTACT:
        return `Add Primary Billing Contact`;
      case BILLING_GROUP_FLOW.ADD_SECONDARY_CONTACT:
        return `Add Secondary Billing Contact`;
      default:
        return '';
    }
  }, [currentFlow, billingGroupData]);

  const addBillingGroupFlow = (
    <Slide in={currentFlow === BILLING_GROUP_FLOW.ADD_BILLING_GROUP} direction="left">
      <Box pb={4}>
        <BillingGroupEditForm
          onCancel={handleCancel}
          onAddPrimaryBillingContact={setFlowAddPrimaryBillingContact}
          onAddSecondaryBillingContact={setFlowAddSecondaryBillingContact}
        />
      </Box>
    </Slide>
  );

  const addBillingContactContactFlow = (
    <Slide
      in={
        currentFlow === BILLING_GROUP_FLOW.ADD_PRIMARY_CONTACT ||
        currentFlow === BILLING_GROUP_FLOW.ADD_SECONDARY_CONTACT
      }
      direction="left"
    >
      <Box py={2} pl={2} pr={5}>
        <Box ml={2}>
          <Button
            className={classes.backButton}
            onClick={setFlowAddBillingGroup}
            data-testid="BillingGroups.BillingGroupForm.BackButton"
          >
            <Icon icon="arrow-left" />
            Back to Billing Group
          </Button>
        </Box>
        <BillingGroupAddContactForm onSave={handleOnSaveContact} onCancel={setFlowAddBillingGroup} />
      </Box>
    </Slide>
  );

  return (
    <Paper ref={paperEl}>
      <Box className={classes.root}>
        <ProductSidebarHeader onClose={handleCancel} className={classes.titleBar}>
          <Box ml={4} fontSize={20} data-testid="BillingGroups.BillingGroupForm.ModalTitle">
            {getCurrentFlowTitle()}
          </Box>
        </ProductSidebarHeader>
        <>
          {currentFlow === BILLING_GROUP_FLOW.ADD_BILLING_GROUP && addBillingGroupFlow}
          {(currentFlow === BILLING_GROUP_FLOW.ADD_PRIMARY_CONTACT ||
            currentFlow === BILLING_GROUP_FLOW.ADD_SECONDARY_CONTACT) &&
            addBillingContactContactFlow}
        </>
      </Box>
    </Paper>
  );
};

export default memo(BillingGroupForm);
