import React from 'react';
import { TableRow } from '@mui/material';

import RoiTableCell from './RoiTableCell';
import { TRoiColumn } from './roiTable.types';

const styles = {
  row: {
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  },
};

interface IRoiTableEmptyRowProps<RowItem> {
  columns: TRoiColumn<RowItem>[];
}

const RoiTableEmptyRow = <RowItem,>({ columns }: IRoiTableEmptyRowProps<RowItem>): JSX.Element => (
  <TableRow sx={styles.row}>
    {columns.map(column => (
      <RoiTableCell key={`row-column-${column.label}`} align={column.align} isLoading />
    ))}
  </TableRow>
);

export default RoiTableEmptyRow;
