import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MessagingForm from '../../../../components/MessagingForm/MessagingForm';
import EditorFooter from '../../../EditProspectingCampaignPage/components/EditorFooter/EditorFooter';
import { getIsMessagingPending } from '../../../../store/prospectingCampaign/steps/messaging/messaging.selectors';
import { useProspecting } from '../../../../hooks';
import { TProspectingMessaging } from '../../../../store/prospectingCampaign/prospectingCampaign.types';
import { updateProspectingMessaging } from '../../../../store/prospectingCampaign/steps/messaging/messaging.actions';
import { useTrackProspectingCampaignEditorSaveButtonClicked } from '../../../../hooks/useTrackProspecting';
import { ProspectingEditorTabs } from '../../../../routePaths';

const SettingsMessagingTab = (): JSX.Element => {
  const { campaignId } = useProspecting();
  const dispatch = useDispatch();
  const isPending = useSelector(getIsMessagingPending);
  const trackSaveButtonClick = useTrackProspectingCampaignEditorSaveButtonClicked(ProspectingEditorTabs.Messaging);

  const handleSubmit = useCallback(
    (data: TProspectingMessaging) => {
      if (campaignId) {
        dispatch(updateProspectingMessaging({ id: campaignId, ...data }));
        trackSaveButtonClick(campaignId, data);
      }
    },
    [dispatch, campaignId, trackSaveButtonClick],
  );

  return (
    <MessagingForm onSubmit={handleSubmit}>
      {({ isDirty }) => <EditorFooter loading={isPending} disabled={!isDirty} />}
    </MessagingForm>
  );
};

export default SettingsMessagingTab;
