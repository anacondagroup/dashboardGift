import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '@alycecom/modules';

import { ProspectingBuilderStep, ProspectingEditorStep, ProspectingEditorTabs } from '../routePaths';
import { trackProspectingCampaignEvent, TTrackProspectingCampaignEventPayload } from '../events';

export const useTrackProspectingCampaignEvent = <Options = TTrackProspectingCampaignEventPayload>(
  name: string,
): ((id: number | null, data?: Options) => void) => {
  const dispatch = useDispatch();
  const [payload, options] = useSelector(User.selectors.getBaseEventPayload);

  return useCallback(
    (id: number | null, data?: Options) => {
      dispatch(trackProspectingCampaignEvent(name, { ...payload, id, data }, options));
    },
    [dispatch, payload, options, name],
  );
};

export const useTrackProspectingCampaignBuilderNextButtonClicked = (
  step: ProspectingBuilderStep,
): ((draftId: number | null, formValues?: TTrackProspectingCampaignEventPayload) => void) =>
  useTrackProspectingCampaignEvent(`Prospecting Campaign Builder - ${step} - Next Button clicked`);

export const useTrackProspectingCampaignEditorSaveButtonClicked = (
  tab: ProspectingEditorTabs | ProspectingEditorStep.Invites,
): ((campaignId: number, formValues?: TTrackProspectingCampaignEventPayload) => void) =>
  useTrackProspectingCampaignEvent(`Prospecting Campaign Editor - ${tab} - Save Button clicked`);
