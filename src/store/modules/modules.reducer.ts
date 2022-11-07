import { combineReducers } from 'redux';
import {
  CampaignSettings,
  Currencies,
  CurrencyConverter,
  Features,
  GiftingOnTheFly,
  GiftingFlow,
  User,
  Messaging,
  IModulesState,
  ProductsCount,
  TProductsCountState,
  Marketplace,
  TMarketplaceState,
  GiftEmailPreview,
  TGiftEmailPreviewState,
  Users,
  TUsersState,
  Teams,
  TTeamsState,
} from '@alycecom/modules';

export type TModulesState = Pick<
  IModulesState,
  | 'features'
  | 'giftingOnTheFly'
  | 'currencyConverter'
  | 'currencies'
  | 'campaignSettings'
  | 'giftingFlow'
  | 'user'
  | 'messaging'
> & {
  [GiftEmailPreview.name]: TGiftEmailPreviewState;
  [ProductsCount.name]: TProductsCountState;
  [Marketplace.name]: TMarketplaceState;
  [Users.name]: TUsersState;
  [Teams.name]: TTeamsState;
};

export const modules = combineReducers<TModulesState>({
  giftingOnTheFly: GiftingOnTheFly.reducer,
  features: Features.reducer,
  currencyConverter: CurrencyConverter.reducer,
  currencies: Currencies.reducer,
  campaignSettings: CampaignSettings.reducer,
  [GiftingFlow.name]: GiftingFlow.reducer,
  [Marketplace.name]: Marketplace.reducer,
  [GiftEmailPreview.name]: GiftEmailPreview.reducer,
  user: User.reducer,
  messaging: Messaging.reducer,
  productsCount: ProductsCount.reducer,
  [Users.name]: Users.reducer,
  [Teams.name]: Teams.reducer,
});
