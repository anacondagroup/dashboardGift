import React, { useCallback, memo, useState, useEffect } from 'react';
import { MultiAutocomplete } from '@alycecom/ui';
import { EntityId } from '@alycecom/utils';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { TProductVendor } from '../../../store/entities/productVendors/productVendors.types';
import { IProductsFilters } from '../../../store/products/products.types';
import { getIsLoaded, getIsLoading, getVendors } from '../../../store/entities/productVendors/productVendors.selectors';
import { getSelectedVendors } from '../../../store/products/products.selectors';

import { IFieldProps } from './Field';

const Vendors = ({
  disabled = false,
  control,
  getIsDisabled,
  submitForm,
}: IFieldProps & {
  getIsDisabled: (vendor: TProductVendor) => boolean;
  submitForm?: (filters: IProductsFilters) => void;
}): JSX.Element => {
  const getVendorLabel = useCallback(vendor => vendor?.label ?? '', []);
  const vendors = useSelector(getVendors);
  const enabledVendors = useSelector(getSelectedVendors);
  const isLoaded = useSelector(getIsLoaded);
  const isLoading = useSelector(getIsLoading);
  const [sortedVendors, setSortedVendors] = useState<TProductVendor[]>([]);

  const sortVendors = useCallback(
    () => setSortedVendors(vendors.sort(vendor => (enabledVendors.includes(vendor) ? -1 : 0))),
    [vendors, enabledVendors],
  );
  const handleOpen = useCallback(() => {
    sortVendors();
  }, [sortVendors]);

  const sendCurrentVendorsFilter = useCallback(
    (value: TProductVendor[]) => {
      if (submitForm) {
        let brands: EntityId[] = [];
        let merchants: EntityId[] = [];
        value.forEach((brand: TProductVendor) => {
          if (brand.type === 'brand') {
            brands = [...brands, brand.id];
          } else {
            merchants = [...merchants, brand.id];
          }
        });
        submitForm({ merchants, brands, vendors: value });
      }
    },
    [submitForm],
  );

  const getOptionSelected = useCallback(
    (optionA: TProductVendor, optionB: TProductVendor) =>
      optionA === optionB || (optionA?.id ?? NaN) === (optionB?.id ?? NaN),
    [],
  );

  useEffect(() => {
    if (isLoaded) {
      sortVendors();
    }
  }, [sortVendors, isLoaded]);

  return (
    <Controller
      control={control}
      name="vendors"
      render={({ field: { onChange, value } }) => (
        <MultiAutocomplete<TProductVendor, true>
          onOpen={handleOpen}
          label="Brand"
          name="vendors"
          value={value}
          onChange={e => {
            onChange(e);
            sendCurrentVendorsFilter(e);
          }}
          options={sortedVendors}
          getOptionLabel={getVendorLabel}
          getOptionLocked={getIsDisabled}
          getOptionSelected={getOptionSelected}
          disabled={disabled}
          loading={isLoading}
        />
      )}
    />
  );
};

export default memo(Vendors);
