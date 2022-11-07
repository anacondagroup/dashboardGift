import React, { memo } from 'react';
import { FormControl, FormHelperText, MenuItem, Select, Theme } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  BudgetCreateField,
  BudgetType,
  TBudgetCreateParams,
} from '../../../../../store/teams/budgetCreate/budgetCreate.types';

const styles = {
  select: {
    '& .MuiSelect-select.Mui-disabled': {
      backgroundColor: ({ palette }: Theme) => palette.common.white,
      WebkitTextFillColor: ({ palette }: Theme) => palette.grey.main,
    },
  },
} as const;

interface IBudgetTypeSelectorProps {
  control: Control<TBudgetCreateParams>;
  error?: string;
}

const BudgetTypeSelector = ({ control, error }: IBudgetTypeSelectorProps): JSX.Element => (
  <Controller
    name={BudgetCreateField.Type}
    control={control}
    render={({ field: { onChange } }) => (
      <FormControl fullWidth variant="outlined" error={!!error}>
        <Select
          labelId="BudgetType.Select.Label"
          id="BudgetType.Select.Label"
          value={BudgetType.User}
          renderValue={value => `${value[0].toUpperCase() + value.slice(1)} gift budgets`}
          disabled
          onChange={onChange}
          IconComponent={ExpandMoreIcon}
          data-testid="BudgetType.Select"
          sx={styles.select}
        >
          {Object.values(BudgetType).map(budgetType => (
            <MenuItem key={budgetType} data-testid={`BudgetTypeOption.${budgetType}`} value={budgetType}>
              {budgetType}
            </MenuItem>
          ))}
        </Select>
        {!!error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    )}
  />
);
export default memo(BudgetTypeSelector);
