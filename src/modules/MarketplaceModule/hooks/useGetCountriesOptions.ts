import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CommonData, TCountry } from '@alycecom/modules';
import { EntityId } from '@alycecom/utils';

import { getSelectedCountries } from '../store/products/products.selectors';
import { getCampaignId, getCountries } from '../store/campaignSettings/campaignSettings.selectors';
import { getCustomMarketplaceCountries } from '../store/customMarketplace/customMarketplace.selectors';

import { useCustomMarketplace } from './useCustomMarketplace';

export const useGetCountriesOptions = (): { items: TCountry[]; selected: TCountry[]; ids: EntityId[] } => {
  const { marketplaceId } = useCustomMarketplace();
  const campaignId = useSelector(getCampaignId);

  const allCountries = useSelector(CommonData.selectors.getCommonAvailableCountries);
  const campaignCountries = useSelector(getCountries);
  const customMarketplaceCountries = useSelector(getCustomMarketplaceCountries);

  const getActualCountries = () => {
    if (campaignId) {
      return campaignCountries;
    }
    if (marketplaceId) {
      return customMarketplaceCountries;
    }
    return allCountries;
  };

  const countries = getActualCountries();

  const isLoaded = useSelector(CommonData.selectors.getIsCommonDataLoaded);
  const selectedItems = useSelector(getSelectedCountries);

  const selected = useMemo(() => {
    if (!isLoaded) {
      return [];
    }
    return countries.filter(item => selectedItems.includes(item.id));
  }, [selectedItems, isLoaded, countries]);

  return {
    items: countries,
    selected,
    ids: selectedItems,
  };
};
