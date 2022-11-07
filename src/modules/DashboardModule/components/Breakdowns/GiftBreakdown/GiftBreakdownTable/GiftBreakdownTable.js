import React, { useCallback, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { SearchField } from '@alycecom/ui';
import { fakeItemsFactory } from '@alycecom/utils';
import { useUrlQuery, useSetUrlQuery } from '@alycecom/hooks';

import GiftBreakdownTableRow from './GiftBreakdownTableRow';
import { ColumnType, PaginationType } from './giftBreakdownTable.shape';

const GiftBreakdownTable = ({ isLoading, breakdown, placeholder, columns, pagination, renderRow, renderToolbar }) => {
  const { giftSort, giftDirection, giftSearch: search } = useUrlQuery(['giftSort', 'giftDirection', 'giftSearch']);
  const updateUrlFunc = useSetUrlQuery();

  const rows = useMemo(() => fakeItemsFactory(breakdown, isLoading, id => ({ id }), 10), [breakdown, isLoading]);
  const showEmptyRows = pagination.per_page - breakdown.length;

  const handleSearch = useCallback(({ target }) => updateUrlFunc({ giftSearch: target.value, giftPage: 1 }), [
    updateUrlFunc,
  ]);
  const handleSort = useCallback(
    newGiftSort => () =>
      updateUrlFunc({
        giftSort: newGiftSort,
        giftDirection: giftSort === newGiftSort && giftDirection === 'desc' ? 'asc' : 'desc',
        giftPage: 1,
      }),
    [giftSort, giftDirection, updateUrlFunc],
  );
  const handlePageChange = useCallback((e, nextPage) => updateUrlFunc({ giftPage: nextPage + 1 }), [updateUrlFunc]);

  const renderRows = () => {
    if (renderRow) {
      return rows.map(item => renderRow({ columns, item, isLoading, updateUrl: updateUrlFunc }));
    }
    return rows.map(item => (
      <GiftBreakdownTableRow key={item.id} item={item} isLoading={isLoading} columns={columns} />
    ));
  };

  return (
    <>
      {renderToolbar && renderToolbar({ placeholder, search, handleSearch })}
      {!renderToolbar && <SearchField placeholder={placeholder} value={search} onChange={handleSearch} />}
      <Table padding="none">
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.field}>
                {!column.isSortDisabled && (
                  <TableSortLabel
                    direction={giftDirection}
                    active={giftSort === column.field}
                    onClick={handleSort(column.field)}
                  >
                    {column.name}
                  </TableSortLabel>
                )}
                {column.isSortDisabled && column.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {renderRows()}
          {showEmptyRows > 0 && !isLoading && (
            <TableRow key="empty-row" data-testid="Breakdown.Row-empty" style={{ height: 48 * showEmptyRows }}>
              <TableCell colSpan={12} />
            </TableRow>
          )}
        </TableBody>

        {pagination.total > pagination.per_page && (
          <TableFooter>
            <TableRow>
              <TablePagination
                data-testid="Breakdown.Pagination"
                rowsPerPageOptions={[pagination.per_page]}
                colSpan={12}
                count={pagination.total}
                rowsPerPage={pagination.per_page}
                page={pagination.current_page - 1}
                SelectProps={{
                  native: true,
                }}
                onPageChange={handlePageChange}
              />
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </>
  );
};

GiftBreakdownTable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  breakdown: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  placeholder: PropTypes.string,
  columns: PropTypes.arrayOf(ColumnType).isRequired,
  pagination: PaginationType.isRequired,
  renderRow: PropTypes.func,
  renderToolbar: PropTypes.func,
};

GiftBreakdownTable.defaultProps = {
  isLoading: false,
  placeholder: 'Search gifts',
  renderRow: undefined,
  renderToolbar: undefined,
};

export default memo(GiftBreakdownTable);
