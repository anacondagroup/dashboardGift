import PropTypes from 'prop-types';

export const marketoApiDataShape = PropTypes.shape({
  uuid: PropTypes.string,
  status: PropTypes.string,
  statusDescription: PropTypes.string,
  apiUrl: PropTypes.string,
  clientId: PropTypes.string,
  clientSecret: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
});
