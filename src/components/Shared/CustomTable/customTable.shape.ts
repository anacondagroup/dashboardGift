import PropTypes from 'prop-types';

export const CustomTableColumnShape = PropTypes.shape({
  name: PropTypes.string,
  field: PropTypes.string,
  isSortDisabled: PropTypes.bool,
  formatValue: PropTypes.func,
  getValue: PropTypes.func,
});

export const CustomTableRowDataItemShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
});
