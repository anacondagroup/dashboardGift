import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  campaignSwagInvitesSettingsLoadRequest,
  campaignSwagUpdateBudgetRequest,
  campaignGiftUpdateRequiredActionsRequest,
} from '../store/campaign/swagInvites/swagInvites.actions';
import {
  getCampaignSwagInvitesSettings,
  getCampaignSettingsIsLoading,
  getCampaignSettingsIsLoaded,
  getCampaignSettingsErrors,
} from '../store/campaign/swagInvites/swagInvites.selectors';

export const useSwagInvitesSettings = campaignId => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(campaignSwagInvitesSettingsLoadRequest(campaignId));
  }, [campaignId, dispatch]);

  const settings = useSelector(getCampaignSwagInvitesSettings);
  const isLoading = useSelector(getCampaignSettingsIsLoading);
  const isLoaded = useSelector(getCampaignSettingsIsLoaded);
  const errors = useSelector(getCampaignSettingsErrors);
  const onSaveBudget = useCallback(budget => dispatch(campaignSwagUpdateBudgetRequest(budget)), [dispatch]);
  const onSaveRequiredActions = useCallback(
    (canOverrideAll, actions) =>
      dispatch(
        campaignGiftUpdateRequiredActionsRequest({
          campaign_id: campaignId,
          can_override_required_actions: canOverrideAll,
          required_actions: actions,
        }),
      ),
    [campaignId, dispatch],
  );
  return { settings, isLoading, isLoaded, onSaveBudget, onSaveRequiredActions, errors };
};
