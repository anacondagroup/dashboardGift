import { array, number, object, ref } from 'yup';
import { EntityId } from '@alycecom/utils';
import { yupResolver } from '@hookform/resolvers/yup';

import { GiftTypes as GiftTypesEnum } from '../../entities/giftTypes/giftTypes.types';
import { getIsGiftBudgetBlocked } from '../../entities/giftTypes/giftTypes.helpers';

import { IRestrictedVendors } from './gift.types';

export enum MarketplaceFormFields {
  GiftTypes = 'restrictedGiftTypeIds',
  MinBudgetPrice = 'minBudgetAmount',
  MaxBudgetPrice = 'maxBudgetAmount',
  MaxGiftCardPrice = 'giftCardMaxBudget',
  DonationPrice = 'donationMaxBudget',
  AllowedVendors = 'allowedVendors',
}

export interface IMarketplaceFormValues {
  [MarketplaceFormFields.GiftTypes]: EntityId[];
  [MarketplaceFormFields.MinBudgetPrice]: number | null;
  [MarketplaceFormFields.MaxBudgetPrice]: number | null;
  [MarketplaceFormFields.MaxGiftCardPrice]: number | null;
  [MarketplaceFormFields.DonationPrice]: number | null;
  [MarketplaceFormFields.AllowedVendors]: IRestrictedVendors;
}

const minBudgetPrice = number()
  .nullable()
  .default(null)
  .label('Minimum')
  .positive()
  .integer()
  .min(0)
  .max(4999)
  .lessThan(
    ref(MarketplaceFormFields.MaxBudgetPrice),
    ({ label, less }) => `${label} should be less than ${less || 'Maximum'}`,
  )
  .when([MarketplaceFormFields.GiftTypes, '$restrictedByTeamGiftTypeIds', '$unavailableGiftTypeIds'], {
    is: (giftTypeIds: number[], restrictedByTeamGiftTypeIds: number[], unavaialbleGiftTypeIds: number[]) =>
      !getIsGiftBudgetBlocked(giftTypeIds, restrictedByTeamGiftTypeIds, unavaialbleGiftTypeIds),
    then: number().nullable().required(),
  });

const maxBudgetPrice = number()
  .nullable()
  .default(null)
  .label('Maximum')
  .positive()
  .integer()
  .max(5000)
  .moreThan(
    ref(MarketplaceFormFields.MinBudgetPrice),
    ({ label, more }) => `${label} should be more than ${more > 4999 ? 'Minimum' : more}`,
  )
  .when([MarketplaceFormFields.GiftTypes, '$restrictedByTeamGiftTypeIds', '$unavailableGiftTypeIds'], {
    is: (giftTypeIds: number[], restrictedByTeamGiftTypeIds: number[], unavailableGiftTypeIds: number[]) =>
      !getIsGiftBudgetBlocked(giftTypeIds, restrictedByTeamGiftTypeIds, unavailableGiftTypeIds),
    then: number().nullable().required(),
  });

const maxGiftCardPrice = number()
  .nullable()
  .default(null)
  .label('Max amount')
  .positive()
  .integer()
  .min(0)
  .max(5000)
  .when([MarketplaceFormFields.GiftTypes, '$restrictedByTeamGiftTypeIds', '$unavailableGiftTypeIds'], {
    is: (restrictedGiftTypeIds: number[], restrictedByTeamGiftTypeIds: number[], unavailableGiftTypeIds: number[]) => {
      if (!restrictedGiftTypeIds) {
        return false;
      }
      return ![...restrictedGiftTypeIds, ...restrictedByTeamGiftTypeIds, ...unavailableGiftTypeIds].includes(
        GiftTypesEnum.giftCard,
      );
    },
    then: number().nullable().required(),
  });

const donationPrice = number()
  .nullable()
  .default(null)
  .label('Amount')
  .positive()
  .integer()
  .min(0)
  .max(5000)
  .when([MarketplaceFormFields.GiftTypes, '$restrictedByTeamGiftTypeIds', '$unavailableGiftTypeIds'], {
    is: (restrictedGiftTypeIds: number[], restrictedByTeamGiftTypeIds: number[], unavailableGiftTypeIds: number[]) => {
      if (!restrictedGiftTypeIds) {
        return false;
      }
      return ![...restrictedGiftTypeIds, ...restrictedByTeamGiftTypeIds, ...unavailableGiftTypeIds].includes(
        GiftTypesEnum.donation,
      );
    },
    then: number().nullable().required(),
  });

const GIFT_TYPES_AMOUNT = Object.values(GiftTypesEnum).length / 2;

const restrictedGiftTypes = array()
  .label('Gift types')
  .default([])
  .test('validate', 'At least one gift type should be allowed', newRestrictedTypes =>
    Boolean(newRestrictedTypes && newRestrictedTypes.length < GIFT_TYPES_AMOUNT),
  );

const allowedVendors = object().shape({
  restrictedBrandIds: array().default([]),
  restrictedMerchantIds: array().default([]),
});

export const exchangeMarketplaceSettingsSchema = object().shape(
  {
    [MarketplaceFormFields.MinBudgetPrice]: minBudgetPrice,
    [MarketplaceFormFields.MaxBudgetPrice]: maxBudgetPrice,
    [MarketplaceFormFields.MaxGiftCardPrice]: maxGiftCardPrice,
    [MarketplaceFormFields.DonationPrice]: donationPrice,
    [MarketplaceFormFields.GiftTypes]: restrictedGiftTypes,
    [MarketplaceFormFields.AllowedVendors]: allowedVendors,
  },
  [['minPrice', 'maxPrice']],
);

export const exchangeMarketplaceSettingsDefaultValues = exchangeMarketplaceSettingsSchema.getDefault() as IMarketplaceFormValues;

export const exchangeMarketplaceSettingsResolver = yupResolver(exchangeMarketplaceSettingsSchema);
