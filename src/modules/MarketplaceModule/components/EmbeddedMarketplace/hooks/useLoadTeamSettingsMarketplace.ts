import { useEffect, useRef } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';

import { setDefaultFilters, setPage, updateFilters } from '../../../store/products/products.actions';
import { ProductFilter } from '../../../store/products/products.types';
import { getIsLoaded as getIsVendorsLoaded } from '../../../store/entities/productVendors/productVendors.selectors';
import { getIsLoaded as getIsTypesLoaded } from '../../../store/entities/productTypes/productTypes.selectors';
import {
  getAvailableBrandIds,
  getAvailableMerchantIds,
  getAvailableTypeIds,
  getIsLoaded as getIsTeamSettingsLoaded,
} from '../../../store/teamSettings/teamSettings.selectors';
import { fetchProductVendors } from '../../../store/entities/productVendors/productVendors.actions';
import { fetchTeamSettings } from '../../../store/teamSettings/teamSettings.actions';
import { DEFAULT_DONATION_PRICE, DEFAULT_GIFT_CARD_PRICE } from '../../../store/marketplace.constants';

export const useLoadTeamSettingsMarketplace = ({
  countryIds,
  teamId,
  selectableCountyIds,
}: {
  countryIds: number[];
  teamId: number;
  selectableCountyIds?: number[];
}): { isLoaded: boolean } => {
  const dispatch = useDispatch();
  const isVendorsLoaded = useSelector(getIsVendorsLoaded);
  const isTypesLoaded = useSelector(getIsTypesLoaded);
  const isTeamSettingsLoaded = useSelector(getIsTeamSettingsLoaded);
  const availableMerchantIds = useSelector(getAvailableMerchantIds);
  const availableBrandIds = useSelector(getAvailableBrandIds);
  const availableTypeIds = useSelector(getAvailableTypeIds);

  const isLoaded = isVendorsLoaded && isTypesLoaded && isTeamSettingsLoaded;
  const isMountRef = useRef(false);

  useEffect(() => {
    dispatch(
      updateFilters({
        [ProductFilter.GiftCardPrice]: DEFAULT_GIFT_CARD_PRICE,
        [ProductFilter.DonationPrice]: DEFAULT_DONATION_PRICE,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (isLoaded && !isMountRef.current) {
      batch(() => {
        dispatch(
          setDefaultFilters({
            [ProductFilter.MerchantIds]: availableMerchantIds,
            [ProductFilter.BrandIds]: availableBrandIds,
            [ProductFilter.TypeIds]: availableTypeIds,
            [ProductFilter.CountryIds]: countryIds,
            [ProductFilter.TeamIds]: teamId ? [teamId] : [],
            [ProductFilter.GiftCardPrice]: 0,
            [ProductFilter.DonationPrice]: 0,
          }),
        );
        dispatch(setPage(1));
        dispatch(
          updateFilters({
            [ProductFilter.CountryIds]: selectableCountyIds || countryIds,
          }),
        );
      });
      isMountRef.current = true;
    }
  }, [
    dispatch,
    isLoaded,
    availableMerchantIds,
    availableBrandIds,
    availableTypeIds,
    countryIds,
    teamId,
    selectableCountyIds,
  ]);

  useEffect(() => {
    dispatch(fetchProductVendors({ teamIds: teamId ? [teamId] : undefined }));
  }, [dispatch, teamId]);

  useEffect(() => {
    if (teamId) {
      dispatch(fetchTeamSettings({ teamId }));
    }
  }, [dispatch, teamId]);

  return {
    isLoaded,
  };
};
