import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, batch } from 'react-redux';
import { EntityId } from '@alycecom/utils';

import { useFormValuesAsMarketplaceFilters } from '../../../hooks/useFormValuesAsMarketplaceFilters';
import { TSwagGiftMarketplaceData } from '../../../../../store/swagCampaign/swagCampaign.types';
import {
  setDefaultFilters,
  setFilters,
  setPage,
} from '../../../../../../MarketplaceModule/store/products/products.actions';
import { ProductFilter } from '../../../../../../MarketplaceModule/store/products/products.types';

export const useLoadSwagMarketplace = (
  marketplaceData: TSwagGiftMarketplaceData,
): { isLoaded: boolean; permittedTypeIds: EntityId[] } => {
  const dispatch = useDispatch();
  const [isLoaded, filters] = useFormValuesAsMarketplaceFilters(marketplaceData);

  const isMountRef = useRef(false);

  useEffect(() => {
    if (isLoaded && !isMountRef.current) {
      batch(() => {
        dispatch(setDefaultFilters(filters));
        dispatch(setFilters(filters));
        dispatch(setPage(1));
      });
      isMountRef.current = true;
    }
  }, [dispatch, filters, isLoaded]);

  const { [ProductFilter.TypeIds]: permittedTypeIds } = filters;

  return useMemo(
    () => ({
      isLoaded,
      permittedTypeIds,
    }),
    [isLoaded, permittedTypeIds],
  );
};
