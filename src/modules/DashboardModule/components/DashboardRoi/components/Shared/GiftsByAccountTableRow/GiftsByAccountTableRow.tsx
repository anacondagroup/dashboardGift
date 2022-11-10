import React from 'react';
import { Avatar, Box, TableRow } from '@mui/material';

import { IRoiTableRowProps, styles as defaultRowStyles } from '../RoiTable/RoiTableRow';
import RoiTableCell from '../RoiTable/RoiTableCell';
import { getAvatarLetters } from '../../../utils';

const styles = {
  avatarWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    mr: 1.4,
    fontSize: '14px',
  },
} as const;

interface IGiftsByAccountTableRowProps<RowItem> extends IRoiTableRowProps<RowItem> {}

const GiftsByAccountTableRow = <RowItem,>({
  columns,
  data,
  getRowId,
}: IGiftsByAccountTableRowProps<RowItem>): JSX.Element => {
  const getFieldValue = (column: typeof columns[number]) =>
    column.getFormattedValue ? column.getFormattedValue(data, column) : data[column.field];

  return (
    <TableRow key={getRowId(data)} sx={defaultRowStyles.row}>
      {columns.map((column, index) => {
        const value = getFieldValue(column);
        return (
          <RoiTableCell
            key={`row-column-${column.label}`}
            align={column.align}
            sx={[defaultRowStyles.cell, !!column.isSortable && defaultRowStyles.sortableSell]}
          >
            {index === 0 ? (
              <Box sx={styles.avatarWrapper}>
                <Avatar sx={styles.avatar}>{typeof value === 'string' ? getAvatarLetters(value) : '-'}</Avatar>
                {value}
              </Box>
            ) : (
              value
            )}
          </RoiTableCell>
        );
      })}
    </TableRow>
  );
};

export default GiftsByAccountTableRow;
