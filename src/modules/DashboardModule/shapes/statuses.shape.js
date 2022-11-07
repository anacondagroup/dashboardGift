import PropTypes from 'prop-types';

export const statusesShape = PropTypes.shape({
  created_and_queued_for_research: PropTypes.number,
  requiring_attention: PropTypes.number,
  invite_options_ready: PropTypes.number,
  disabled: PropTypes.number,
  scheduled_to_be_sent: PropTypes.number,
  address_being_verified: PropTypes.number,
  queued_for_shipping: PropTypes.number,
  awaiting_fulfilment: PropTypes.number,
  in_transit: PropTypes.number,
  delivered_but_now_viewed: PropTypes.number,
  bounced_or_returned: PropTypes.number,
  viewed: PropTypes.number,
  expired: PropTypes.number,
  accepted: PropTypes.number,
  declined: PropTypes.number,
  accepted_and_meeting_booked: PropTypes.number,
  created_and_not_viewed: PropTypes.number,
});

export const statusShape = PropTypes.shape({
  title: PropTypes.string,
  icon: PropTypes.string,
  count: PropTypes.number,
  color: PropTypes.string,
});
