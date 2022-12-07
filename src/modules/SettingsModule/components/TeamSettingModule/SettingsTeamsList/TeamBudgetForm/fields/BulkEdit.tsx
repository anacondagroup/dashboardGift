import React, { memo } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MenuItem, Select, Tooltip } from '@mui/material';

import { BudgetBulkEditOption } from '../../../../../../../store/budgetUtilization/budgetUtilization.types';

const styles = {
  selector: {
    fontSize: '0.9rem',
    textTransform: 'none',
    '> .MuiSelect-select': {
      py: 1,
    },
  },
} as const;

interface IBulkEditSelectorProps {
  onChange: (value: string) => void;
}

const BulkEditSelector = ({ onChange }: IBulkEditSelectorProps): JSX.Element => (
  <Select
    labelId="BulkEdit.Select.Label"
    id="BulkEdit.Select.Label"
    value="Bulk edit amount"
    renderValue={value => `${value}`}
    onChange={event => onChange(event.target.value)}
    IconComponent={ExpandMoreIcon}
    data-testid="BulkEdit.Select"
    sx={styles.selector}
  >
    <MenuItem
      key={BudgetBulkEditOption.GiftBudget}
      data-testid={`BulkEditOption.${BudgetBulkEditOption.GiftBudget}`}
      value={BudgetBulkEditOption.GiftBudget}
    >
      {BudgetBulkEditOption.GiftBudget}
    </MenuItem>
    <Tooltip id="BulkEdit.BulkEditOption.Tooltip" title="Coming soon!">
      <span>
        <MenuItem
          key={BudgetBulkEditOption.AddOneOff}
          data-testid={`BulkEditOption.${BudgetBulkEditOption.AddOneOff}`}
          value={BudgetBulkEditOption.AddOneOff}
          disabled
        >
          {BudgetBulkEditOption.AddOneOff}
        </MenuItem>
      </span>
    </Tooltip>
  </Select>
);
export default memo(BulkEditSelector);
