import PropTypes from 'prop-types';

export const ColumnType = PropTypes.shape({
  name: PropTypes.string,
  field: PropTypes.string,
  isSortDisabled: PropTypes.bool,
  formatValue: PropTypes.func,
  getValue: PropTypes.func,
});

export const PaginationType = PropTypes.shape({
  current_page: PropTypes.number.isRequired,
  total: PropTypes.number,
  per_page: PropTypes.number,
});
