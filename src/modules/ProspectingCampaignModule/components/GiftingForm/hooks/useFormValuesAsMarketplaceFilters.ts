import { useSelector } from 'react-redux';
import { without } from 'ramda';
import qs from 'query-string';
import { useMemo } from 'react';

import { getDetailsData } from '../../../store/prospectingCampaign/steps/details/details.selectors';
import { IFilters, ProductFilter } from '../../../../MarketplaceModule/store/products/products.types';
import { useTeamProductTypes } from '../../../../MarketplaceModule/hooks/useTeamProductTypes';
import { TProspectingGiftMarketplaceData } from '../../../store/prospectingCampaign/prospectingCampaign.types';
import { useTeamProductVendors } from '../../../../MarketplaceModule/hooks/useTeamProductVendors';
import { MarketplaceDataFields } from '../../../store/prospectingCampaign/steps/gifting/gifting.types';

export const useFormValuesAsMarketplaceFilters = (
  marketplaceData: TProspectingGiftMarketplaceData | null,
): [boolean, IFilters] => {
  const { teamId, countryIds = [] } = useSelector(getDetailsData) || {};
  const { usePermittedIds, isFulfilled: isProductTypesFulfilled } = useTeamProductTypes({ teamId, fetch: false });
  const { usePermittedBrandIds, usePermittedMerchantIds, isFulfilled: isVendorsFulfilled } = useTeamProductVendors({
    teamId,
  });
  const permittedTypeIds = usePermittedIds();
  const permittedBrandIds = usePermittedBrandIds();
  const permittedMerchantIds = usePermittedMerchantIds();

  const isReady = !!teamId && !!countryIds?.length && isProductTypesFulfilled && isVendorsFulfilled;

  const {
    [MarketplaceDataFields.RestrictedTypeIds]: restrictedTypeIds,
    [MarketplaceDataFields.RestrictedMerchantIds]: restrictedMerchantIds,
    [MarketplaceDataFields.RestrictedBrandIds]: restrictedBrandIds,
    [MarketplaceDataFields.GiftCardPrice]: giftCardPrice,
    [MarketplaceDataFields.DonationPrice]: donationPrice,
    [MarketplaceDataFields.MinPrice]: minPrice,
    [MarketplaceDataFields.MaxPrice]: maxPrice,
  } = marketplaceData || {};

  const mergedPermittedTypeIds = useMemo(() => without(restrictedTypeIds || [], permittedTypeIds), [
    restrictedTypeIds,
    permittedTypeIds,
  ]);
  const mergedPermittedMerchantIds = useMemo(() => without(restrictedMerchantIds || [], permittedMerchantIds), [
    restrictedMerchantIds,
    permittedMerchantIds,
  ]);
  const mergedPermittedBrandIds = useMemo(() => without(restrictedBrandIds || [], permittedBrandIds), [
    restrictedBrandIds,
    permittedBrandIds,
  ]);

  return useMemo(
    () => [
      isReady,
      {
        [ProductFilter.CountryIds]: countryIds,
        [ProductFilter.GiftCardPrice]: giftCardPrice,
        [ProductFilter.DonationPrice]: donationPrice,
        [ProductFilter.MinPrice]: minPrice,
        [ProductFilter.MaxPrice]: maxPrice,
        [ProductFilter.TypeIds]: mergedPermittedTypeIds,
        [ProductFilter.MerchantIds]: mergedPermittedMerchantIds,
        [ProductFilter.BrandIds]: mergedPermittedBrandIds,
        [ProductFilter.CategoryIds]: [],
        [ProductFilter.Vendors]: [],
      },
    ],
    [
      countryIds,
      isReady,
      giftCardPrice,
      donationPrice,
      minPrice,
      maxPrice,
      mergedPermittedTypeIds,
      mergedPermittedMerchantIds,
      mergedPermittedBrandIds,
    ],
  );
};

export const useMarketplaceDataAsQueryParams = (
  marketplaceData: TProspectingGiftMarketplaceData,
): [boolean, string] => {
  const [isReady, filters] = useFormValuesAsMarketplaceFilters(marketplaceData);

  return useMemo(
    () => [
      isReady,
      qs.stringify(filters, {
        arrayFormat: 'comma',
        skipNull: true,
        skipEmptyString: true,
      }),
    ],
    [filters, isReady],
  );
};
