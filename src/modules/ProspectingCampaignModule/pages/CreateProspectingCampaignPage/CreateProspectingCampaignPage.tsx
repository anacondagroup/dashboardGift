import React, { useEffect, useCallback } from 'react';
import { CampaignSettings, Features } from '@alycecom/modules';
import { useDispatch, useSelector } from 'react-redux';
import { Fade, CircularProgress, Box, Theme } from '@mui/material';

import { useProspecting } from '../../hooks';
import {
  getIsProspectingIdle,
  getIsProspectingPending,
} from '../../store/prospectingCampaign/ui/status/status.selectors';
import {
  fetchProspectingDraftById,
  resetProspectingCampaign,
} from '../../store/prospectingCampaign/prospectingCampaign.actions';
import { ProspectingBuilderStep } from '../../routePaths';
import { StepTitle } from '../../components/styled/Styled';
import { setActiveStep } from '../../store/prospectingCampaign/ui/activeStep/activeStep.actions';

import DetailsStep from './components/DetailsStep/DetailsStep';
import GiftStep from './components/GiftStep/GiftStep';
import MessagingStep from './components/MessagingStep/MessagingStep';
import InvitesStep from './components/InvitesStep/InvitesStep';
import FinalizeStep from './components/FinalizeStep/FinalizeStep';

const styles = {
  loader: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ({ palette }: Theme) => palette.common.white,
    width: '100vw',
    height: '100vh',
    zIndex: ({ zIndex }: Theme) => zIndex.modal,
  },
} as const;

const CreateProspectingCampaignPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const isIdle = useSelector(getIsProspectingIdle);
  const isPending = useSelector(getIsProspectingPending);

  const hasBudgetManagementSetup = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_SETUP),
  );
  const hasBudgetManagementLimit = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_LIMIT),
  );
  const hasBudgetFlagsEnabled = hasBudgetManagementSetup && hasBudgetManagementLimit;

  const { campaignId, step } = useProspecting();

  const isProgressOverlayVisible = !!campaignId && (isPending || isIdle);

  const handleChangeActiveStep = useCallback(
    (activeStep: string | number) => {
      dispatch(setActiveStep(activeStep as ProspectingBuilderStep));
    },
    [dispatch],
  );

  useEffect(() => {
    if (campaignId && isIdle) {
      dispatch(fetchProspectingDraftById(campaignId));
    }
  }, [dispatch, campaignId, isIdle]);

  useEffect(
    () => () => {
      dispatch(resetProspectingCampaign());
    },
    [dispatch],
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [step]);

  const title = <StepTitle>Prospecting Campaign Builder</StepTitle>;

  const steps: JSX.Element[] = [
    <CampaignSettings.BuilderStepperContainer name={ProspectingBuilderStep.Details} label="Details">
      {title}
      <DetailsStep />
    </CampaignSettings.BuilderStepperContainer>,
    <CampaignSettings.BuilderStepperContainer name={ProspectingBuilderStep.Gift} label="Gift">
      {title}
      <GiftStep />
    </CampaignSettings.BuilderStepperContainer>,
    <CampaignSettings.BuilderStepperContainer name={ProspectingBuilderStep.Messaging} label="Messaging">
      {title}
      <MessagingStep />
    </CampaignSettings.BuilderStepperContainer>,
  ];

  if (!hasBudgetFlagsEnabled) {
    steps.push(
      <CampaignSettings.BuilderStepperContainer name={ProspectingBuilderStep.Invites} label="Invites">
        {title}
        <InvitesStep />
      </CampaignSettings.BuilderStepperContainer>,
    );
  }

  steps.push(
    <CampaignSettings.BuilderStepperContainer name={ProspectingBuilderStep.Finalize} label="Finalize">
      {title}
      <FinalizeStep />
    </CampaignSettings.BuilderStepperContainer>,
  );

  return (
    <>
      <Fade in={isProgressOverlayVisible} unmountOnExit timeout={{ exit: 1000 }}>
        <Box sx={styles.loader}>
          <CircularProgress />
        </Box>
      </Fade>
      <CampaignSettings.BuilderThemeProvider theme="green" background={CampaignSettings.BuilderBackground.PROSPECTING}>
        <CampaignSettings.BuilderStepper activeStep={step || ''} onChangeActiveStep={handleChangeActiveStep}>
          {steps}
        </CampaignSettings.BuilderStepper>
      </CampaignSettings.BuilderThemeProvider>
    </>
  );
};

export default CreateProspectingCampaignPage;
