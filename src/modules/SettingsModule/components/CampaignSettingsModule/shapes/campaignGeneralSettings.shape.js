import PropTypes from 'prop-types';

export const campaignGeneralSettingsShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  notifications: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  owner: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  send_as: PropTypes.object,
  team_name: PropTypes.string.isRequired,
});
