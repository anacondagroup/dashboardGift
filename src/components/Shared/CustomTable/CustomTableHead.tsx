import React, { memo } from 'react';
import { TableCell, TableHead, TableRow, TableSortLabel, Checkbox } from '@mui/material';

import { ICustomTableColumn, IRowDataItem } from './CustomTable.types';
import { TABLE_SORT } from './customTable.constants';

export interface ICustomTableRowProps<T extends IRowDataItem> {
  columns: ICustomTableColumn<T>[];
  sortDirection: TABLE_SORT;
  multiselect?: boolean;
  selectedTotal: number;
  selectedCount?: number;
  onSortChange: (field: string) => void;
  sortField?: string;
  onSelectAll?: (checked: boolean) => void;
}

const CustomTableHead = <T extends IRowDataItem>({
  columns,
  sortDirection,
  sortField = '',
  multiselect = false,
  selectedCount = 0,
  selectedTotal,
  onSortChange,
  onSelectAll = () => {},
}: ICustomTableRowProps<T>): JSX.Element => (
  <TableHead>
    <TableRow>
      {multiselect && (
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={selectedCount > 0 && selectedCount < selectedTotal}
            checked={selectedTotal > 0 && selectedCount === selectedTotal}
            onChange={(_, checked) => onSelectAll(checked)}
          />
        </TableCell>
      )}
      {columns.map(column => (
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
      <TableCell key="action" />
    </TableRow>
  </TableHead>
);

export default memo<typeof CustomTableHead>(CustomTableHead);
