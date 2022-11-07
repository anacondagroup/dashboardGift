import { TDictionary } from '@alycecom/utils';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getIsLoading,
  getIsIdle,
  getIsLoaded,
  getBrandIds,
  getMerchantIds,
  getVendorsMap,
} from '../store/entities/productVendors/productVendors.selectors';
import {
  getTeamId,
  getIsIdle as getIsTeamSettingsIdle,
  getRestrictedBrandIds,
  getRestrictedMerchantIds,
  getPermittedBrandIds,
  getPermittedMerchantIds,
} from '../store/teamSettings/teamSettings.selectors';
import { fetchTeamSettings } from '../store/teamSettings/teamSettings.actions';
import { fetchProductVendors } from '../store/entities/productVendors/productVendors.actions';
import { TProductVendor } from '../store/entities/productVendors/productVendors.types';

export interface IUseTeamProductVendorsProps {
  teamId?: number | null;
}

export interface IUseTeamProductVendorsValue {
  isPending: boolean;
  isFulfilled: boolean;
  isIdle: boolean;
  useEntities: () => TDictionary<TProductVendor>;
  useRestrictedBrandIds: () => number[];
  useRestrictedMerchantIds: () => number[];
  usePermittedBrandIds: () => number[];
  usePermittedMerchantIds: () => number[];
}

const teamEntitySelectors = {
  useBrandIds: () => useSelector(getBrandIds),
  useMerchantIds: () => useSelector(getMerchantIds),
  useEntities: () => useSelector(getVendorsMap),
  useRestrictedBrandIds: () => useSelector(getRestrictedBrandIds),
  useRestrictedMerchantIds: () => useSelector(getRestrictedMerchantIds),
  usePermittedBrandIds: () => useSelector(getPermittedBrandIds),
  usePermittedMerchantIds: () => useSelector(getPermittedMerchantIds),
};

export const useTeamProductVendors = ({ teamId }: IUseTeamProductVendorsProps): IUseTeamProductVendorsValue => {
  const dispatch = useDispatch();

  const isPending = useSelector(getIsLoading);
  const isFulfilled = useSelector(getIsLoaded);
  const isIdle = useSelector(getIsIdle);

  const storedTeamId = useSelector(getTeamId);
  const isSettingsIdle = useSelector(getIsTeamSettingsIdle);

  useEffect(() => {
    if (isIdle) {
      dispatch(fetchProductVendors());
    }
  }, [isIdle, dispatch]);

  useEffect(() => {
    if ((isSettingsIdle || storedTeamId !== teamId) && teamId) {
      dispatch(fetchTeamSettings({ teamId }));
    }
  }, [dispatch, isSettingsIdle, storedTeamId, teamId]);

  return {
    isPending,
    isFulfilled,
    isIdle,
    ...teamEntitySelectors,
  };
};
