import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { MultiAutocomplete } from '@alycecom/ui';
import { useSelector } from 'react-redux';
import { EntityId } from '@alycecom/utils';

import { ProductFilter } from '../../../store/products/products.types';
import {
  getCategoriesIds,
  getCategoriesMap,
  getIsLoaded as getIsCategoriesLoaded,
  getIsLoading as getIsCategoriesLoading,
} from '../../../store/entities/productCategories/productCategories.selectors';
import { getSelectedCategoryIds } from '../../../store/products/products.selectors';

const CategoryIds = ({ onChange }: { onChange: (ids: EntityId[], name: string) => void }) => {
  const isCategoriesLoading = useSelector(getIsCategoriesLoading);
  const isCategoriesLoaded = useSelector(getIsCategoriesLoaded);
  const categoryIds = useSelector(getCategoriesIds);
  const categoriesMap = useSelector(getCategoriesMap);
  const selectedCategoryIds = useSelector(getSelectedCategoryIds);
  const [sortedCategories, setSortedCategories] = useState<EntityId[]>([]);
  const isInitialSortedRef = useRef(false);

  const getLabel = useCallback(id => categoriesMap[id]?.label ?? '', [categoriesMap]);
  const sortCategories = useCallback(
    () => setSortedCategories(categoryIds.sort(categoryId => (selectedCategoryIds.includes(categoryId) ? -1 : 0))),
    [categoryIds, selectedCategoryIds],
  );
  const handleOpen = useCallback(() => {
    sortCategories();
  }, [sortCategories]);

  useEffect(() => {
    if (isCategoriesLoaded && !isInitialSortedRef.current) {
      sortCategories();
      isInitialSortedRef.current = true;
    }
  }, [isCategoriesLoaded, sortCategories]);

  return (
    <MultiAutocomplete<EntityId>
      label="Interests"
      name={ProductFilter.CategoryIds}
      value={selectedCategoryIds}
      options={sortedCategories}
      loading={isCategoriesLoading}
      onChange={onChange}
      getOptionLabel={getLabel}
      onOpen={handleOpen}
    />
  );
};

export default memo(CategoryIds);
