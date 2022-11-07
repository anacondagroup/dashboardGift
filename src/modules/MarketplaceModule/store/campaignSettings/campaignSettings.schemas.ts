import { object, number } from 'yup';

import { productVendorsSchema } from '../entities/productVendors/productVendors.schemas';
import { productTypesSchema } from '../entities/productTypes/productTypes.schemas';

import { TCampaignMarketplaceForm } from './campaignSettings.types';

const minPrice = number().default(null).nullable().label('Min amount').positive().integer().min(0).max(5000);

const maxPrice = number().default(null).nullable().label('Max amount').positive().integer().min(0).max(5000);

const giftCardPrice = number().default(null).label('Gift card amount').nullable().positive().integer().min(0).max(5000);

const donationPrice = number().default(null).label('Donation amount').nullable().positive().integer().min(0).max(5000);

export const campaignBudgetSchema = object().shape({
  minPrice,
  maxPrice,
  giftCardPrice,
  donationPrice,
});

export const basicSettingsSchema = object().shape({}).concat(productVendorsSchema).concat(productTypesSchema);

export const campaignSettingsFormSchema = object()
  .shape({})
  .concat(productVendorsSchema)
  .concat(productTypesSchema)
  .concat(campaignBudgetSchema);

export const campaignSettingsFormDefaultValues = campaignSettingsFormSchema.getDefault() as TCampaignMarketplaceForm;
