import React, { useCallback } from 'react';
import { TableFooter, TablePagination, TableRow } from '@mui/material';

import { TCustomTableSetValues } from './useCustomTable';

interface ICustomTableFooter {
  limit: number;
  total: number;
  rowsPerPageOptions?: Array<number>;
  currentPage: number;
  onRowsPerPageChange?: (arg: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPaginationChange: TCustomTableSetValues;
}

const CustomTableFooter = ({
  limit,
  total,
  currentPage,
  onPaginationChange,
  rowsPerPageOptions,
  ...props
}: ICustomTableFooter): JSX.Element => {
  const handlePaginationChange = useCallback(
    (_, nextPage: number) => {
      onPaginationChange({ currentPage: nextPage + 1 });
    },
    [onPaginationChange],
  );

  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions || [limit]}
          colSpan={12}
          count={total}
          rowsPerPage={limit}
          page={currentPage - 1}
          SelectProps={{
            native: true,
          }}
          onPageChange={handlePaginationChange}
          {...props}
        />
      </TableRow>
    </TableFooter>
  );
};

export default CustomTableFooter;
