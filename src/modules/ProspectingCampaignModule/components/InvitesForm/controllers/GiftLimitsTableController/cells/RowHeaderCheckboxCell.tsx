import React, { memo } from 'react';
import { TableHeaderProps } from 'react-virtualized';
import { Checkbox } from '@mui/material';

const styles = {
  checkbox: {
    padding: 0,
  },
} as const;

export interface IRowHeaderCheckboxCellProps extends TableHeaderProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
}

const RowHeaderCheckboxCell = ({
  checked,
  onChange,
  indeterminate = false,
  disabled = false,
}: IRowHeaderCheckboxCellProps): JSX.Element => (
  <Checkbox
    color="primary"
    indeterminate={indeterminate}
    onChange={(event, isChecked) => onChange(isChecked)}
    checked={checked}
    disabled={disabled}
    sx={styles.checkbox}
  />
);

export default memo(RowHeaderCheckboxCell);
