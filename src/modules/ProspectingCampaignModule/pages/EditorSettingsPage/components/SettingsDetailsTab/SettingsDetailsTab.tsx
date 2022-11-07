import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DetailsForm from '../../../../components/DetailsForm/DetailsForm';
import EditorFooter from '../../../EditProspectingCampaignPage/components/EditorFooter/EditorFooter';
import { useProspecting } from '../../../../hooks';
import { updateProspectingDetails } from '../../../../store/prospectingCampaign/steps/details/details.actions';
import { TDetailsFormValues } from '../../../../store/prospectingCampaign/steps/details/details.schemas';
import { detailsFormValuesToData } from '../../../../store/prospectingCampaign/steps/details/details.helpers';
import { getIsDetailsPending } from '../../../../store/prospectingCampaign/steps/details/details.selectors';
import { useTrackProspectingCampaignEditorSaveButtonClicked } from '../../../../hooks/useTrackProspecting';
import { ProspectingEditorTabs } from '../../../../routePaths';

const SettingsDetailsTab = (): JSX.Element => {
  const dispatch = useDispatch();
  const { campaignId } = useProspecting();
  const isPending = useSelector(getIsDetailsPending);
  const trackSaveButtonClick = useTrackProspectingCampaignEditorSaveButtonClicked(ProspectingEditorTabs.Details);

  const handleSubmit = useCallback(
    (data: TDetailsFormValues) => {
      if (campaignId) {
        const formData = detailsFormValuesToData(data);
        dispatch(updateProspectingDetails({ ...formData, id: campaignId }));
        trackSaveButtonClick(campaignId, formData);
      }
    },
    [dispatch, campaignId, trackSaveButtonClick],
  );

  return (
    <DetailsForm onSubmit={handleSubmit}>
      {({ isDirty }) => <EditorFooter loading={isPending} disabled={!isDirty} />}
    </DetailsForm>
  );
};

export default SettingsDetailsTab;
