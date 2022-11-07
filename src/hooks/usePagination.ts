import { useMemo } from 'react';
import * as R from 'ramda';

export interface IDefaultEntity {
  id: string | number;
}

export type IPagination<Entity extends IDefaultEntity> = [Entity[], boolean, number, boolean];

export const calculatePagination = <Entity extends IDefaultEntity>(
  page: number,
  rowsPerPage: number,
  items: Entity[],
  isLoading: boolean,
): IPagination<Entity> => {
  const pagedItems = R.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage, items);
  const fakeItems = R.range(0, pagedItems.length || rowsPerPage).map((item, index) => ({ id: index })) as Entity[];
  const isEmpty = R.isEmpty(items);
  const itemsToShow = isLoading ? fakeItems : pagedItems;
  const showPagination = items.length > rowsPerPage;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);
  const showEmptyRows = showPagination && !isEmpty && emptyRows > 0;

  return [itemsToShow, showPagination, emptyRows, showEmptyRows];
};

export const usePagination = <Entity extends IDefaultEntity>(
  page: number,
  rowsPerPage: number,
  items: Entity[],
  isLoading: boolean,
): IPagination<Entity> =>
  useMemo(() => calculatePagination<Entity>(page, rowsPerPage, items, isLoading), [
    page,
    rowsPerPage,
    items,
    isLoading,
  ]);
