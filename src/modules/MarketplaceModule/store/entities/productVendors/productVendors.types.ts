import { IOption } from '@alycecom/ui';

export enum ProductVendorsTypes {
  Brand = 'brand',
  Merchant = 'merchant',
}

export type TProductMerchant = IOption & {
  type: ProductVendorsTypes.Brand;
};

export type TProductBrand = IOption & {
  type: ProductVendorsTypes.Merchant;
};

export type TProductVendor = TProductMerchant | TProductBrand;
