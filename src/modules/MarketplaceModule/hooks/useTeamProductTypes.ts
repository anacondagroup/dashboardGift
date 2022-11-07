import { EntityId, TDictionary } from '@alycecom/utils';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { equals } from 'ramda';

import { TProductType } from '../store/entities/productTypes/productTypes.types';
import {
  getIsIdle,
  getIsLoaded,
  getIsLoading,
  getPhysicalProductTypes,
  getProductTypeCountryIdsFilters,
  getProductTypeIds,
  getProductTypes,
  getProductTypesMap,
} from '../store/entities/productTypes/productTypes.selectors';
import {
  getAvailableTypes,
  getAvailableTypeIds,
  getRestrictedTypeIds as getTeamRestrictedTypeIds,
  getRestrictedMerchantIds,
  getRestrictedBrandIds,
  getTeamId,
  getIsIdle as getIsTeamSettingsIdle,
  getIsLoaded as getIsTeamSettingsFulfilled,
  makeGetAvailableTypeIdsByCountryId,
  makeGetNotAvailableTypeIdsByCountryId,
} from '../store/teamSettings/teamSettings.selectors';
import { fetchProductTypes } from '../store/entities/productTypes/productTypes.actions';
import { fetchTeamSettings } from '../store/teamSettings/teamSettings.actions';

export interface IUseProductTypesProps {
  teamId?: number | null;
  fetch?: boolean;
}

export interface IUseProductTypesValue {
  isPending: boolean;
  isFulfilled: boolean;
  isIdle: boolean;
  useIds: () => EntityId[];
  useEntities: () => TDictionary<TProductType>;
  useAll: () => TProductType[];
  usePhysicalProductTypes: () => TProductType[];
  usePermitted: () => TProductType[];
  usePermittedIds: () => EntityId[];
  useRestrictedIds: () => EntityId[];
  useAvailableByCountryIds: (countryIds: number[]) => EntityId[];
  useNotAvailableByCountryIds: (countryIds: number[]) => EntityId[];
}

const teamEntitySelectors = {
  useIds: () => useSelector(getProductTypeIds),
  useEntities: () => useSelector(getProductTypesMap),
  useAll: () => useSelector(getProductTypes),
  usePhysicalProductTypes: () => useSelector(getPhysicalProductTypes),
  usePermitted: () => useSelector(getAvailableTypes),
  usePermittedIds: () => useSelector(getAvailableTypeIds),
  useRestrictedIds: () => useSelector(getTeamRestrictedTypeIds),
  useAvailableByCountryIds: (countryIds: number[]) =>
    useSelector(useMemo(() => makeGetAvailableTypeIdsByCountryId(countryIds), [countryIds])),
  useNotAvailableByCountryIds: (countryIds: number[]) =>
    useSelector(useMemo(() => makeGetNotAvailableTypeIdsByCountryId(countryIds), [countryIds])),
};

export const useTeamProductTypes = ({ teamId, fetch = true }: IUseProductTypesProps): IUseProductTypesValue => {
  const dispatch = useDispatch();

  const isPending = useSelector(getIsLoading);
  const isFulfilled = useSelector(getIsLoaded);
  const isIdle = useSelector(getIsIdle);
  const countryIdsFilters = useSelector(getProductTypeCountryIdsFilters);

  const storedTeamId = useSelector(getTeamId);
  const isSettingsIdle = useSelector(getIsTeamSettingsIdle);
  const isSettingsFulfilled = useSelector(getIsTeamSettingsFulfilled);

  const restrictedBrandIds = useSelector(getRestrictedBrandIds);
  const restrictedMerchantIds = useSelector(getRestrictedMerchantIds);

  useEffect(() => {
    const reqCountryIdsFilters = {
      restrictedBrandIds,
      restrictedMerchantIds,
    };
    if (
      fetch &&
      ((!teamId && isIdle) ||
        (teamId && isSettingsFulfilled && (isIdle || !equals(countryIdsFilters, reqCountryIdsFilters))))
    ) {
      dispatch(fetchProductTypes(reqCountryIdsFilters));
    }
  }, [
    isIdle,
    dispatch,
    teamId,
    isSettingsFulfilled,
    restrictedBrandIds,
    restrictedMerchantIds,
    countryIdsFilters,
    fetch,
  ]);

  useEffect(() => {
    if ((isSettingsIdle || storedTeamId !== teamId) && teamId && fetch) {
      dispatch(fetchTeamSettings({ teamId }));
    }
  }, [dispatch, isSettingsIdle, storedTeamId, teamId, fetch]);

  return {
    isPending,
    isFulfilled,
    isIdle,
    ...teamEntitySelectors,
  };
};
