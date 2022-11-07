import { Box, CircularProgress, Fade, Theme } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { CampaignSettings } from '@alycecom/modules';
import { useDispatch, useSelector } from 'react-redux';

import DetailsStep from '../DetailsStep/DetailsStep';
import { loadActivateRequest } from '../../store/activate.actions';
import GiftStep from '../GiftStep/GiftStep';
import MessagingStep from '../MessagingStep/MessagingStep';
import RecipientsStep from '../RecipientsStep/RecipientsStep';
import FinalizeStep from '../FinalizeStep/FinalizeStep';
import { ActivateBuilderStep, ActivateModes } from '../../routePaths';
import { getIsActivateIdle, getIsActivatePending } from '../../store/ui/status/status.selectors';
import { StepTitle } from '../../../ProspectingCampaignModule/components/styled/Styled';
import { useActivate } from '../../hooks/useActivate';
import { setActiveStep } from '../../store/ui/activeStep/activeStep.actions';

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

const CreateActivatePage = (): JSX.Element => {
  const dispatch = useDispatch();

  const isPending = useSelector(getIsActivatePending);
  const isIdle = useSelector(getIsActivateIdle);

  const { campaignId, step } = useActivate();

  const isProgressOverlayVisible = !!campaignId && (isPending || isIdle);

  const handleChangeActiveStep = useCallback(
    (activeStep: string | number) => {
      dispatch(setActiveStep(activeStep as ActivateBuilderStep));
    },
    [dispatch],
  );

  useEffect(() => {
    if (campaignId) {
      dispatch(loadActivateRequest({ campaignId, mode: ActivateModes.Builder }));
    }
  }, [dispatch, campaignId]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [step]);

  const title = <StepTitle>1-to-Many Campaign Builder</StepTitle>;

  return (
    <>
      <Fade in={isProgressOverlayVisible} unmountOnExit timeout={{ exit: 1000 }}>
        <Box sx={styles.loader}>
          <CircularProgress />
        </Box>
      </Fade>
      <CampaignSettings.BuilderThemeProvider
        theme="chambray"
        background={CampaignSettings.BuilderBackground.ONE_TO_MANY}
      >
        <CampaignSettings.BuilderStepper activeStep={step || ''} onChangeActiveStep={handleChangeActiveStep}>
          <CampaignSettings.BuilderStepperContainer name={ActivateBuilderStep.Details} label="Details">
            {title}
            <DetailsStep />
          </CampaignSettings.BuilderStepperContainer>
          <CampaignSettings.BuilderStepperContainer name={ActivateBuilderStep.Gift} label="Gift">
            {title}
            <GiftStep />
          </CampaignSettings.BuilderStepperContainer>
          <CampaignSettings.BuilderStepperContainer name={ActivateBuilderStep.Messaging} label="Messaging">
            {title}
            <MessagingStep />
          </CampaignSettings.BuilderStepperContainer>
          <CampaignSettings.BuilderStepperContainer name={ActivateBuilderStep.Recipients} label="Recipients">
            {title}
            <RecipientsStep />
          </CampaignSettings.BuilderStepperContainer>
          <CampaignSettings.BuilderStepperContainer name={ActivateBuilderStep.Finalize} label="Finalize">
            {title}
            <FinalizeStep />
          </CampaignSettings.BuilderStepperContainer>
        </CampaignSettings.BuilderStepper>
      </CampaignSettings.BuilderThemeProvider>
    </>
  );
};

export default CreateActivatePage;
