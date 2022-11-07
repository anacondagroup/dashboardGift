import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import GiftingForm from '../../../../components/GiftingForm/GiftingForm';
import EditorFooter from '../../../EditProspectingCampaignPage/components/EditorFooter/EditorFooter';
import { getIsGiftingPending } from '../../../../store/prospectingCampaign/steps/gifting/gifting.selectors';
import { useProspecting } from '../../../../hooks';
import { updateProspectingGifting } from '../../../../store/prospectingCampaign/steps/gifting/gifting.actions';
import { formValueToData } from '../../../../store/prospectingCampaign/steps/gifting/gifting.helpers';
import { TProspectingGiftingForm } from '../../../../store/prospectingCampaign/steps/gifting/gifting.types';
import { useTrackProspectingCampaignEditorSaveButtonClicked } from '../../../../hooks/useTrackProspecting';
import { ProspectingEditorTabs } from '../../../../routePaths';

const SettingsGiftTab = (): JSX.Element => {
  const dispatch = useDispatch();
  const { campaignId } = useProspecting();
  const isPending = useSelector(getIsGiftingPending);
  const trackSaveButtonClick = useTrackProspectingCampaignEditorSaveButtonClicked(ProspectingEditorTabs.Gift);

  const handleSubmit = useCallback(
    (values: TProspectingGiftingForm) => {
      if (campaignId) {
        const formData = formValueToData(values);
        dispatch(
          updateProspectingGifting({
            ...formData,
            id: campaignId,
          }),
        );
        trackSaveButtonClick(campaignId, formData);
      }
    },
    [dispatch, campaignId, trackSaveButtonClick],
  );

  return (
    <GiftingForm onSubmit={handleSubmit}>
      {({ isDirty }) => <EditorFooter loading={isPending} disabled={!isDirty} />}
    </GiftingForm>
  );
};

export default SettingsGiftTab;
