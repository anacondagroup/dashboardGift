import { object, number, string, array, boolean, ref, NumberSchema } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { productVendorsSchema } from '../entities/productVendors/productVendors.schemas';
import { productTypesSchema } from '../entities/productTypes/productTypes.schemas';

import { TCustomMarketplaceForm, TCustomMarketplaceGiftFilters } from './customMarketplace.types';

const settingMinPrice = number()
  .default(null)
  .nullable()
  .label('Gift Min')
  .positive()
  .integer()
  .min(0)
  .max(ref('maxPrice'), ({ label, max }) => `${label} should be less or equal then ${max || 'Gift Max'}`)
  .when('isPhysicalGiftsAllowed', (isAllowed: boolean, schema: NumberSchema<number | null>) =>
    isAllowed ? schema.required() : schema,
  );

const settingMaxPrice = number()
  .default(null)
  .nullable()
  .label('Gift Max')
  .positive()
  .integer()
  .min(ref('minPrice'))
  .max(5000)
  .when('isPhysicalGiftsAllowed', (isAllowed: boolean, schema: NumberSchema<number | null>) =>
    isAllowed ? schema.required() : schema,
  );

const settingGiftCardPrice = number()
  .default(null)
  .label('Gift Card Max')
  .nullable()
  .positive()
  .integer()
  .min(5)
  .max(5000)
  .when('isGiftCardsAllowed', (isAllowed: boolean, schema: NumberSchema<number | null>) =>
    isAllowed ? schema.required() : schema,
  );

const settingDonationPrice = number()
  .nullable()
  .default(null)
  .label('Amount')
  .positive()
  .integer()
  .min(5)
  .max(5000)
  .when('isDonationsAllowed', (isAllowed: boolean, schema: NumberSchema<number | null>) =>
    isAllowed ? schema.required() : schema,
  );

const name = string().default('').label('Marketplace Name').trim().min(3).max(255).required();

const countryIds = array().label('Gift Recipient Country').default([]).min(1).required();

const teamIds = array().label('Team').min(1).default([]).required();

const settingIsPhysicalGiftsAllowed = boolean().default(true);

const settingIsGiftCardsAllowed = boolean()
  .default(false)
  .when(['isPhysicalGiftsAllowed', 'isDonationsAllowed'], {
    is: false,
    then: boolean().oneOf([true]),
  });

const settingIsDonationsAllowed = boolean()
  .default(false)
  .when(['isPhysicalGiftsAllowed', 'isGiftCardsAllowed'], {
    is: false,
    then: boolean().oneOf([true]),
  });

export const customMarketplaceSchema = object().shape(
  {
    name,
    countryIds,
    teamIds,
    minPrice: settingMinPrice,
    maxPrice: settingMaxPrice,
    giftCardPrice: settingGiftCardPrice,
    donationPrice: settingDonationPrice,
    isGiftCardsAllowed: settingIsGiftCardsAllowed,
    isDonationsAllowed: settingIsDonationsAllowed,
    isPhysicalGiftsAllowed: settingIsPhysicalGiftsAllowed,
  },
  [
    ['isGiftCardsAllowed', 'isDonationsAllowed'],
    ['minPrice', 'maxPrice'],
  ],
);

export const customMarketplaceSchemaResolver = yupResolver(customMarketplaceSchema);
export const customMarketplaceFormDefaultValue = customMarketplaceSchema.getDefault() as TCustomMarketplaceForm;

export const filterMinPrice = number().default(null).nullable();
export const filterMaxPrice = number().default(null).nullable();
export const filterGiftCardPrice = number().default(null).nullable();
export const filterDonationPrice = number().default(null).nullable();

export const customMarketplaceBudgetFiltersSchema = object().shape({
  minPrice: filterMinPrice,
  maxPrice: filterMaxPrice,
  donationPrice: filterDonationPrice,
  giftCardPrice: filterGiftCardPrice,
});

export const customMarketplaceGiftFiltersSchema = object()
  .shape({})
  .concat(productVendorsSchema)
  .concat(productTypesSchema)
  .concat(customMarketplaceBudgetFiltersSchema);

export const customMarketplaceFiltersDefaultValue = customMarketplaceGiftFiltersSchema.getDefault() as TCustomMarketplaceGiftFilters;

export const customMarketplaceGiftFiltersResolver = yupResolver(customMarketplaceGiftFiltersSchema);
