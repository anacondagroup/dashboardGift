import { IProductDetails } from '@alycecom/ui';

export const productDetails: IProductDetails = {
  id: 1,
  name: 'Coffee Machine',
  type: 'physical',
  description: 'Super machine',
  specialDescription: '',
  specialDescriptionName: '',
  isDonation: false,
  isAddressRequired: true,
  isTangoCard: false,
  country: {
    id: 1,
    name: 'United States',
    code: 'US',
    image: '',
  },
  provider: {
    name: 'Shop',
    logo: 'https://logo.png',
    description: '',
    website: 'https://shop.com',
  },
  images: [],
  options: '',
  optionsList: [],
  hasExternalFulfillment: false,
};

export const products = [
  {
    id: 1,
    name: 'Product1',
    image: 'https://product1.png',
    provider: 'Adidas',
    options: '',
    hasOptions: false,
    isAddressRequired: false,
    isDonation: false,
    isTangoCard: false,
    typeId: 1,
  },
  {
    id: 2,
    name: 'Product2',
    image: 'https://product2.png',
    provider: 'Nike',
    options: '',
    hasOptions: false,
    isAddressRequired: false,
    isDonation: false,
    isTangoCard: false,
    typeId: 2,
  },
];
