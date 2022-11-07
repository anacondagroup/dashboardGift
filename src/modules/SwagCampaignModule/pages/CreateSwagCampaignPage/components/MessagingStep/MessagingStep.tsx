import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useBuilderSteps, useSwag } from '../../../../hooks';
import SwagBuilderFooter from '../SwagBuilderFooter/SwagBuilderFooter';
import MessagingForm from '../../../../components/MessagingForm/MessagingForm';
import { updateDraftSwagMessaging } from '../../../../store/swagCampaign/steps/messaging/messaging.actions';
import { getMessagingData } from '../../../../store/swagCampaign/steps/messaging/messaging.selectors';
import { TSwagMessaging } from '../../../../store/swagCampaign/swagCampaign.types';
import { useTrackSwagCampaignBuilderNextButtonClicked } from '../../../../hooks/useTrackSwag';
import { SwagCampaignBuilderStep } from '../../../../routePaths';

const MessagingStep = (): JSX.Element => {
  const dispatch = useDispatch();
  const messagingData = useSelector(getMessagingData);
  const isMessagingDataExist = !!messagingData;

  const { campaignId } = useSwag();
  const { goToPrevStep, goToNextStep } = useBuilderSteps();
  const trackNextButtonClick = useTrackSwagCampaignBuilderNextButtonClicked(SwagCampaignBuilderStep.Messaging);

  const handleSubmit = useCallback(
    (data: TSwagMessaging, isDirty: boolean) => {
      if (isMessagingDataExist && !isDirty) {
        goToNextStep();
      } else if (campaignId) {
        const formData = { draftId: campaignId, ...data };
        dispatch(updateDraftSwagMessaging(formData));
        trackNextButtonClick(campaignId, formData);
      }
    },
    [isMessagingDataExist, campaignId, goToNextStep, dispatch, trackNextButtonClick],
  );

  return (
    <MessagingForm onSubmit={handleSubmit}>
      <SwagBuilderFooter wrap onClickBack={goToPrevStep} />
    </MessagingForm>
  );
};

export default MessagingStep;
