import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import ProspectingBuilderFooter from '../ProspectingBuilderFooter/ProspectingBuilderFooter';
import { useBuilderSteps } from '../../../../hooks/useBuilderSteps';
import {
  editBulkProspectingGiftLimitsByDraftId,
  fetchProspectingGiftLimitsByDraftId,
  updateProspectingGiftLimitsByDraftId,
} from '../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.actions';
import { useProspecting } from '../../../../hooks';
import { TUpdateGiftLimitsRequest } from '../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.types';
import InvitesForm from '../../../../components/InvitesForm/InvitesForm';
import { useTrackProspectingCampaignBuilderNextButtonClicked } from '../../../../hooks/useTrackProspecting';
import { ProspectingBuilderStep } from '../../../../routePaths';

const InvitesStep = (): JSX.Element => {
  const { campaignId } = useProspecting();
  const dispatch = useDispatch();
  const { goToPrevStep, goToNextStep } = useBuilderSteps();
  const trackNextButtonClick = useTrackProspectingCampaignBuilderNextButtonClicked(ProspectingBuilderStep.Invites);

  const onFetchGiftLimits = useCallback(() => {
    if (campaignId) {
      dispatch(fetchProspectingGiftLimitsByDraftId(campaignId));
    }
  }, [dispatch, campaignId]);

  const onUpdateGiftLimits = useCallback(
    (data: TUpdateGiftLimitsRequest, isDirty) => {
      if (!isDirty || data.giftLimits.length === 0) {
        goToNextStep();
        return;
      }
      if (campaignId) {
        const formData = { draftId: campaignId, ...data };
        dispatch(updateProspectingGiftLimitsByDraftId(formData));
        trackNextButtonClick(campaignId, formData);
      }
    },
    [dispatch, campaignId, goToNextStep, trackNextButtonClick],
  );

  const onBulkEdit = useCallback(
    (data: TUpdateGiftLimitsRequest) => {
      if (campaignId) {
        dispatch(
          editBulkProspectingGiftLimitsByDraftId({
            ...data,
            draftId: campaignId,
          }),
        );
      }
    },
    [dispatch, campaignId],
  );

  return (
    <InvitesForm onSubmit={onUpdateGiftLimits} onFetchGiftLimits={onFetchGiftLimits} onBulkEdit={onBulkEdit}>
      <ProspectingBuilderFooter wrap onClickBack={goToPrevStep} />
    </InvitesForm>
  );
};

export default InvitesStep;
