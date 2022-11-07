import React from 'react';
import PropTypes from 'prop-types';
import { CustomDataEditor } from '@alycecom/ui';

import { placeholderShape } from '../shapes/placeholder.shape';

export const MessageControl = ({ value, error, customData, disabled, charsLimit, ...formProps }) => (
  <CustomDataEditor
    message={value}
    errors={[error]}
    customData={customData}
    disabled={disabled}
    charsLimit={charsLimit}
    textFieldProps={{
      error: !!error,
      rows: 8,
    }}
    {...formProps}
  />
);

MessageControl.propTypes = {
  customData: PropTypes.arrayOf(placeholderShape),
  disabled: PropTypes.bool,
  error: PropTypes.string,
  value: PropTypes.string.isRequired,
  charsLimit: PropTypes.number.isRequired,
};

MessageControl.defaultProps = {
  customData: [],
  disabled: false,
  error: '',
};
