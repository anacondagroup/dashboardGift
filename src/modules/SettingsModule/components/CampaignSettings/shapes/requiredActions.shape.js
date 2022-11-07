import PropTypes from 'prop-types';

export const requiredActionsShape = PropTypes.shape({
  capture_date: PropTypes.bool.isRequired,
  capture_email: PropTypes.bool.isRequired,
  capture_phone: PropTypes.bool.isRequired,
  capture_affidavit: PropTypes.bool.isRequired,
  gifter_affidavit: PropTypes.string.isRequired,
  capture_question: PropTypes.bool.isRequired,
  gifter_question: PropTypes.string.isRequired,
});
