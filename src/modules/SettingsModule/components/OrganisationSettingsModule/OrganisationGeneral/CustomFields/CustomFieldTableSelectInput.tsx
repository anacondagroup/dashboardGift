import React, { useCallback } from 'react';
import { MenuItem, Select, SelectProps } from '@mui/material';
import PropTypes from 'prop-types';

export interface ICustomFieldTableSelectInputProps
  extends Omit<SelectProps, 'onChange' | 'variant' | 'value' | 'fullWidth'> {
  index: number;
  field: string;
  value: string;
  onChange: ({ field, index, value }: { field: string; index: number; value: string }) => void;
  options: Record<string, string>;
}

const CustomFieldTableSelectInput = ({
  index,
  field,
  value,
  onChange,
  options,
  ...selectProps
}: ICustomFieldTableSelectInputProps): React.ReactElement => {
  const onChangeHandler = useCallback(
    event => {
      onChange({ field, index, value: event.target.value });
    },
    [field, index, onChange],
  );

  return (
    <Select
      data-testid={`OrgSettings.CustomFields.FieldNameInput.${field}.${index}`}
      onChange={onChangeHandler}
      variant="outlined"
      value={value}
      fullWidth
      {...selectProps}
    >
      {Object.entries(options).map(([label, optionValue]) => (
        <MenuItem key={label} value={optionValue}>
          {label}
        </MenuItem>
      ))}
    </Select>
  );
};

CustomFieldTableSelectInput.propTypes = {
  index: PropTypes.number.isRequired,
  field: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CustomFieldTableSelectInput;
