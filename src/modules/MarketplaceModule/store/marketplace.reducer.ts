import { combineReducers } from 'redux';

import products, { IProductsState } from './products/products.reducer';
import productDetails, { IProductDetailsState } from './productDetails/productDetails.reducer';
import { campaignSettings, ICampaignSettingsState } from './campaignSettings';
import { customMarketplace, ICustomMarketplaceState } from './customMarketplace/customMarketplace.reducer';
import { entities, IEntitiesState } from './entities';
import { TTeamSettingsState, teamSettings } from './teamSettings';
import { IPriceAvailabilityState, priceAvailability } from './priceAvailability/priceAvailability.reducer';

export interface IMarketplaceState {
  products: IProductsState;
  productDetails: IProductDetailsState;
  campaignSettings: ICampaignSettingsState;
  customMarketplace: ICustomMarketplaceState;
  teamSettings: TTeamSettingsState;
  entities: IEntitiesState;
  priceAvailability: IPriceAvailabilityState;
}

const reducer = combineReducers<IMarketplaceState>({
  products,
  productDetails,
  campaignSettings,
  customMarketplace,
  entities,
  teamSettings,
  priceAvailability,
});

export default reducer;
