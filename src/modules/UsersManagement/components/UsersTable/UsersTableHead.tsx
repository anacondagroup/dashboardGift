import React, { memo, useCallback } from 'react';
import { TableCell, TableHead, TableRow, TableSortLabel, Checkbox } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { IOffsetPagination } from '@alycecom/services';

import { IRowDataItem } from '../../../../components/Shared/CustomTable/CustomTable.types';
import { ICustomTableRowProps } from '../../../../components/Shared/CustomTable/CustomTableHead';
import SelectAllSection from '../../../../components/Shared/CustomTable/SelectAllSection';

const useStyles = makeStyles(({ palette }) => ({
  selectCounterCell: {
    textTransform: 'none',
    color: palette.text.primary,
  },
}));

export interface IUsersTableRowProps<T extends IRowDataItem> extends ICustomTableRowProps<T> {
  isAllSelected: boolean;
  isSelectAllSectionVisible: boolean;
  pagination: IOffsetPagination;
  pageSelectedCount: number;
  onToggleSelection?: (isAllSelected: boolean) => void;
}

const UsersTableHead = <T extends IRowDataItem>({
  columns,
  sortDirection,
  sortField = '',
  multiselect = false,
  isAllSelected,
  isSelectAllSectionVisible,
  pagination,
  selectedCount = 0,
  selectedTotal,
  pageSelectedCount = 0,
  onSortChange,
  onSelectAll = () => {},
  onToggleSelection = () => {},
}: IUsersTableRowProps<T>): JSX.Element => {
  const classes = useStyles();

  const canSelectAllItems = isSelectAllSectionVisible && pagination.total > pagination.limit;
  const isSelectedUsersCountVisible = selectedCount > 0 && !isAllSelected;

  const handleSelectAll = useCallback(
    (_, checked) => {
      onSelectAll(checked);
    },
    [onSelectAll],
  );

  return (
    <TableHead>
      <TableRow>
        {multiselect && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={pageSelectedCount > 0 && pageSelectedCount < selectedTotal}
              checked={pageSelectedCount > 0 && pageSelectedCount === selectedTotal}
              onChange={handleSelectAll}
            />
          </TableCell>
        )}
        {isSelectedUsersCountVisible && (
          <TableCell className={classes.selectCounterCell}>
            {selectedCount} selected user{selectedCount === 1 ? '' : 's'}
          </TableCell>
        )}
        {(isSelectedUsersCountVisible ? columns.slice(1) : columns).map(column => (
          <TableCell key={column.field}>
            {!column.isSortDisabled && (
              <TableSortLabel
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
      {canSelectAllItems && (
        <TableRow>
          <TableCell colSpan={6}>
            <SelectAllSection
              isAllSelected={isAllSelected}
              itemsName="users"
              selectedAmount={selectedCount}
              totalAmount={pagination.total}
              onToggleSelection={onToggleSelection}
            />
          </TableCell>
        </TableRow>
      )}
    </TableHead>
  );
};

export default memo<typeof UsersTableHead>(UsersTableHead);
