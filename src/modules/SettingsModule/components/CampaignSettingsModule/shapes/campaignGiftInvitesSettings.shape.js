import PropTypes from 'prop-types';

export const campaignGiftInvitesCustomisationSettingsShape = PropTypes.shape({
  redirect_url: PropTypes.string,
  redirect_header: PropTypes.string,
  redirect_body: PropTypes.string,
  redirect_button: PropTypes.string,
  recipient_video: PropTypes.string,
});

export const campaignGiftInvitesSettingsShape = PropTypes.shape({
  can_override_gift_default_budget: PropTypes.bool.isRequired,
  enterprise_gift_card_price: PropTypes.number.isRequired,
  enterprise_max_price: PropTypes.number.isRequired,
  enterprise_min_price: PropTypes.number.isRequired,
  gift_default_budget: PropTypes.number.isRequired,
  gift_expiration: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  disabled_gift_invitation_method_ids: PropTypes.array.isRequired,
  gift_limits_count: PropTypes.number.isRequired,
  gift_limits_period: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  required_actions: PropTypes.object.isRequired,
  customisation: campaignGiftInvitesCustomisationSettingsShape,
});

export const campaignCurrencyShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  sign: PropTypes.string.isRequired,
});
