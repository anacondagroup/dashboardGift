import React, { memo } from 'react';
import ReactNumberFormat from 'react-number-format';
import { TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

import { BudgetCreateField, TBudgetCreateParams } from '../../../../../store/teams/budgetCreate/budgetCreate.types';
import {
  BUDGET_SELECT_MAX_RANGE,
  BUDGET_SELECT_MIN_RANGE,
} from '../../../../../constants/teamSidebarProgress.constants';

interface ITeamBudgetProps {
  control: Control<TBudgetCreateParams>;
  error?: string;
}

const TeamBudget = ({ control, error }: ITeamBudgetProps): JSX.Element => (
  <Controller
    control={control}
    name={BudgetCreateField.Amount}
    render={({ field: { onChange, value } }) => (
      <ReactNumberFormat
        onValueChange={({ floatValue }) => {
          onChange(floatValue);
        }}
        onFocus={event => event.target.setSelectionRange(BUDGET_SELECT_MIN_RANGE, BUDGET_SELECT_MAX_RANGE)}
        decimalScale={2}
        allowNegative={false}
        customInput={TextField}
        disabled
        thousandSeparator
        prefix="$"
        placeholder="$"
        InputLabelProps={{ shrink: true }}
        value={value ?? ''}
        variant="outlined"
        error={!!error}
        helperText={error}
        inputProps={{
          min: 0,
        }}
        data-testid="TeamMembersBudget.TeamBudget"
      />
    )}
  />
);
export default memo(TeamBudget);
