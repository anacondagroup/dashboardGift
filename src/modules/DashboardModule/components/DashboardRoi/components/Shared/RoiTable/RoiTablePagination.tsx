import React, { useCallback, useState } from 'react';
import { TablePagination, TablePaginationProps } from '@mui/material';
import { RowLimit } from '@alycecom/ui';

import { offsetToPage, pageToOffset } from '../../../../../../../helpers';

const styles = {
  pagination: {
    color: 'grey.dusty',
  },
} as const;

type TRoiTablePaginationProps = Omit<
  TablePaginationProps,
  'count' | 'page' | 'rowsPerPage' | 'onPageChange' | 'onRowsPerPageChange'
> & {
  total: number;
  limit: RowLimit;
  offset: number;
  onOffsetChange: (offset: number) => void;
  onLimitChange: (limit: RowLimit) => void;
};

const RoiTablePagination = ({
  total,
  limit,
  offset,
  onOffsetChange,
  onLimitChange,
  ...paginationProps
}: TRoiTablePaginationProps): JSX.Element => {
  const [currentOffset, setCurrentOffset] = useState(offset);
  const [currentLimit, setCurrentLimit] = useState<RowLimit>(limit);

  const page = offsetToPage(total, currentLimit, currentOffset);

  const handleChangePage = useCallback<TablePaginationProps['onPageChange']>(
    (_, newPage) => {
      const newOffset = pageToOffset(newPage, currentLimit);
      setCurrentOffset(newOffset);
      onOffsetChange(newOffset);
    },
    [onOffsetChange, currentLimit],
  );

  const handleChangeRowsPerPage = useCallback<Required<TablePaginationProps>['onRowsPerPageChange']>(
    event => {
      const value = parseInt(event.target.value, 10);
      setCurrentLimit(value);
      onLimitChange(value);
    },
    [onLimitChange],
  );

  return (
    <TablePagination
      component="div"
      count={total}
      page={page - 1 < 0 ? 0 : page - 1}
      rowsPerPage={currentLimit}
      sx={styles.pagination}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      {...paginationProps}
    />
  );
};

export default RoiTablePagination;
