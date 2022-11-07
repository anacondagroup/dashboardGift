import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { MultiSelect } from '@alycecom/ui';
import { EntityId } from '@alycecom/utils';

import { ProductFilter } from '../../../../store/products/products.types';
import { getProductTypeIds, getProductTypesMap } from '../../../../store/entities/productTypes/productTypes.selectors';

export interface IGiftTypesProps {
  value: EntityId[];
  onChange: (value: EntityId[], name: ProductFilter) => void;
  permittedTypeIds?: EntityId[];
  restrictedTypeIds?: EntityId[];
}

const GiftTypes = ({ value, onChange, permittedTypeIds, restrictedTypeIds }: IGiftTypesProps) => {
  const typeIds = useSelector(getProductTypeIds);
  const types = useSelector(getProductTypesMap);

  const getTypeLabel = useCallback((entityId: EntityId) => types[entityId]?.label ?? '', [types]);

  const handleChange = useCallback(newValue => onChange(newValue, ProductFilter.TypeIds), [onChange]);

  const getTypeDisabled = useCallback(
    (entityId: EntityId) => (restrictedTypeIds ? restrictedTypeIds.includes(entityId) : false),
    [restrictedTypeIds],
  );

  return (
    <MultiSelect<EntityId>
      label="Gift types"
      name={ProductFilter.TypeIds}
      value={value}
      onChange={handleChange}
      options={permittedTypeIds || typeIds}
      getOptionLabel={getTypeLabel}
      getOptionLocked={getTypeDisabled}
    />
  );
};

export default memo(GiftTypes);
