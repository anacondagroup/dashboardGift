import { giftTypesEpics } from './giftTypes';
import { giftVendorsEpics } from './giftVendors';
import { giftLinksEpics } from './giftLinks';
import { customMarketplacesEpics } from './customMarketplaces';
import defaultGiftProductsEpics from './defaultGiftProducts/defaultGiftProducts.epics';

export const entitiesEpics = [
  ...giftTypesEpics,
  ...giftVendorsEpics,
  ...giftLinksEpics,
  ...customMarketplacesEpics,
  ...defaultGiftProductsEpics,
];
