import PropTypes from 'prop-types';

export const teamBreakdownShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  giftsSent: PropTypes.number.isRequired,
  giftsViewed: PropTypes.string.isRequired,
  giftsAccepted: PropTypes.string.isRequired,
  meetingsBooked: PropTypes.string.isRequired,
});
