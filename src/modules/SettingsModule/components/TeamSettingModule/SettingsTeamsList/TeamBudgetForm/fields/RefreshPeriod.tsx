import React, { memo } from 'react';
import { Box, FormControl, FormHelperText, MenuItem, Select, Theme } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BudgetCreateField, RefreshPeriod, TBudgetCreateParams } from '@alycecom/services';

interface IRefreshPeriodSelectorProps {
  control: Control<TBudgetCreateParams>;
  error?: string;
}

const styles = {
  renderValue: {
    color: ({ palette }: Theme) => palette.primary.main,
  },
} as const;

const getRenderValue = (value: string): JSX.Element => (
  <Box sx={styles.renderValue}>{value === RefreshPeriod.NoReset ? value : `${value} reset`}</Box>
);

const RefreshPeriodSelector = ({ control, error }: IRefreshPeriodSelectorProps): JSX.Element => (
  <Controller
    name={BudgetCreateField.RefreshPeriod}
    control={control}
    render={({ field: { onChange, value } }) => (
      <FormControl fullWidth variant="outlined" error={!!error}>
        <Select
          labelId="RefreshPeriod.Select.Label"
          id="RefreshPeriod.Select.Label"
          value={value ?? ''}
          onChange={onChange}
          data-testid="RefreshPeriod.Select"
          renderValue={getRenderValue}
          IconComponent={ExpandMoreIcon}
        >
          {Object.values(RefreshPeriod).map(refreshPeriod => (
            <MenuItem key={refreshPeriod} data-testid={`RefreshPeriodOption.${refreshPeriod}`} value={refreshPeriod}>
              {refreshPeriod === RefreshPeriod.NoReset ? RefreshPeriod.NoReset : `${refreshPeriod} reset`}
            </MenuItem>
          ))}
        </Select>
        {!!error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    )}
  />
);
export default memo(RefreshPeriodSelector);
