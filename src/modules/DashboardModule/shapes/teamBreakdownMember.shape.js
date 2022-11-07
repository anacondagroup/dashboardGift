import PropTypes from 'prop-types';

export const teamBreakdownMemberShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  giftsAccepted: PropTypes.string.isRequired,
  giftsSent: PropTypes.number.isRequired,
  giftsViewed: PropTypes.string.isRequired,
  meetingsBooked: PropTypes.string.isRequired,
});
