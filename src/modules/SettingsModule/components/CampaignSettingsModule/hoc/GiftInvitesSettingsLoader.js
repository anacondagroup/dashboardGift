import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { TrackEvent } from '@alycecom/services';

import {
  campaignGiftInvitesSettingsLoadRequest,
  campaignGiftUpdateBudgetRequest,
  campaignGiftUpdateRequiredActionsRequest,
  campaignGiftUpdateExpirationRequest,
  campaignGiftUpdateVideoMessageRequest,
  campaignGiftUpdateRedirectRequest,
} from '../../../store/campaign/giftInvites/giftInvites.actions';
import {
  getCampaignGiftInvitesSettings,
  getCampaignSettingsIsLoading,
  getCampaignSettingsErrors,
  getCampaignGiftCustomisationSettings,
  getCampaignCurrencies,
} from '../../../store/campaign/giftInvites/giftInvites.selectors';
import useTeamCurrency from '../../../../../hooks/useTeamCurrency';

const GiftInvitesSettingsLoader = ({ campaignId, render }) => {
  const { trackEvent } = TrackEvent.useTrackEvent();
  const dispatch = useDispatch();
  const invitesErrors = useSelector(getCampaignSettingsErrors);
  const campaignInvites = useSelector(getCampaignGiftInvitesSettings);
  const customisation = useSelector(getCampaignGiftCustomisationSettings);
  const isLoading = useSelector(getCampaignSettingsIsLoading);
  const currency = useTeamCurrency(campaignId);
  const campaignCurrencies = useSelector(getCampaignCurrencies);

  const onSaveBudget = useCallback(payload => dispatch(campaignGiftUpdateBudgetRequest(payload)), [dispatch]);

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

  const onSaveGiftExpiration = useCallback(
    period =>
      dispatch(
        campaignGiftUpdateExpirationRequest({
          campaignId,
          period,
        }),
      ),
    [campaignId, dispatch],
  );

  const onSaveGiftRedirect = useCallback(
    ({ redirectUrl, redirectHeader, redirectMessage, redirectButton, redirectConfirmed }) => {
      trackEvent('Campaign settings - save redirect CTA', {
        campaignId,
        redirectUrl,
        redirectHeader,
        redirectMessage,
        redirectButton,
        redirectConfirmed,
      });
      dispatch(
        campaignGiftUpdateRedirectRequest({
          campaign_id: campaignId,
          redirect_url: redirectUrl,
          redirect_header: redirectHeader,
          redirect_message: redirectMessage,
          redirect_button: redirectButton,
          redirect_confirm: redirectConfirmed,
        }),
      );
    },
    [campaignId, dispatch, trackEvent],
  );

  const onSaveGiftVideo = useCallback(
    ({ videoMessageValue, allowOverrideOnGift, vidyardImageValue, vidyardVideoValue, typeValue }) =>
      dispatch(
        campaignGiftUpdateVideoMessageRequest({
          campaign_id: campaignId,
          recipient_video: videoMessageValue,
          can_override_recipient_video: allowOverrideOnGift,
          recipient_video_type: typeValue,
          vidyard_video: vidyardVideoValue,
          vidyard_image: vidyardImageValue,
        }),
      ),
    [campaignId, dispatch],
  );

  useEffect(() => {
    dispatch(campaignGiftInvitesSettingsLoadRequest(campaignId));
  }, [campaignId, dispatch]);

  return render({
    campaign: campaignInvites,
    customisation,
    isLoading,
    invitesErrors,
    onSaveBudget,
    onSaveRequiredActions,
    onSaveGiftExpiration,
    onSaveGiftRedirect,
    onSaveGiftVideo,
    currency,
    campaignCurrencies,
  });
};

GiftInvitesSettingsLoader.propTypes = {
  campaignId: PropTypes.number.isRequired,
  render: PropTypes.func.isRequired,
};

export default GiftInvitesSettingsLoader;
