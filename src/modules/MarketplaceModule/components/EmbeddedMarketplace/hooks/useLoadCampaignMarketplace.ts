import { useEffect, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';

import { setDefaultFilters, setPage, updateFilters } from '../../../store/products/products.actions';
import { IFilters, ProductFilter } from '../../../store/products/products.types';
import { getIsLoaded as getIsTypesLoaded } from '../../../store/entities/productTypes/productTypes.selectors';
import {
  getIsLoaded as getIsCampaignLoaded,
  getEnabledTypeIds,
  getBudgetAsFilters,
  getCampaignDefaultBrandIds,
  getCampaignDefaultMerchantIds,
  getCampaignTeamId,
  getCountryIds,
  getCampaignMarketplaceId,
} from '../../../store/campaignSettings/campaignSettings.selectors';
import { fetchCampaignSettings, resetCampaignSettings } from '../../../store/campaignSettings/campaignSettings.actions';
import { fetchProductVendors } from '../../../store/entities/productVendors/productVendors.actions';
import { getIsLoaded as getIsVendorsLoaded } from '../../../store/entities/productVendors/productVendors.selectors';

export const useLoadCampaignMarketplace = ({
  campaignId,
  initialFilters = {},
}: {
  campaignId: number;
  initialFilters?: Partial<IFilters>;
  restrictedTypeIds?: number[];
}): { isLoaded: boolean } => {
  const dispatch = useDispatch();
  const [isMount, setIsMount] = useState(false);
  const isCampaignLoaded = useSelector(getIsCampaignLoaded);
  const isTypesLoaded = useSelector(getIsTypesLoaded);
  const isVendorsLoaded = useSelector(getIsVendorsLoaded);
  const permittedTypeIds = useSelector(getEnabledTypeIds);
  const permittedBrandIds = useSelector(getCampaignDefaultBrandIds);
  const permittedMerchantIds = useSelector(getCampaignDefaultMerchantIds);
  const permittedTeamIds = useSelector(getCampaignTeamId);
  const countryIds = useSelector(getCountryIds);
  const customMarketplaceId = useSelector(getCampaignMarketplaceId);
  const budget = useSelector(getBudgetAsFilters);
  const isLoaded = isCampaignLoaded && isTypesLoaded && isVendorsLoaded;

  useEffect(() => {
    if (!isMount && isLoaded) {
      batch(() => {
        dispatch(
          setDefaultFilters({
            ...budget,
            [ProductFilter.TypeIds]: permittedTypeIds,
            [ProductFilter.BrandIds]: permittedBrandIds,
            [ProductFilter.MerchantIds]: permittedMerchantIds,
            [ProductFilter.CountryIds]: countryIds,
            [ProductFilter.MarketplaceId]: customMarketplaceId ?? undefined,
            [ProductFilter.TeamIds]: permittedTeamIds ? [permittedTeamIds] : [],
          }),
        );
        dispatch(
          updateFilters({
            ...budget,
            ...initialFilters,
            [ProductFilter.TeamIds]: permittedTeamIds ? [permittedTeamIds] : [],
          }),
        );
        dispatch(setPage(1));
      });
      setIsMount(true);
    }
  }, [
    budget,
    dispatch,
    campaignId,
    isMount,
    isLoaded,
    initialFilters,
    permittedTypeIds,
    permittedBrandIds,
    permittedMerchantIds,
    permittedTeamIds,
    customMarketplaceId,
    countryIds,
  ]);

  useEffect(() => {
    dispatch(fetchCampaignSettings(campaignId));
  }, [campaignId, dispatch]);

  useEffect(() => {
    dispatch(fetchProductVendors({ campaignId }));
  }, [dispatch, campaignId]);

  useEffect(
    () => () => {
      dispatch(resetCampaignSettings());
    },
    [dispatch],
  );

  return {
    isLoaded: isMount && isLoaded,
  };
};
