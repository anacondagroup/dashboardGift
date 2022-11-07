import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MenuItem } from '@mui/material';
import {
  MarketplaceToolbar,
  SORTING_ITEMS,
  SORT_MOST_POPULAR_ID,
  SORT_NEWEST_ID,
  MarketplaceFilters,
} from '@alycecom/ui';
import { EntityId } from '@alycecom/utils';

import {
  getBudgetFilters,
  getSearch,
  getSelectedCategoryIds,
  getSelectedGiftTypes,
  getSorting,
} from '../../../store/products/products.selectors';
import { setSearch, setSorting, updateFilters } from '../../../store/products/products.actions';
import {
  getCategories,
  getIsLoading as getIsCategoriesLoading,
} from '../../../store/entities/productCategories/productCategories.selectors';
import {
  getIsLoading as getIsTypesLoading,
  getProductTypes,
} from '../../../store/entities/productTypes/productTypes.selectors';
import { ProductFilter } from '../../../store/products/products.types';
import { fetchProductCategories } from '../../../store/entities/productCategories/productCategories.actions';
import { fetchProductTypes } from '../../../store/entities/productTypes/productTypes.actions';

export interface IFiltersPanelProps {
  onChange: () => void;
  restrictedTypeIds?: number[];
  permittedTypeIds?: EntityId[];
  disableBudget?: boolean;
  syncBudget?: boolean;
}

interface IMarketplaceFilters {
  types: number[];
  categories: number[];
  price?: {
    minPrice?: number | null;
    maxPrice?: number | null;
    giftCardPrice?: number | null;
    donationAmount?: number | null;
  };
}

const FiltersPanel = ({ onChange, restrictedTypeIds, disableBudget, syncBudget = false }: IFiltersPanelProps) => {
  const dispatch = useDispatch();

  const search = useSelector(getSearch);
  const sorting = useSelector(getSorting);
  const budget = useSelector(getBudgetFilters);

  const handleChangeSearch = useCallback(
    value => {
      onChange();
      dispatch(setSearch(value));
    },
    [dispatch, onChange],
  );

  const sortingItems = useMemo(
    () =>
      SORTING_ITEMS.filter(item => item.id !== SORT_NEWEST_ID).map(({ id, label }) => (
        <MenuItem key={id} value={id}>
          {label}
        </MenuItem>
      )),
    [],
  );
  const handleChangeSort = useCallback(
    id => {
      const sortItem = SORTING_ITEMS.find(item => item.id === id);
      if (sortItem) {
        onChange();
        dispatch(setSorting(sortItem));
      }
    },
    [dispatch, onChange],
  );

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const openFilters = useCallback(() => {
    setIsFiltersOpen(true);
  }, []);
  const closeFilters = useCallback(() => {
    setIsFiltersOpen(false);
  }, []);

  const isProductTypesLoading = useSelector(getIsTypesLoading);
  const selectedProductTypeIds = useSelector(getSelectedGiftTypes);
  const productTypes = useSelector(getProductTypes);
  const availableTypes = useMemo(
    () => (restrictedTypeIds ? productTypes.filter(type => !restrictedTypeIds.includes(type.id)) : productTypes),
    [productTypes, restrictedTypeIds],
  );

  const productCategories = useSelector(getCategories);
  const isProductCategoriesLoading = useSelector(getIsCategoriesLoading);
  const selectedProductCategoryIds = useSelector(getSelectedCategoryIds);

  const handleChangeFilters = useCallback(
    ({ types, categories, price }: IMarketplaceFilters) => {
      onChange();
      closeFilters();
      dispatch(
        updateFilters({
          [ProductFilter.TypeIds]: types,
          [ProductFilter.CategoryIds]: categories,
          [ProductFilter.MinPrice]: price?.minPrice,
          [ProductFilter.MaxPrice]: price?.maxPrice,
          [ProductFilter.GiftCardPrice]: price?.giftCardPrice,
          [ProductFilter.DonationPrice]: price?.donationAmount,
        }),
      );
    },
    [closeFilters, dispatch, onChange],
  );

  useEffect(() => {
    dispatch(fetchProductTypes());
    dispatch(fetchProductCategories());
  }, [dispatch]);

  const filters = useMemo(
    () => ({
      types: availableTypes.map(({ id, label }) => ({ value: id, label })),
      categories: productCategories.map(({ id, label }) => ({ value: id, label })),
    }),
    [availableTypes, productCategories],
  );

  return (
    <>
      <MarketplaceToolbar
        searchValue={search}
        sortValue={sorting.id}
        defaultSortValue={SORT_MOST_POPULAR_ID}
        sortItems={sortingItems}
        onFiltersOpen={openFilters}
        onSortChange={handleChangeSort}
        onSearchChange={handleChangeSearch}
        disableFilters={isProductTypesLoading || isProductCategoriesLoading}
      />
      <MarketplaceFilters
        isOpen={isFiltersOpen}
        onClose={closeFilters}
        onFilter={handleChangeFilters}
        filters={filters}
        disableBudget={disableBudget}
        syncBudget={syncBudget}
        appliedFilters={{
          types: selectedProductTypeIds as number[],
          categories: selectedProductCategoryIds as number[],
          price: {
            minPrice: budget[ProductFilter.MinPrice],
            maxPrice: budget[ProductFilter.MaxPrice],
            giftCardPrice: budget[ProductFilter.GiftCardPrice],
            donationAmount: budget[ProductFilter.DonationPrice],
          },
        }}
      />
    </>
  );
};

export default memo(FiltersPanel);
