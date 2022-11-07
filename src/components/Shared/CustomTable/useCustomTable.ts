import { useCallback, useState } from 'react';

import { TABLE_SORT } from './customTable.constants';

export interface ICustomTableHookData {
  search: string;
  sortField: string;
  sortDirection: TABLE_SORT;
  currentPage: number;
}

export type TCustomTableSetValues = (data: Partial<ICustomTableHookData>) => void;
export interface IUseCustomTableReturnValue {
  search: string;
  sortDirection: TABLE_SORT;
  setValues: (data: Partial<ICustomTableHookData>) => void;
  sortField: string | undefined;
  currentPage: number;
}

const useCustomTable = (): IUseCustomTableReturnValue => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<string>();
  const [sortDirection, setSortDirection] = useState<TABLE_SORT>(TABLE_SORT.ASC);
  const [currentPage, setCurrentPage] = useState(1);

  const setValues = useCallback<TCustomTableSetValues>(data => {
    if (data.search !== undefined) {
      setSearch(data.search);
    }
    if (data.sortField !== undefined) {
      setSortField(data.sortField);
    }
    if (data.sortDirection !== undefined) {
      setSortDirection(data.sortDirection);
    }
    if (data.currentPage !== undefined) {
      setCurrentPage(data.currentPage);
    }
  }, []);

  return {
    search,
    sortField,
    sortDirection,
    currentPage,
    setValues,
  };
};

export default useCustomTable;
