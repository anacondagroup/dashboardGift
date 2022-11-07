import React, { memo, useCallback, useEffect } from 'react';
import { TableFooter, TablePagination, TableRow } from '@mui/material';
import { useDispatch } from 'react-redux';
import { RowLimit } from '@alycecom/ui';

import { TABLE_SORT } from '../../../../components/Shared/CustomTable/customTable.constants';
import { setPaginationLimit } from '../../store/users/users.actions';

interface IUserTableFilters {
  search?: string;
  teamId?: number;
  countryIds?: number[];
  sortField?: string;
  sortDirection?: TABLE_SORT;
  currentPage?: number;
  limit?: RowLimit;
}

interface IUserTableFooter {
  limit: number;
  total: number;
  currentPage: number;
  onPaginationChange: (payload: Partial<IUserTableFilters>) => void;
}

const getDefaultLimit = (innerHeight: number) => {
  if (innerHeight < 1200) {
    return RowLimit.Limit10;
  }
  if (innerHeight >= 1200 && innerHeight < 2100) {
    return RowLimit.Limit25;
  }
  return RowLimit.Limit50;
};

const UserTableFooter = ({ limit, total, currentPage, onPaginationChange }: IUserTableFooter): JSX.Element => {
  const dispatch = useDispatch();

  const { innerHeight } = window;

  useEffect(() => {
    onPaginationChange({
      limit: getDefaultLimit(innerHeight),
      currentPage: currentPage !== 1 ? currentPage : 1,
    });
  }, [innerHeight, onPaginationChange, currentPage]);

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
      dispatch(setPaginationLimit(parseInt(ev.target.value, 10)));
    },
    [onPaginationChange, total, currentPage, dispatch],
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

export default memo(UserTableFooter);
