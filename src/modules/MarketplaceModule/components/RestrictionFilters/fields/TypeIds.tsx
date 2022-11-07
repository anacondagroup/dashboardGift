import React, { useCallback, memo } from 'react';
import { MultiSelect } from '@alycecom/ui';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { EntityId } from '@alycecom/utils';

import { getProductTypeIds, getProductTypesMap } from '../../../store/entities/productTypes/productTypes.selectors';
import { ProductFilter, IProductsFilters } from '../../../store/products/products.types';

import { IFieldProps } from './Field';

const TypeIds = ({
  getIsDisabled,
  control,
  disabled = false,
  submitForm,
}: IFieldProps & {
  getIsDisabled: (typeId: EntityId) => boolean;
  submitForm?: (filters: IProductsFilters) => void;
}): JSX.Element => {
  const typeIds = useSelector(getProductTypeIds);
  const types = useSelector(getProductTypesMap);

  const getTypeLabel = useCallback((entityId: EntityId) => types[entityId]?.label ?? '', [types]);

  const sendCurrentTypesIdsFilter = useCallback(
    (value: EntityId[]) => {
      if (submitForm) {
        submitForm({ types: value });
      }
    },
    [submitForm],
  );

  return (
    <Controller
      control={control}
      name={ProductFilter.TypeIds}
      render={({ field: { onChange, value } }) => (
        <MultiSelect<EntityId>
          label="Gift type"
          name={ProductFilter.TypeIds}
          value={value}
          onChange={e => {
            onChange(e);
            sendCurrentTypesIdsFilter(e);
          }}
          options={typeIds}
          getOptionLabel={getTypeLabel}
          getOptionLocked={getIsDisabled}
          disabled={disabled}
        />
      )}
    />
  );
};

export default memo(TypeIds);
