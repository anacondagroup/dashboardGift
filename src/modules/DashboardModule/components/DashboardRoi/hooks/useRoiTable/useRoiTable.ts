import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { RowLimit } from '@alycecom/ui';
import { useDebouncedSetState } from '@alycecom/hooks';
import { TGlobalRoiFilters, TRoiTableFilters } from '@alycecom/services';
import { useSelector } from 'react-redux';

import { IRoiTableProps } from '../../components/Shared/RoiTable/RoiTable';
import { getRoiFilters } from '../../store/filters/filters.selectors';

type THandleOffsetChange<BreakdownItem> = Required<IRoiTableProps<BreakdownItem>>['onOffsetChange'];
type THandleRowsPerPageChange<BreakdownItem> = Required<IRoiTableProps<BreakdownItem>>['onRowsPerPageChange'];
type THandleSortChange<BreakdownItem> = Required<IRoiTableProps<BreakdownItem>>['onSortChange'];
type THandleTableFiltersChange<BreakdownItem> = Required<
  IRoiTableProps<BreakdownItem>
>['toolbarProps']['onFiltersChange'];

export type TDebouncedFilters<BreakdownItem> = TGlobalRoiFilters &
  TRoiTableFilters<BreakdownItem> & {
    offset: number;
    limit: RowLimit;
  };

export type TUseRoiTableDefaultState = {
  limit: RowLimit;
  offset: number;
};

export type TUseRoiTableOptions = {
  debounce?: number;
};

export type TUseRoiTableReturnValue<BreakdownItem> = {
  filters: TDebouncedFilters<BreakdownItem>;
  setFilters: Dispatch<SetStateAction<TDebouncedFilters<BreakdownItem>>>;
  handleOffsetChange: THandleOffsetChange<BreakdownItem>;
  handleRowsPerPageChange: THandleRowsPerPageChange<BreakdownItem>;
  handleSortChange: THandleSortChange<BreakdownItem>;
  handleTableFiltersChange: THandleTableFiltersChange<BreakdownItem>;
};

export const useRoiTable = <BreakdownItem>(
  initialState: TUseRoiTableDefaultState = { offset: 0, limit: RowLimit.Limit10 },
  { debounce }: TUseRoiTableOptions = { debounce: 500 },
): TUseRoiTableReturnValue<BreakdownItem> => {
  const globalFilters = useSelector(getRoiFilters);

  const { limit, offset } = initialState;
  const [debouncedFilters, setFilters] = useDebouncedSetState<TDebouncedFilters<BreakdownItem>>(
    { ...globalFilters, offset, limit },
    debounce,
  );

  useEffect(() => {
    setFilters(currentFilters => ({
      ...currentFilters,
      ...globalFilters,
      offset: 0,
    }));
  }, [globalFilters, setFilters]);

  const handleOffsetChange = useCallback<THandleOffsetChange<BreakdownItem>>(
    newOffset => {
      setFilters(currentFilters => ({ ...currentFilters, offset: newOffset }));
    },
    [setFilters],
  );

  const handleRowsPerPageChange = useCallback<THandleRowsPerPageChange<BreakdownItem>>(
    newLimit => {
      setFilters(currentFilters => ({ ...currentFilters, limit: newLimit, offset: 0 }));
    },
    [setFilters],
  );

  const handleSortChange = useCallback<THandleSortChange<BreakdownItem>>(
    ({ field, direction }) => {
      setFilters(currentFilters => ({
        ...currentFilters,
        field,
        direction,
        offset: 0,
      }));
    },
    [setFilters],
  );

  const handleTableFiltersChange = useCallback<THandleTableFiltersChange<BreakdownItem>>(
    tableFilters => {
      setFilters(currentFilters => ({
        ...currentFilters,
        ...tableFilters,
        field: undefined,
        direction: undefined,
        offset: 0,
      }));
    },
    [setFilters],
  );

  return {
    filters: debouncedFilters,
    setFilters,
    handleOffsetChange,
    handleRowsPerPageChange,
    handleSortChange,
    handleTableFiltersChange,
  };
};
