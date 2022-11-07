export interface IProductPrice {
  currencyId: number;
  currencySign: string;
  price: number;
}

export interface IProductBrand {
  name: string;
}

export type TProduct = {
  id: number;
  image: string;
  name: string;
  provider: string;
  options: string;
  hasOptions: boolean;
  isAddressRequired: boolean;
  isDonation: boolean;
  isTangoCard: boolean;
  typeId: number;
  localPrice?: IProductPrice;
  denomination?: IProductPrice;
  countryId: number;
  brand: IProductBrand;
  hasExternalFulfillment: boolean;
};
