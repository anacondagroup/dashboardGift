import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DetailsForm from '../../../../components/DetailsForm/DetailsForm';
import { useProspecting } from '../../../../hooks';
import { TDetailsFormValues } from '../../../../store/prospectingCampaign/steps/details/details.schemas';
import { createProspectingDraft } from '../../../../store/prospectingCampaign/prospectingCampaign.actions';
import { updateDraftProspectingDetails } from '../../../../store/prospectingCampaign/steps/details/details.actions';
import { getIsProspectingPending } from '../../../../store/prospectingCampaign/ui/status/status.selectors';
import ProspectingBuilderFooter from '../ProspectingBuilderFooter/ProspectingBuilderFooter';
import { useBuilderSteps } from '../../../../hooks/useBuilderSteps';
import { detailsFormValuesToData } from '../../../../store/prospectingCampaign/steps/details/details.helpers';
import { useTrackProspectingCampaignBuilderNextButtonClicked } from '../../../../hooks/useTrackProspecting';
import { ProspectingBuilderStep } from '../../../../routePaths';

const DetailsStep = (): JSX.Element => {
  const dispatch = useDispatch();

  const { campaignId } = useProspecting();
  const isPending = useSelector(getIsProspectingPending);
  const { goToNextStep } = useBuilderSteps();
  const trackNextButtonClick = useTrackProspectingCampaignBuilderNextButtonClicked(ProspectingBuilderStep.Details);

  const handleSubmit = useCallback(
    (values: TDetailsFormValues, isDirty) => {
      if (campaignId && !isDirty) {
        goToNextStep();
        return;
      }

      const data = detailsFormValuesToData(values);
      if (campaignId) {
        dispatch({
          ...updateDraftProspectingDetails({
            ...data,
            id: campaignId,
          }),
        });
        trackNextButtonClick(campaignId, data);
        return;
      }

      dispatch(createProspectingDraft(data));
      trackNextButtonClick(null, data);
    },
    [dispatch, campaignId, goToNextStep, trackNextButtonClick],
  );

  return (
    <DetailsForm onSubmit={handleSubmit}>
      <ProspectingBuilderFooter isLoading={isPending} wrap isFirstStep />
    </DetailsForm>
  );
};

export default DetailsStep;
