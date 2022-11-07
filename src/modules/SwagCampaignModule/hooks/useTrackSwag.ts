import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '@alycecom/modules';

import { SwagCampaignBuilderStep } from '../routePaths';
import { trackSwagCampaignEvent, TTrackSwagCampaignEventPayload } from '../events';

export const useTrackSwagCampaignEvent = <Options = TTrackSwagCampaignEventPayload>(
  name: string,
): ((id: number | null, data?: Options) => void) => {
  const dispatch = useDispatch();
  const [payload, options] = useSelector(User.selectors.getBaseEventPayload);

  return useCallback(
    (id: number | null, data?: Options) => {
      dispatch(trackSwagCampaignEvent(name, { ...payload, id, data }, options));
    },
    [payload, options, name, dispatch],
  );
};

export const useTrackSwagCampaignBuilderNextButtonClicked = (
  step: SwagCampaignBuilderStep,
): ((draftId: number | null, formValues?: TTrackSwagCampaignEventPayload) => void) =>
  useTrackSwagCampaignEvent(`Swag Campaign Builder - ${step} - Next Button Clicked`);

export const useTrackSwagCampaignBuilderCreateButtonClicked = (): ((
  draftId: number | null,
  formValues?: TTrackSwagCampaignEventPayload,
) => void) =>
  useTrackSwagCampaignEvent(
    `Swag Campaign Builder - ${SwagCampaignBuilderStep.Finalize} - Create Campaign Button Clicked`,
  );
