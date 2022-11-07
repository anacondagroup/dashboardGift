import React, { memo, useCallback, useState } from 'react';
import { Box, TableCell, TableCellProps, TableHead, TableRow, TableSortLabel, Theme } from '@mui/material';
import { SortDirection } from '@alycecom/utils';
import { TRoiTableSort } from '@alycecom/services';

import { TRoiColumn } from './roiTable.types';
import RoiHeaderColumnMessage from './RoiHeaderColumnMessage';

const defineJustifyContent = (align: TableCellProps['align']) => {
  switch (align) {
    case 'center':
      return 'center';
    case 'right':
      return 'flex-end';
    default:
      return 'flex-start';
  }
};

const styles = {
  headerCell: {
    fontSize: '12px',
    padding: ({ spacing }: Theme) => spacing(2, 2, 2, 1),
  },
  sortableHeaderCell: {
    padding: ({ spacing }: Theme) => spacing(2, 4, 2, 1),
  },
  tooltip: {
    width: 190,
  },
  sortIcon: {
    '& .MuiTableSortLabel-icon': {
      position: 'absolute',
      top: '50%',
      marginTop: '-9px',
      right: '-40px',
    },
  },
} as const;

export interface IRoiTableHeadProps<RowItem> extends TRoiTableSort<RowItem> {
  columns: TRoiColumn<RowItem>[];
  onSortChange?: (args: TRoiTableSort<RowItem>) => void;
}

const RoiTableHead = <RoiItem,>({
  field,
  direction,
  columns,
  onSortChange = () => {},
}: IRoiTableHeadProps<RoiItem>): JSX.Element => {
  const [currentField, setCurrentField] = useState<keyof RoiItem | undefined>(field);
  const [currentDirection, setCurrentDirection] = useState<SortDirection | undefined>(direction);

  const handleSortChange = useCallback(
    (newSortField: typeof columns[number]['field']) => {
      const newDirection =
        newSortField === currentField && currentDirection === SortDirection.desc
          ? SortDirection.asc
          : SortDirection.desc;
      setCurrentField(newSortField);
      setCurrentDirection(newDirection);
      onSortChange({ field: newSortField, direction: newDirection });
    },
    [currentField, currentDirection, onSortChange],
  );

  return (
    <TableHead>
      <TableRow>
        {columns.map(column => (
          <TableCell
            key={`column-${column.label}`}
            align={column.align}
            sx={[styles.headerCell, !!column.isSortable && styles.sortableHeaderCell]}
          >
            <Box display="flex" alignItems="center" justifyContent={defineJustifyContent(column.align)}>
              {column.isSortable ? (
                <TableSortLabel
                  direction={currentDirection}
                  active={currentField === column.field}
                  onClick={() => handleSortChange(column.field)}
                  sx={styles.sortIcon}
                >
                  <RoiHeaderColumnMessage label={column.label} tooltipText={column.tooltipText} />
                </TableSortLabel>
              ) : (
                <RoiHeaderColumnMessage label={column.label} tooltipText={column.tooltipText} />
              )}
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default memo(RoiTableHead) as typeof RoiTableHead;
