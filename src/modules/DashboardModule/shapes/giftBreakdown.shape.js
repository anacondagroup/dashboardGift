import PropTypes from 'prop-types';

export const giftBreakdownShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  recipientId: PropTypes.number.isRequired,
  fullName: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  gift: PropTypes.string.isRequired,
  campaign: PropTypes.string.isRequired,
  sentBy: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  sentOn: PropTypes.string.isRequired,
  giftStatus: PropTypes.string.isRequired,
  canChooseOptions: PropTypes.bool.isRequired,
});
