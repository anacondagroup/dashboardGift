import React from 'react';
import { TableRow, Theme } from '@mui/material';

import RoiTableCell from './RoiTableCell';
import { TRoiColumn } from './roiTable.types';

export const styles = {
  row: {
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  },
  cell: {
    padding: ({ spacing }: Theme) => spacing(2, 2, 2, 1),
  },
  clickableSell: {
    color: ({ palette }: Theme) => palette.link.main,
    cursor: 'pointer',

    '&:hover': {
      textDecoration: 'underline',
      fontWeight: 700,
    },
  },
  sortableSell: {
    padding: ({ spacing }: Theme) => spacing(2, 4, 2, 1),
  },
} as const;

export interface IRoiTableRowProps<RowItem> {
  data: RowItem;
  columns: TRoiColumn<RowItem>[];
  getRowId: (rowData: RowItem) => number | string;
}

const RoiTableRow = <RowItem,>({ data, columns, getRowId }: IRoiTableRowProps<RowItem>): JSX.Element => {
  const getFieldValue = (column: typeof columns[number]) =>
    column.getFormattedValue ? column.getFormattedValue(data, column) : data[column.field];
  return (
    <TableRow key={getRowId(data)} sx={styles.row}>
      {columns.map(column => (
        <RoiTableCell
          key={`row-column-${column.label}`}
          align={column.align}
          sx={[styles.cell, !!column.isSortable && styles.sortableSell]}
        >
          {getFieldValue(column)}
        </RoiTableCell>
      ))}
    </TableRow>
  );
};

export default RoiTableRow;
