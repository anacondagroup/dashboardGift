import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ProspectingBuilderFooter from '../ProspectingBuilderFooter/ProspectingBuilderFooter';
import { useBuilderSteps } from '../../../../hooks/useBuilderSteps';
import MessagingForm from '../../../../components/MessagingForm/MessagingForm';
import { TProspectingMessaging } from '../../../../store/prospectingCampaign/prospectingCampaign.types';
import { updateDraftProspectingMessaging } from '../../../../store/prospectingCampaign/steps/messaging/messaging.actions';
import { useProspecting } from '../../../../hooks';
import { getMessagingData } from '../../../../store/prospectingCampaign/steps/messaging/messaging.selectors';
import { useTrackProspectingCampaignBuilderNextButtonClicked } from '../../../../hooks/useTrackProspecting';
import { ProspectingBuilderStep } from '../../../../routePaths';

const MessagingStep = (): JSX.Element => {
  const messagingData = useSelector(getMessagingData);
  const isMessagingDataExist = !!messagingData;
  const { campaignId } = useProspecting();
  const { goToPrevStep, goToNextStep } = useBuilderSteps();
  const dispatch = useDispatch();
  const trackNextButtonClick = useTrackProspectingCampaignBuilderNextButtonClicked(ProspectingBuilderStep.Messaging);

  const handleSubmit = useCallback(
    (data: TProspectingMessaging, isDirty: boolean) => {
      if (isMessagingDataExist && !isDirty) {
        goToNextStep();
      } else if (campaignId) {
        const formData = { id: campaignId, ...data };
        dispatch(updateDraftProspectingMessaging(formData));
        trackNextButtonClick(campaignId, formData);
      }
    },
    [dispatch, campaignId, isMessagingDataExist, goToNextStep, trackNextButtonClick],
  );

  return (
    <MessagingForm onSubmit={handleSubmit}>
      <ProspectingBuilderFooter wrap onClickBack={goToPrevStep} />
    </MessagingForm>
  );
};

export default MessagingStep;
