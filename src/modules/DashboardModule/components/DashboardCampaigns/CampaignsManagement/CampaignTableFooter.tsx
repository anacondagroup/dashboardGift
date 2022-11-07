import React, { memo, useCallback, useEffect } from 'react';
import { TableFooter, TablePagination, TableRow } from '@mui/material';

import { TCampaignTableSetValues } from '../../../store/breakdowns/campaignsManagement/filters/filters.types';

interface ICampaignTableFooter {
  limit: number;
  total: number;
  currentPage: number;
  onPaginationChange: TCampaignTableSetValues;
}

const CampaignTableFooter = ({ limit, total, currentPage, onPaginationChange }: ICampaignTableFooter): JSX.Element => {
  useEffect(() => {
    onPaginationChange({
      limit,
      currentPage: currentPage !== 1 ? currentPage : 1,
    });
  }, [onPaginationChange, currentPage, limit]);

  const handlePaginationChange = useCallback(
    (_, nextPage: number) => {
      onPaginationChange({ currentPage: nextPage + 1 });
    },
    [onPaginationChange],
  );
  const handleChangeRowsPerPage = useCallback(
    ev => {
      onPaginationChange({
        limit: ev.target.value,
        currentPage:
          Math.ceil(total / ev.target.value) < currentPage ? Math.ceil(total / ev.target.value) : currentPage,
      });
    },
    [onPaginationChange, total, currentPage],
  );

  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          colSpan={12}
          count={total}
          rowsPerPage={limit}
          page={currentPage - 1}
          onPageChange={handlePaginationChange}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableRow>
    </TableFooter>
  );
};

export default memo(CampaignTableFooter);
