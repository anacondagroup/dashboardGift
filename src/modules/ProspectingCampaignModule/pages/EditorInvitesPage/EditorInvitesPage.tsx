import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CampaignSettings } from '@alycecom/modules';

import InvitesForm from '../../components/InvitesForm/InvitesForm';
import {
  fetchProspectingGiftLimitsById,
  updateProspectingGiftingLimitsRemainingById,
  updateProspectingGiftLimitsById,
} from '../../store/prospectingCampaign/steps/giftLimits/giftLimits.actions';
import EditorFooter from '../EditProspectingCampaignPage/components/EditorFooter/EditorFooter';
import { useProspecting } from '../../hooks';
import { getIsGiftLimitsBulkPending } from '../../store/prospectingCampaign/steps/giftLimits/giftLimits.selectors';
import {
  TUpdateGiftLimitsRequest,
  TUpdateRemainingGiftLimitsRequest,
} from '../../store/prospectingCampaign/steps/giftLimits/giftLimits.types';
import { useTrackProspectingCampaignEditorSaveButtonClicked } from '../../hooks/useTrackProspecting';
import { ProspectingEditorTabs } from '../../routePaths';

const EditorInvitesPage = (): JSX.Element => {
  const { campaignId } = useProspecting();
  const dispatch = useDispatch();
  const isUpdatePending = useSelector(getIsGiftLimitsBulkPending);
  const trackSaveButtonClick = useTrackProspectingCampaignEditorSaveButtonClicked(ProspectingEditorTabs.Messaging);

  const handleFetchGiftLimits = useCallback(() => {
    if (campaignId) {
      dispatch(fetchProspectingGiftLimitsById(campaignId));
    }
  }, [dispatch, campaignId]);

  const handleUpdateGiftLimits = useCallback(
    (data: TUpdateGiftLimitsRequest) => {
      if (campaignId) {
        dispatch(updateProspectingGiftLimitsById({ ...data, campaignId }));
        trackSaveButtonClick(campaignId, data);
      }
    },
    [dispatch, campaignId, trackSaveButtonClick],
  );

  const handleBulkUpdateRemaining = useCallback(
    (data: TUpdateRemainingGiftLimitsRequest) => {
      if (campaignId) {
        dispatch(updateProspectingGiftingLimitsRemainingById({ ...data, campaignId }));
        trackSaveButtonClick(campaignId, data);
      }
    },
    [dispatch, campaignId, trackSaveButtonClick],
  );

  return (
    <CampaignSettings.Layout2Columns>
      <InvitesForm
        onSubmit={handleUpdateGiftLimits}
        onFetchGiftLimits={handleFetchGiftLimits}
        onBulkEdit={handleUpdateGiftLimits}
        onBulkUpdateRemaining={handleBulkUpdateRemaining}
      >
        {({ isDirty }) => <EditorFooter loading={isUpdatePending} disabled={!isDirty} />}
      </InvitesForm>
    </CampaignSettings.Layout2Columns>
  );
};

export default EditorInvitesPage;
