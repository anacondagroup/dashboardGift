import PropTypes from 'prop-types';

export const memberShape = PropTypes.shape({
  id: PropTypes.number,
  fullName: PropTypes.string,
  avatar: PropTypes.string,
  email: PropTypes.string,
});
