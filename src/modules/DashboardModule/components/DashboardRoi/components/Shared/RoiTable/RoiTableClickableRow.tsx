import React from 'react';
import { TableRow } from '@mui/material';

import RoiTableCell from './RoiTableCell';
import { IRoiTableRowProps, styles } from './RoiTableRow';

interface IRoiTableClickableRowProps<RowItem> extends IRoiTableRowProps<RowItem> {
  onRowSelected?: (rowData: RowItem) => void;
}

const RoiTableClickableRow = <RowItem,>({
  data,
  columns,
  getRowId,
  onRowSelected = () => {},
}: IRoiTableClickableRowProps<RowItem>): JSX.Element => {
  const getFieldValue = (column: typeof columns[number]) =>
    column.getFormattedValue ? column.getFormattedValue(data, column) : data[column.field];
  return (
    <TableRow key={getRowId(data)} sx={styles.row}>
      {columns.map((column, index) => {
        const isFirstColumn = index === 0;
        return (
          <RoiTableCell
            key={`row-column-${column.label}`}
            align={column.align}
            sx={[styles.cell, isFirstColumn && styles.clickableSell, !!column.isSortable && styles.sortableSell]}
            onClick={isFirstColumn ? () => onRowSelected(data) : undefined}
          >
            {getFieldValue(column)}
          </RoiTableCell>
        );
      })}
    </TableRow>
  );
};

export default RoiTableClickableRow;
