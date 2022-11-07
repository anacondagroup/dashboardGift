import React, { memo, ReactElement, useCallback, useMemo } from 'react';
import { SORT_NEWEST_ID, SORTING_ITEMS, SortingSelect } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';

import { setSorting } from '../../store/products/products.actions';
import { getSorting } from '../../store/products/products.selectors';

export interface IMarketplaceSortingProps {
  onChange: () => void;
}

const MarketplaceSorting = ({ onChange }: IMarketplaceSortingProps): ReactElement => {
  const dispatch = useDispatch();

  const sorting = useSelector(getSorting);
  const sortingItems = useMemo(() => SORTING_ITEMS.filter(item => item.id !== SORT_NEWEST_ID), []);

  const handleSort = useCallback(
    sort => {
      onChange();
      dispatch(setSorting(sort));
    },
    [dispatch, onChange],
  );

  return <SortingSelect items={sortingItems} value={sorting.id} onSort={handleSort} />;
};

export default memo(MarketplaceSorting);
