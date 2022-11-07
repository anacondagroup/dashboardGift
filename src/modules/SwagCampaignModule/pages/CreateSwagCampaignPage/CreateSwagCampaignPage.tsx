import React, { useCallback, useEffect } from 'react';
import { CampaignSettings, StepTitle } from '@alycecom/modules';
import { useDispatch, useSelector } from 'react-redux';
import { Fade, CircularProgress, Box, Theme } from '@mui/material';

import { useSwag } from '../../hooks';
import { getIsSwagIdle, getIsSwagPending } from '../../store/swagCampaign/ui/status/status.selectors';
import { fetchSwagDraftById, resetSwagCampaign } from '../../store/swagCampaign/swagCampaign.actions';
import { SwagCampaignBuilderStep } from '../../routePaths';
import { setActiveStep } from '../../store/swagCampaign/ui/activeStep/activeStep.actions';
import { CAMPAIGN_TYPE_NAMES, CAMPAIGN_TYPES } from '../../../../constants/campaignSettings.constants';

import DetailsStep from './components/DetailsStep/DetailsStep';
import GiftStep from './components/GiftStep/GiftStep';
import MessagingStep from './components/MessagingStep/MessagingStep';
import CodesStep from './components/CodesStep/CodesStep';
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

const CreateSwagCampaignPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const isIdle = useSelector(getIsSwagIdle);
  const isPending = useSelector(getIsSwagPending);

  const { campaignId, step } = useSwag();

  const isProgressOverlayVisible = !!campaignId && (isPending || isIdle);

  const handleChangeActiveStep = useCallback(
    (activeStep: string | number) => {
      dispatch(setActiveStep(activeStep as SwagCampaignBuilderStep));
    },
    [dispatch],
  );

  useEffect(() => {
    if (campaignId && isIdle) {
      dispatch(fetchSwagDraftById(campaignId));
    }
  }, [dispatch, campaignId, isIdle]);

  useEffect(
    () => () => {
      dispatch(resetSwagCampaign());
    },
    [dispatch],
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [step]);

  const title = <StepTitle>{CAMPAIGN_TYPE_NAMES[CAMPAIGN_TYPES.SWAG]} Builder</StepTitle>;

  return (
    <>
      <Fade in={isProgressOverlayVisible} unmountOnExit timeout={{ exit: 1000 }}>
        <Box sx={styles.loader}>
          <CircularProgress />
        </Box>
      </Fade>
      <CampaignSettings.BuilderThemeProvider
        theme="chambray"
        background={CampaignSettings.BuilderBackground.GIFT_REDEMPTION}
      >
        <CampaignSettings.BuilderStepper activeStep={step || ''} onChangeActiveStep={handleChangeActiveStep}>
          <CampaignSettings.BuilderStepperContainer name={SwagCampaignBuilderStep.Details} label="Details">
            {title}
            <DetailsStep />
          </CampaignSettings.BuilderStepperContainer>
          <CampaignSettings.BuilderStepperContainer name={SwagCampaignBuilderStep.Gift} label="Gift">
            {title}
            <GiftStep />
          </CampaignSettings.BuilderStepperContainer>
          <CampaignSettings.BuilderStepperContainer name={SwagCampaignBuilderStep.Messaging} label="Messaging">
            {title}
            <MessagingStep />
          </CampaignSettings.BuilderStepperContainer>
          <CampaignSettings.BuilderStepperContainer name={SwagCampaignBuilderStep.Codes} label="Codes">
            {title}
            <CodesStep />
          </CampaignSettings.BuilderStepperContainer>
          <CampaignSettings.BuilderStepperContainer name={SwagCampaignBuilderStep.Finalize} label="Finalize">
            {title}
            <FinalizeStep />
          </CampaignSettings.BuilderStepperContainer>
        </CampaignSettings.BuilderStepper>
      </CampaignSettings.BuilderThemeProvider>
    </>
  );
};

export default CreateSwagCampaignPage;
