import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useBuilderSteps } from '../../../../hooks/useBuilderSteps';
import GiftingForm from '../../../../components/GiftingForm/GiftingForm';
import SwagBuilderFooter from '../SwagBuilderFooter/SwagBuilderFooter';
import { formValueToData } from '../../../../store/swagCampaign/steps/gifting/gifting.helpers';
import { updateDraftSwagGifting } from '../../../../store/swagCampaign/steps/gifting/gifting.actions';
import { useSwag } from '../../../../hooks';
import { TSwagCampaignGiftingForm } from '../../../../store/swagCampaign/steps/gifting/gifting.types';
import { SwagCampaignBuilderStep } from '../../../../routePaths';
import { useTrackSwagCampaignBuilderNextButtonClicked } from '../../../../hooks/useTrackSwag';

const GiftStep = (): JSX.Element => {
  const dispatch = useDispatch();
  const { campaignId } = useSwag();
  const { goToPrevStep, goToNextStep } = useBuilderSteps();
  const trackNextButtonClick = useTrackSwagCampaignBuilderNextButtonClicked(SwagCampaignBuilderStep.Gift);

  const handleSubmit = useCallback(
    (values: TSwagCampaignGiftingForm, isDirty: boolean) => {
      if (campaignId && !isDirty) {
        goToNextStep();
        trackNextButtonClick(null, values);
        return;
      }

      if (campaignId && isDirty) {
        dispatch(
          updateDraftSwagGifting({
            ...formValueToData(values),
            id: campaignId,
          }),
        );
        trackNextButtonClick(campaignId, values);
      }
    },
    [dispatch, campaignId, goToNextStep, trackNextButtonClick],
  );

  return (
    <GiftingForm onSubmit={handleSubmit}>
      <SwagBuilderFooter wrap onClickBack={goToPrevStep} />
    </GiftingForm>
  );
};

export default GiftStep;
