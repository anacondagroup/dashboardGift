import { ProductTypes } from '../store/settings.types';

export enum GiftTypeOption {
  all = 'all',
  specific = 'specific',
}

export const PRODUCT_TYPE_DESCRIPTIONS: Record<ProductTypes, string> = {
  [ProductTypes.physical]: 'Bags, notebooks, tablets, etc.',
  [ProductTypes.subscription]: 'Monthly boxes like Barkbox, FabFitFun, etc.',
  [ProductTypes.onDemand]: 'Housecleaners, personal chef, etc.',
  [ProductTypes.experience]: 'Food tours, sunset cruises, etc.',
  [ProductTypes.donation]:
    'A donation gift is a monetary donation to a charity of your choice on behalf of the recipient.',
  [ProductTypes.eGift]: 'An E-Gift Cards from Amazon, Target, etc',
  [ProductTypes.brandedProduct]: "Items branded with your company's logo (on-demand)",
};
