import { Box } from '@mui/material';
import React, { useCallback } from 'react';
import { StepTitle } from '@alycecom/modules';
import { useDispatch, useSelector } from 'react-redux';

import { useSwag } from '../../../../hooks';
import { useBuilderSteps } from '../../../../hooks/useBuilderSteps';
import SwagBuilderFooter from '../SwagBuilderFooter/SwagBuilderFooter';
import { getIsFinalizePending } from '../../../../store/swagCampaign/steps/finalize/finalize.selectors';
import { createSwagCampaignByDraftId } from '../../../../store/swagCampaign/steps/finalize/finalize.actions';
import CampaignDetailsSection from '../../../../components/FinalizeDetails/CampaignDetailsSection/CampaignDetailsSection';
import GiftDetailsSection from '../../../../components/FinalizeDetails/GiftDetailsSection/GiftDetailsSection';
import MessagingDetailsSection from '../../../../components/FinalizeDetails/MessagingDetailsSection/MessagingDetailsSection';
import GiftCodeDetailsSection from '../../../../components/FinalizeDetails/GiftCodeDetailsSection/GiftCodeDetailsSection';
import { useTrackSwagCampaignBuilderCreateButtonClicked } from '../../../../hooks/useTrackSwag';

const styles = {
  position: 'absolute',
  padding: 0,
} as const;

const FinalizeStep = (): JSX.Element => {
  const dispatch = useDispatch();
  const { campaignId } = useSwag();
  const { goToPrevStep } = useBuilderSteps();
  const isPending = useSelector(getIsFinalizePending);
  const trackCreateButton = useTrackSwagCampaignBuilderCreateButtonClicked();

  const handleFinalize = useCallback(() => {
    if (campaignId) {
      dispatch(createSwagCampaignByDraftId(campaignId));
      trackCreateButton(campaignId);
    }
  }, [dispatch, campaignId, trackCreateButton]);

  return (
    <Box>
      <StepTitle style={styles}>Finalize Your Campaign</StepTitle>
      <CampaignDetailsSection />
      <GiftDetailsSection />
      <MessagingDetailsSection />
      <GiftCodeDetailsSection />
      <SwagBuilderFooter wrap isLastStep disabled={isPending} onClickNext={handleFinalize} onClickBack={goToPrevStep} />
    </Box>
  );
};

export default FinalizeStep;
