import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { EntityId } from '@reduxjs/toolkit';

import { getIsLoaded as getIsVendorsLoaded } from '../../../store/entities/productVendors/productVendors.selectors';
import { getIsLoaded as getIsTypesLoaded } from '../../../store/entities/productTypes/productTypes.selectors';
import {
  getCustomMarketplaceAsFilters,
  getDefaultTypeIds,
  getIsLoaded as getIsCustomMarketplaceLoaded,
} from '../../../store/customMarketplace/customMarketplace.selectors';
import { setDefaultFilters, setPage, updateFilters } from '../../../store/products/products.actions';
import { ProductFilter } from '../../../store/products/products.types';
import { fetchProductVendors } from '../../../store/entities/productVendors/productVendors.actions';
import {
  fetchCustomMarketplaceById,
  resetCustomMarketplace,
} from '../../../store/customMarketplace/customMarketplace.actions';
import { getAvailableBrandIds, getAvailableMerchantIds } from '../../../store/teamSettings/teamSettings.selectors';

export const useLoadCustomMarketplace = ({
  teamId,
  marketplaceId,
  campaignId,
  countryIds,
}: {
  teamId?: number;
  marketplaceId: number;
  campaignId?: number;
  countryIds?: EntityId[];
}): { isLoaded: boolean } => {
  const dispatch = useDispatch();
  const isVendorsLoaded = useSelector(getIsVendorsLoaded);
  const isTypesLoaded = useSelector(getIsTypesLoaded);
  const isCustomMarketplaceLoaded = useSelector(getIsCustomMarketplaceLoaded);
  const defaultTypeIds = useSelector(getDefaultTypeIds);
  const budgetFilters = useSelector(getCustomMarketplaceAsFilters);
  const permittedMerchantIds = useSelector(getAvailableMerchantIds);
  const permittedBrandIds = useSelector(getAvailableBrandIds);

  const isLoaded = isVendorsLoaded && isTypesLoaded && isCustomMarketplaceLoaded;
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    if (isLoaded && !isMount) {
      dispatch(
        setDefaultFilters({
          [ProductFilter.MerchantIds]: permittedMerchantIds,
          [ProductFilter.BrandIds]: permittedBrandIds,
          [ProductFilter.TypeIds]: defaultTypeIds,
          [ProductFilter.TeamIds]: teamId ? [teamId] : [],
          [ProductFilter.CountryIds]: countryIds,
          [ProductFilter.MarketplaceId]: marketplaceId,
        }),
      );
      dispatch(
        updateFilters({
          ...budgetFilters,
          [ProductFilter.CountryIds]:
            countryIds && countryIds.length ? countryIds : budgetFilters[ProductFilter.CountryIds],
        }),
      );
      dispatch(setPage(1));
      setIsMount(true);
    }
  }, [
    dispatch,
    isLoaded,
    defaultTypeIds,
    teamId,
    marketplaceId,
    campaignId,
    budgetFilters,
    isMount,
    permittedMerchantIds,
    permittedBrandIds,
    countryIds,
  ]);

  useEffect(() => {
    dispatch(fetchProductVendors({ teamIds: teamId ? [teamId] : undefined }));
  }, [dispatch, teamId]);

  useEffect(() => {
    dispatch(fetchCustomMarketplaceById(marketplaceId));
  }, [dispatch, marketplaceId]);

  useEffect(
    () => () => {
      dispatch(resetCustomMarketplace());
    },
    [dispatch],
  );

  return {
    isLoaded,
  };
};
