import { useParams, useHistory } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { MarketplaceMode } from '../types';
import { MARKETPLACE_ROUTES } from '../routePaths';
import { resetProducts, setPage } from '../store/products/products.actions';

export const useCustomMarketplace = (): {
  marketplaceId: number | null;
  mode: MarketplaceMode;
  isEdit: boolean;
  isPreview: boolean;
  setMode: (mode: MarketplaceMode) => void;
} => {
  const { marketplaceId: mid = '', mode = MarketplaceMode.Preview } = useParams<{
    marketplaceId?: string;
    mode?: MarketplaceMode;
  }>();
  const dispatch = useDispatch();
  const { push } = useHistory();

  const setMode = useCallback(
    (nextMode: MarketplaceMode) => {
      if (mid !== '') {
        push(MARKETPLACE_ROUTES.buildCustomPath(mid, nextMode));
        dispatch(resetProducts());
        dispatch(setPage(1));
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
    },
    [mid, push, dispatch],
  );

  return useMemo(
    () => ({
      marketplaceId: Number(mid) || null,
      mode,
      isEdit: mode === MarketplaceMode.Edit,
      isPreview: mode === MarketplaceMode.Preview,
      setMode,
    }),
    [mid, mode, setMode],
  );
};
