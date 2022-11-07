import { UseFormReset } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useDebounce } from 'react-use';

import { getBudgetFilters, getSelectedGiftTypes, getSelectedVendors } from '../store/products/products.selectors';
import { TCampaignMarketplaceForm } from '../store/campaignSettings/campaignSettings.types';
import { ProductFilter } from '../store/products/products.types';

export const useSyncFiltersWithForm = (reset: UseFormReset<TCampaignMarketplaceForm>): void => {
  const budget = useSelector(getBudgetFilters);
  const types = useSelector(getSelectedGiftTypes);
  const vendors = useSelector(getSelectedVendors);

  useDebounce(
    () => {
      reset({
        ...{
          [ProductFilter.MinPrice]: null,
          [ProductFilter.MaxPrice]: null,
          [ProductFilter.DonationPrice]: null,
          [ProductFilter.GiftCardPrice]: null,
          ...budget,
        },
        [ProductFilter.TypeIds]: types,
        [ProductFilter.MerchantIds]: [],
        [ProductFilter.BrandIds]: [],
        [ProductFilter.Vendors]: vendors,
      });
    },
    1000,
    [reset, budget, types, vendors],
  );
};
