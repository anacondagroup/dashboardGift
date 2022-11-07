import { combineReducers } from 'redux';

import { productCategories, IProductCategoriesState, productCategoriesEpics } from './productCategories';
import { productTypes, IProductTypesState, productTypesEpics } from './productTypes';
import { productVendors, IProductVendorsState, productVendorsEpics } from './productVendors';
import { customMarketplaces, ICustomMarketplacesState, customMarketplacesEpics } from './customMarketplaces';
import {
  customMarketplaceCampaigns,
  ICustomMarketplaceCampaignsState,
  customMarketplaceCampaignsEpics,
} from './customMarketplaceCampaigns';

export interface IEntitiesState {
  productCategories: IProductCategoriesState;
  productTypes: IProductTypesState;
  productVendors: IProductVendorsState;
  customMarketplaces: ICustomMarketplacesState;
  customMarketplaceCampaigns: ICustomMarketplaceCampaignsState;
}

export const entities = combineReducers<IEntitiesState>({
  productCategories,
  productTypes,
  productVendors,
  customMarketplaces,
  customMarketplaceCampaigns,
});

export const entitiesEpics = [
  ...productCategoriesEpics,
  ...productTypesEpics,
  ...productVendorsEpics,
  ...customMarketplacesEpics,
  ...customMarketplaceCampaignsEpics,
];
