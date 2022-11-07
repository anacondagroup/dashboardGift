import PropTypes from 'prop-types';

export const contactShape = PropTypes.shape({
  id: PropTypes.number,
  fullName: PropTypes.string,
  avatar: PropTypes.string,
  email: PropTypes.string,
  giftsSent: PropTypes.number,
  giftsAccepted: PropTypes.number,
  lastContact: PropTypes.string,
});
