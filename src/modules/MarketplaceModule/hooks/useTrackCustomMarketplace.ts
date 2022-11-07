import { User } from '@alycecom/modules';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';

import {
  trackCustomMarketplaceCreateClicked,
  trackCustomMarketplaceExportResults,
  trackCustomMarketplaceModeChanged,
  trackCustomMarketplaceProductAdded,
  trackCustomMarketplaceProductDetailsViewed,
} from '../events';
import { getMarketplaceId } from '../store/customMarketplace/customMarketplace.selectors';
import { MarketplaceMode } from '../types';

export const useTrackCustomMarketplaceCreateClicked = (): (() => void) => {
  const dispatch = useDispatch();
  const [payload, options] = useSelector(User.selectors.getBaseEventPayload);

  return useCallback(() => {
    dispatch(trackCustomMarketplaceCreateClicked(payload, options));
  }, [dispatch, payload, options]);
};

export const useTrackCustomMarketplaceProductAdded = (): ((
  from: 'bulk' | 'single' | 'preview',
  productId?: number | null,
) => void) => {
  const dispatch = useDispatch();
  const [payload, options] = useSelector(User.selectors.getBaseEventPayload);
  const marketplaceId = useSelector(getMarketplaceId);

  return useCallback(
    (from: 'bulk' | 'single' | 'preview', productId: number | null = null) => {
      if (marketplaceId) {
        dispatch(trackCustomMarketplaceProductAdded({ ...payload, from, marketplaceId, productId }, options));
      }
    },
    [dispatch, payload, options, marketplaceId],
  );
};

export const useTrackCustomMarketplaceProductDetailsViewed = (): ((productId: number) => void) => {
  const dispatch = useDispatch();
  const [payload, options] = useSelector(User.selectors.getBaseEventPayload);
  const marketplaceId = useSelector(getMarketplaceId);

  return useCallback(
    (productId: number) => {
      if (marketplaceId) {
        dispatch(trackCustomMarketplaceProductDetailsViewed({ ...payload, marketplaceId, productId }, options));
      }
    },
    [dispatch, payload, options, marketplaceId],
  );
};

export const useTrackCustomMarketplaceModeChanged = (): ((mode: MarketplaceMode) => void) => {
  const dispatch = useDispatch();
  const [payload, options] = useSelector(User.selectors.getBaseEventPayload);
  const marketplaceId = useSelector(getMarketplaceId);

  return useCallback(
    (mode: MarketplaceMode) => {
      if (marketplaceId) {
        dispatch(trackCustomMarketplaceModeChanged({ ...payload, marketplaceId, mode }, options));
      }
    },
    [dispatch, payload, options, marketplaceId],
  );
};

export const useTrackCustomMarketplaceExportResults = (): ((mode: MarketplaceMode) => void) => {
  const dispatch = useDispatch();
  const [payload, options] = useSelector(User.selectors.getBaseEventPayload);
  const marketplaceId = useSelector(getMarketplaceId);

  return useCallback(
    (mode: MarketplaceMode) => {
      if (marketplaceId) {
        dispatch(trackCustomMarketplaceExportResults({ ...payload, marketplaceId, mode }, options));
      }
    },
    [dispatch, payload, options, marketplaceId],
  );
};
