import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DetailsForm from '../../../../components/DetailsForm/DetailsForm';
import { useSwag } from '../../../../hooks';
import { createSwagDraft } from '../../../../store/swagCampaign/swagCampaign.actions';
import { updateDraftSwagDetails } from '../../../../store/swagCampaign/steps/details/details.actions';
import { getIsSwagPending } from '../../../../store/swagCampaign/ui/status/status.selectors';
import SwagBuilderFooter from '../SwagBuilderFooter/SwagBuilderFooter';
import { useBuilderSteps } from '../../../../hooks/useBuilderSteps';
import { detailsFormValuesToData } from '../../../../store/swagCampaign/steps/details/details.helpers';
import { TSwagDetailsFormValues } from '../../../../store/swagCampaign/swagCampaign.types';
import { useTrackSwagCampaignBuilderNextButtonClicked } from '../../../../hooks/useTrackSwag';
import { SwagCampaignBuilderStep } from '../../../../routePaths';

const DetailsStep = (): JSX.Element => {
  const dispatch = useDispatch();

  const { campaignId } = useSwag();
  const isPending = useSelector(getIsSwagPending);
  const { goToNextStep } = useBuilderSteps();
  const trackNextButtonClick = useTrackSwagCampaignBuilderNextButtonClicked(SwagCampaignBuilderStep.Details);

  const handleSubmit = useCallback(
    (values: TSwagDetailsFormValues, isDirty) => {
      if (campaignId && !isDirty) {
        goToNextStep();
        return;
      }

      const data = detailsFormValuesToData(values);
      if (campaignId) {
        dispatch({
          ...updateDraftSwagDetails({
            ...data,
            id: campaignId,
          }),
        });
        trackNextButtonClick(campaignId, data);
        return;
      }

      dispatch(createSwagDraft(data));
      trackNextButtonClick(null, data);
    },
    [dispatch, campaignId, goToNextStep, trackNextButtonClick],
  );

  return (
    <DetailsForm onSubmit={handleSubmit}>
      <SwagBuilderFooter isLoading={isPending} wrap isFirstStep />
    </DetailsForm>
  );
};

export default DetailsStep;
