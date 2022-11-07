import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { MultiAutocomplete } from '@alycecom/ui';
import { EntityId } from '@alycecom/utils';

import { ProductFilter } from '../../../../store/products/products.types';
import {
  getCategoriesIds,
  getCategoriesMap,
  getIsLoaded as getIsCategoriesLoaded,
  getIsLoading as getIsCategoriesLoading,
} from '../../../../store/entities/productCategories/productCategories.selectors';

export interface ICategoriesProps {
  value: EntityId[];
  onChange: (value: EntityId[], name: ProductFilter) => void;
}

const Categories = ({ value, onChange }: ICategoriesProps) => {
  const isCategoriesLoading = useSelector(getIsCategoriesLoading);
  const isCategoriesLoaded = useSelector(getIsCategoriesLoaded);
  const categoryIds = useSelector(getCategoriesIds);
  const categoriesMap = useSelector(getCategoriesMap);
  const [sortedCategories, setSortedCategories] = useState<EntityId[]>([]);
  const isInitialSortedRef = useRef(false);

  const getLabel = useCallback(id => categoriesMap[id]?.label ?? '', [categoriesMap]);
  const sortCategories = useCallback(
    () => setSortedCategories(categoryIds.sort(categoryId => (value.includes(categoryId) ? -1 : 0))),
    [categoryIds, value],
  );
  const handleOpen = useCallback(() => {
    sortCategories();
  }, [sortCategories]);

  const handleChange = useCallback(newValue => onChange(newValue, ProductFilter.CategoryIds), [onChange]);

  useEffect(() => {
    if (isCategoriesLoaded && !isInitialSortedRef.current) {
      sortCategories();
      isInitialSortedRef.current = true;
    }
  }, [isCategoriesLoaded, sortCategories]);

  return (
    <MultiAutocomplete<EntityId>
      label="Categories"
      name={ProductFilter.CategoryIds}
      value={value}
      options={sortedCategories}
      loading={isCategoriesLoading}
      onChange={handleChange}
      getOptionLabel={getLabel}
      onOpen={handleOpen}
    />
  );
};

export default memo(Categories);
