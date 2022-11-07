import { array, boolean, number, object, ref, string, StringSchema } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { ProductTypes } from '../../../../../SettingsModule/store/settings.types';

import { MarketplaceOption } from './gifting.constants';
import {
  CustomMarketplaceDataFields,
  DefaultGiftDataFields,
  GiftActionsDataFields,
  GiftingStepFields,
  MarketplaceDataFields,
  RecipientActionsDataFields,
  RecipientActionsFields,
  TSwagCampaignGiftingForm,
} from './gifting.types';

const isPhysicalEnabledSchema = boolean().default(true);
const isGiftCardEnabledSchema = boolean().default(false);
const isDonationEnabledSchema = boolean().default(false);

const optionSchema = string().default(MarketplaceOption.CampaignBudget).required();

const minPriceSchema = number()
  .label('Min Price')
  .min(0)
  .default(null)
  .nullable()
  .max(
    ref(MarketplaceDataFields.MaxBudgetAmount),
    ({ label, max }) => `${label} should be less or equal then ${max || 'Max Price'}`,
  )
  .when(['$isCampaignMarketplaceEnabled', MarketplaceDataFields.IsPhysicalEnabled], {
    is: (isCampaignMarketplaceEnabled: boolean, isPhysicalEnabled: boolean) =>
      isCampaignMarketplaceEnabled && isPhysicalEnabled,
    then: schema => schema.required(),
    otherwise: schema => schema,
  });
const maxPriceSchema = number()
  .label('Max Price')
  .max(5000)
  .default(null)
  .nullable()
  .when(['$isCampaignMarketplaceEnabled', MarketplaceDataFields.IsPhysicalEnabled], {
    is: (isCampaignMarketplaceEnabled: boolean, isPhysicalEnabled: boolean) =>
      isCampaignMarketplaceEnabled && isPhysicalEnabled,
    then: schema => schema.required(),
    otherwise: schema => schema,
  });
const giftCardPriceSchema = number()
  .label('Gift Card Price')
  .min(0)
  .max(5000)
  .nullable()
  .default(null)
  .when(['$isCampaignMarketplaceEnabled', MarketplaceDataFields.IsGiftCardEnabled], {
    is: (isCampaignMarketplaceEnabled: boolean, isGiftCardEnabled: boolean) =>
      isCampaignMarketplaceEnabled && isGiftCardEnabled,
    then: schema => schema.required(),
    otherwise: schema => schema,
  });
const donationPriceSchema = number()
  .label('Donation Price')
  .min(0)
  .max(5000)
  .nullable()
  .default(null)
  .when(['$isCampaignMarketplaceEnabled', MarketplaceDataFields.IsDonationEnabled], {
    is: (isCampaignMarketplaceEnabled: boolean, isDonationEnabled: boolean) =>
      isCampaignMarketplaceEnabled && isDonationEnabled,
    then: schema => schema.required(),
    otherwise: schema => schema,
  });
const restrictedGiftTypeIdsSchema = array()
  .label('Product Types')
  .default([])
  .max(Object.values(ProductTypes).length / 2 - 1);
const restrictedBrandIdsSchema = array().default([]);
const restrictedMerchantIdsSchema = array().default([]);

const defaultGiftProductIdSchema = number().default(null);
const defaultGiftDenominationSchema = number().default(null).nullable().min(0).max(5000);

const acceptSchema = boolean().oneOf([true]).default(true);
const exchangeSchema = boolean().default(true);
const donateSchema = boolean().default(false);

const capturePhoneSchema = boolean().default(false);
const captureEmailSchema = boolean().default(false);
const captureDateSchema = boolean().default(false);
const captureAffidavitSchema = boolean().default(false);
const gifterAffidavitSchema = string()
  .label('Custom terms & conditions')
  .nullable()
  .default(null)
  .trim()
  .max(255)
  .when(RecipientActionsFields.CaptureAffidavit, (isEnabled: boolean, schema: StringSchema<string | null>) =>
    isEnabled ? schema.required() : schema,
  );
