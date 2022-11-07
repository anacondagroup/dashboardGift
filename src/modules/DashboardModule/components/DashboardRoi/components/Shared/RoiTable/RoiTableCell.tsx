import React from 'react';
import { Box, Skeleton, TableCell, TableCellProps } from '@mui/material';

interface IRoiTableCellProps extends TableCellProps {
  isLoading?: boolean;
}

const RoiTableCell = ({ children, isLoading = false, align, ...tableCellProps }: IRoiTableCellProps): JSX.Element => (
  <TableCell align={align} {...tableCellProps}>
    {isLoading ? (
      <Box display="flex" justifyContent={align === 'right' ? 'flex-end' : 'flex-start'} py={0.95}>
        <Skeleton variant="text" width={66} height={8} />
      </Box>
    ) : (
      children || '-'
    )}
  </TableCell>
);

export default RoiTableCell;
