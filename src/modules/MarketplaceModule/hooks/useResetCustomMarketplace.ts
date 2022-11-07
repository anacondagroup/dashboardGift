import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';

import { getCustomMarketplaceAsFilters } from '../store/customMarketplace/customMarketplace.selectors';
import { updateFilters } from '../store/products/products.actions';
import { ProductFilter } from '../store/products/products.types';

export const useResetCustomMarketplace = (): (() => void) => {
  const dispatch = useDispatch();
  const filters = useSelector(getCustomMarketplaceAsFilters);

  return useCallback(() => {
    dispatch(
      updateFilters({
        ...filters,
        [ProductFilter.Vendors]: [],
        [ProductFilter.BrandIds]: [],
        [ProductFilter.MerchantIds]: [],
        [ProductFilter.TypeIds]: [],
      }),
    );
  }, [filters, dispatch]);
};
