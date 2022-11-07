import { combineReducers } from 'redux';

import { giftTypes, TGiftTypesState } from './giftTypes';
import { giftVendors, TGiftVendorsState } from './giftVendors';
import { TGiftLinksState, giftLinks } from './giftLinks';
import { TCustomMarketplacesState, customMarketplaces } from './customMarketplaces';
import { defaultGiftProducts, TDefaultGiftProductsState } from './defaultGiftProducts/defaultGiftProducts.reducer';

export interface IActivateEntitiesState {
  giftTypes: TGiftTypesState;
  giftVendors: TGiftVendorsState;
  giftLinks: TGiftLinksState;
  customMarketplaces: TCustomMarketplacesState;
  defaultGiftProducts: TDefaultGiftProductsState;
}

export const entities = combineReducers<IActivateEntitiesState>({
  giftTypes,
  giftVendors,
  giftLinks,
  customMarketplaces,
  defaultGiftProducts,
});
