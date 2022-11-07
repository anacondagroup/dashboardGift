import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useBuilderSteps } from '../../../../hooks/useBuilderSteps';
import GiftingForm from '../../../../components/GiftingForm/GiftingForm';
import ProspectingBuilderFooter from '../ProspectingBuilderFooter/ProspectingBuilderFooter';
import { formValueToData } from '../../../../store/prospectingCampaign/steps/gifting/gifting.helpers';
import { updateDraftProspectingGifting } from '../../../../store/prospectingCampaign/steps/gifting/gifting.actions';
import { useProspecting } from '../../../../hooks';
import { TProspectingGiftingForm } from '../../../../store/prospectingCampaign/steps/gifting/gifting.types';
import { useTrackProspectingCampaignBuilderNextButtonClicked } from '../../../../hooks/useTrackProspecting';
import { ProspectingBuilderStep } from '../../../../routePaths';

const GiftStep = (): JSX.Element => {
  const dispatch = useDispatch();
  const { campaignId } = useProspecting();
  const { goToPrevStep, goToNextStep } = useBuilderSteps();
  const trackNextButtonClick = useTrackProspectingCampaignBuilderNextButtonClicked(ProspectingBuilderStep.Gift);

  const handleSubmit = useCallback(
    (values: TProspectingGiftingForm, isDirty: boolean) => {
      if (campaignId && !isDirty) {
        goToNextStep();
        return;
      }

      if (campaignId && isDirty) {
        const formData = formValueToData(values);
        dispatch(updateDraftProspectingGifting({ id: campaignId, ...formData }));
        trackNextButtonClick(campaignId, formData);
      }
    },
    [dispatch, campaignId, goToNextStep, trackNextButtonClick],
  );

  return (
    <GiftingForm onSubmit={handleSubmit}>
      <ProspectingBuilderFooter wrap onClickBack={goToPrevStep} />
    </GiftingForm>
  );
};

export default GiftStep;
