import PropTypes from 'prop-types';

export const kpiShape = PropTypes.shape({
  booked: PropTypes.number,
  sent: PropTypes.number,
  delivered: PropTypes.number,
  viewed: PropTypes.number,
  accepted: PropTypes.number,
  sentToBooked: PropTypes.number,
  viewToBooked: PropTypes.number,
  sentToView: PropTypes.number,
});