const captureQuestionSchema = boolean().default(false);
const gifterQuestionSchema = string()
  .label('Custom questions')
  .nullable()
  .default(null)
  .trim()
  .max(255)
  .when(RecipientActionsFields.CaptureQuestion, (isEnabled: boolean, schema: StringSchema<string | null>) =>
    isEnabled ? schema.required() : schema,
  );

const customMarketPlaceIdSchema = number().label('Custom marketplace').min(0).nullable().default(null);

const marketplaceDataSchema = object().shape(
  {
    [MarketplaceDataFields.MinBudgetAmount]: minPriceSchema,
    [MarketplaceDataFields.MaxBudgetAmount]: maxPriceSchema,
    [MarketplaceDataFields.GiftCardMaxBudget]: giftCardPriceSchema,
    [MarketplaceDataFields.DonationMaxBudget]: donationPriceSchema,
    [MarketplaceDataFields.RestrictedGiftTypeIds]: restrictedGiftTypeIdsSchema,
    [MarketplaceDataFields.RestrictedBrandIds]: restrictedBrandIdsSchema,
    [MarketplaceDataFields.RestrictedMerchantIds]: restrictedMerchantIdsSchema,

    [MarketplaceDataFields.IsPhysicalEnabled]: isPhysicalEnabledSchema,
    [MarketplaceDataFields.IsDonationEnabled]: isDonationEnabledSchema,
    [MarketplaceDataFields.IsGiftCardEnabled]: isGiftCardEnabledSchema,
  },
  [[MarketplaceDataFields.MaxBudgetAmount, MarketplaceDataFields.MinBudgetAmount]],
);

const customMarketplaceDataSchema = object().shape({
  [CustomMarketplaceDataFields.Id]: customMarketPlaceIdSchema,
});

const defaultGiftSchema = object()
  .shape({
    [DefaultGiftDataFields.ProductId]: defaultGiftProductIdSchema,
    [DefaultGiftDataFields.Denomination]: defaultGiftDenominationSchema,
  })
  .nullable()
  .required();

const defaultGiftDataSchema = object().shape({
  [DefaultGiftDataFields.DefaultGift]: defaultGiftSchema,
});

const giftActionsDataSchema = object().shape({
  [GiftActionsDataFields.Accept]: acceptSchema,
  [GiftActionsDataFields.Exchange]: exchangeSchema,
  [GiftActionsDataFields.Donate]: donateSchema,
});

const recipientActionsSchema = object().shape({
  [RecipientActionsFields.CapturePhone]: capturePhoneSchema,
  [RecipientActionsFields.CaptureEmail]: captureEmailSchema,
  [RecipientActionsFields.CaptureDate]: captureDateSchema,
  [RecipientActionsFields.CaptureAffidavit]: captureAffidavitSchema,
  [RecipientActionsFields.GifterAffidavit]: gifterAffidavitSchema,
  [RecipientActionsFields.CaptureQuestion]: captureQuestionSchema,
  [RecipientActionsFields.GifterQuestion]: gifterQuestionSchema,
});

const recipientActionsDataSchema = object().shape({
  [RecipientActionsDataFields.RecipientActions]: recipientActionsSchema,
});

export const giftingFormSchema = object().shape({
  [GiftingStepFields.OptionMarketplace]: optionSchema,
  [GiftingStepFields.ExchangeMarketplaceSettings]: marketplaceDataSchema,
  [GiftingStepFields.CustomMarketPlaceData]: customMarketplaceDataSchema,
  [GiftingStepFields.DefaultGiftData]: defaultGiftDataSchema,
  [GiftingStepFields.GiftActionsData]: giftActionsDataSchema,
  [GiftingStepFields.RecipientActionsData]: recipientActionsDataSchema,
});

export const giftingFormResolver = yupResolver(giftingFormSchema);
export const giftingFormDefaultValues = giftingFormSchema.getDefault() as TSwagCampaignGiftingForm;
