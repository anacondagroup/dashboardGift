import React, { memo } from 'react';
import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';
import classNames from 'classnames';

import { IRowDataItem } from '../../../../../components/Shared/CustomTable/CustomTable.types';
import { ICustomTableRowProps } from '../../../../../components/Shared/CustomTable/CustomTableHead';

const useStyles = makeStyles<AlyceTheme>(({ breakpoints, palette }) => ({
  selectCounterCell: {
    textTransform: 'none',
    color: palette.text.primary,
  },
  rightColumnHead: {
    flexDirection: 'row',
  },
  typeColumn: {
    [breakpoints.down(breakpoints.values.xl)]: {
      width: 160,
    },
    [breakpoints.up(breakpoints.values.xl)]: {
      width: 245,
    },
  },
}));

export interface ICampaignTableHeadProps<T extends IRowDataItem> extends ICustomTableRowProps<T> {
  pageCount: number;
  pageSelectedCount: number;
  onToggleSelectAll: (checked: boolean) => void;
  onResetSelection: () => void;
  isLoading: boolean;
}

const CampaignTableHead = <T extends IRowDataItem>({
  columns,
  sortDirection,
  sortField = '',
  onSortChange,
  pageCount,
  pageSelectedCount,
  selectedTotal,
  onToggleSelectAll,
  onResetSelection,
  isLoading,
}: ICampaignTableHeadProps<T>): JSX.Element => {
  const classes = useStyles();

  const checked = pageSelectedCount > 0 && pageSelectedCount === pageCount;
  const indeterminate = selectedTotal > 0 && (pageSelectedCount < pageCount || pageCount === 0);
  const disabled = isLoading || (pageCount === 0 && selectedTotal === 0);

  const handleChangeSelectAll = (_: unknown, newChecked: boolean) => {
    if (checked || (indeterminate && pageCount === 0)) {
      onResetSelection();
    } else {
      onToggleSelectAll(newChecked);
    }
  };

  const showSelectCounter = selectedTotal > 0;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={indeterminate}
            checked={checked}
            disabled={disabled}
            onChange={handleChangeSelectAll}
            data-testid="CampaignsManagement.SelectAll"
          />
        </TableCell>
        {showSelectCounter && (
          <TableCell
            align={columns[0]?.align}
            className={classes.selectCounterCell}
            style={{ width: columns[0]?.width }}
          >
            {selectedTotal} selected campaign{selectedTotal === 1 ? '' : 's'}
          </TableCell>
        )}
        {(showSelectCounter ? columns.slice(1) : columns).map(column => (
          <TableCell
            key={column.field}
            align={column.align}
            className={classNames({ [classes.typeColumn]: column.field === 'type' })}
            style={{ width: column.width }}
          >
            {!column.isSortDisabled && (
              <TableSortLabel
                className={classes.rightColumnHead}
                direction={sortDirection}
                active={sortField === column.field}
                onClick={() => onSortChange(column.field)}
              >
                {column.name}
              </TableSortLabel>
            )}
            {column.isSortDisabled && column.name}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default memo<typeof CampaignTableHead>(CampaignTableHead);
