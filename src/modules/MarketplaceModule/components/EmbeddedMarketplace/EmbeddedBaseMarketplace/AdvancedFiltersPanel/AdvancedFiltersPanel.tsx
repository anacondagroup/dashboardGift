import React, { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, SearchField, Tooltip } from '@alycecom/ui';
import { Box } from '@mui/material';
import { EntityId } from '@alycecom/utils';

import {
  getBudgetFilters,
  getSearch,
  getSelectedCategoryIds,
  getSelectedCountries,
  getSelectedGiftTypes,
} from '../../../../store/products/products.selectors';
import { setSearch, updateFilters } from '../../../../store/products/products.actions';
import { ProductFilter } from '../../../../store/products/products.types';
import { fetchProductCategories } from '../../../../store/entities/productCategories/productCategories.actions';
import { fetchProductTypes } from '../../../../store/entities/productTypes/productTypes.actions';

import GiftTypes from './GiftTypes';
import MinPrice from './MinPrice';
import MaxPrice from './MaxPrice';
import GiftCardPrice from './GiftCardPrice';
import DonationPrice from './DonationPrice';
import Categories from './Categories';
import Countries from './Countries';

export interface IAdvancedFiltersPanelProps {
  onChange: () => void;
  permittedTypeIds?: EntityId[];
  restrictedTypeIds?: EntityId[];
  disableBudget?: boolean;
  countryIds: number[];
}

const AdvancedFiltersPanel = ({
  onChange,
  disableBudget = false,
  permittedTypeIds,
  restrictedTypeIds,
  countryIds,
}: IAdvancedFiltersPanelProps) => {
  const dispatch = useDispatch();

  const budget = useSelector(getBudgetFilters);
  const selectedProductTypeIds = useSelector(getSelectedGiftTypes);
  const selectedProductCategoryIds = useSelector(getSelectedCategoryIds);
  const selectedCountryIds = useSelector(getSelectedCountries);

  const handleChangeFilter = useCallback(
    (value, name: ProductFilter) => {
      onChange();
      dispatch(updateFilters({ [name]: value }));
    },
    [onChange, dispatch],
  );

  const search = useSelector(getSearch);

  const handleChangeSearch = useCallback(
    ev => {
      onChange();
      dispatch(setSearch(ev.target.value));
    },
    [dispatch, onChange],
  );

  useEffect(() => {
    dispatch(fetchProductTypes());
    dispatch(fetchProductCategories());
  }, [dispatch]);

  return (
    <Box>
      <Box display="flex">
        <Box flex="1 0 200px">
          <GiftTypes
            permittedTypeIds={permittedTypeIds}
            restrictedTypeIds={restrictedTypeIds}
            value={selectedProductTypeIds}
            onChange={handleChangeFilter}
          />
        </Box>
        <Box ml={1}>
          <MinPrice disabled={disableBudget} value={budget[ProductFilter.MinPrice]} onChange={handleChangeFilter} />
        </Box>
        <Box ml={1}>
          <MaxPrice disabled={disableBudget} value={budget[ProductFilter.MaxPrice]} onChange={handleChangeFilter} />
        </Box>
        <Box ml={1}>
          <GiftCardPrice
            disabled={disableBudget}
            value={budget[ProductFilter.GiftCardPrice]}
            onChange={handleChangeFilter}
          />
        </Box>
        <Box ml={1}>
          <DonationPrice
            disabled={disableBudget}
            value={budget[ProductFilter.DonationPrice]}
            onChange={handleChangeFilter}
          />
        </Box>
        <Box display="flex" alignItems="center" ml={0.5}>
          <Tooltip title="Available in USD only" placement="top">
            <Icon icon="info-circle" color="grey" />
          </Tooltip>
        </Box>
      </Box>
      <Box display="flex" mt={2}>
        <Box flex="1 0 200px">
          <Categories value={selectedProductCategoryIds} onChange={handleChangeFilter} />
        </Box>
        {countryIds.length > 1 && (
          <Box ml={1} flex="1 0 200px">
            <Countries value={selectedCountryIds} onChange={handleChangeFilter} options={countryIds} />
          </Box>
        )}
        <Box ml={1} flex="1 1 auto">
          <SearchField placeholder="Search" value={search} onChange={handleChangeSearch} />
        </Box>
      </Box>
    </Box>
  );
};

export default memo(AdvancedFiltersPanel);
