import { pipe, prop, propEq } from 'ramda';
import { createSelector } from 'reselect';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../store/root.types';
import { ProductTypes } from '../../../../SettingsModule/store/settings.types';

import { IProductTypesState, productTypesAdapter } from './productTypes.reducer';

const getProductTypesState = (state: IRootState): IProductTypesState => state.marketplace.entities.productTypes;
const selectors = productTypesAdapter.getSelectors(getProductTypesState);

export const getIsLoading = pipe(getProductTypesState, propEq('status', StateStatus.Pending));
export const getIsLoaded = pipe(getProductTypesState, propEq('status', StateStatus.Fulfilled));
export const getIsIdle = pipe(getProductTypesState, propEq('status', StateStatus.Idle));
export const getProductTypeCountryIdsFilters = pipe(getProductTypesState, prop('countryIdsFilters'));
export const getProductTypesMap = selectors.getEntities;
export const getProductTypes = selectors.getAll;
export const getProductTypeIds = selectors.getIds;

export const getPhysicalProductTypes = createSelector(getProductTypes, types =>
  types.filter(type => ![ProductTypes.eGift, ProductTypes.donation].includes(type.id)),
);
