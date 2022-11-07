import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';

import { RestrictionFilters } from '../RestrictionFilters';
import {
  getDisabledGiftFilters,
  getHiddenGiftFilters,
  getIsLoading,
  getRestrictedTypeIds,
} from '../../store/customMarketplace/customMarketplace.selectors';
import { getIsCustomMarketplaceFiltersChanged } from '../../store/marketplace.selectors';
import { useResetCustomMarketplace } from '../../hooks/useResetCustomMarketplace';
import { TCustomMarketplaceGiftFilters } from '../../store/customMarketplace/customMarketplace.types';
import {
  customMarketplaceFiltersDefaultValue,
  customMarketplaceGiftFiltersResolver,
} from '../../store/customMarketplace/customMarketplace.schemas';
import { useSyncFiltersWithForm } from '../../hooks/useSyncFiltersWithForm';
import { updateFilters } from '../../store/products/products.actions';
import { getFilters } from '../../store/products/products.selectors';
import { IProductsFilters } from '../../store/products/products.types';

const CustomMarketplaceGiftFilters = (): JSX.Element => {
  const dispatch = useDispatch();
  const hiddenFilters = useSelector(getHiddenGiftFilters);
  const disabledFilters = useSelector(getDisabledGiftFilters);
  const isMarketplaceLoading = useSelector(getIsLoading);
  const restrictedTypeIds = useSelector(getRestrictedTypeIds);
  const hasChanges = useSelector(getIsCustomMarketplaceFiltersChanged);
  const currentFilters = useSelector(getFilters);

  const formMethods = useForm<TCustomMarketplaceGiftFilters>({
    mode: 'all',
    resolver: customMarketplaceGiftFiltersResolver,
    defaultValues: customMarketplaceFiltersDefaultValue,
  });
  const { reset, handleSubmit } = formMethods;
  const applyFilters = useCallback(
    filters => {
      dispatch(updateFilters(filters));
      reset(filters);
    },
    [dispatch, reset],
  );

  // @ts-ignore
  useSyncFiltersWithForm(reset);
  const onReset = useResetCustomMarketplace();

  const sendForm = useCallback(
    (filters: IProductsFilters) => {
      const filtersToApply = {
        ...currentFilters,
        ...filters,
      };
      applyFilters(filtersToApply);
    },
    [currentFilters, applyFilters],
  );

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(applyFilters)}>
        <RestrictionFilters
          onReset={onReset}
          hasChanges={hasChanges}
          loading={isMarketplaceLoading}
          hiddenFilters={hiddenFilters}
          disabledFilters={disabledFilters}
          restrictedTypeIds={restrictedTypeIds}
          submitForm={sendForm}
        />
      </form>
    </FormProvider>
  );
};

export default memo(CustomMarketplaceGiftFilters);
