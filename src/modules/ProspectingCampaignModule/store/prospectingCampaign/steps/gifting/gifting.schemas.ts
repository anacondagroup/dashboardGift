import { array, boolean, BooleanSchema, number, NumberSchema, object, ref, string, StringSchema } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { TProspectingDefaultGift } from '../../prospectingCampaign.types';
import { ProductTypes } from '../../../../../SettingsModule/store/settings.types';

import { GiftExpireOption } from './gifting.constants';
import {
  CustomMarketplaceDataFields,
  DefaultGiftsDataFields,
  GiftActionsDataFields,
  GiftingStepFields,
  MarketplaceDataFields,
  RecipientActionsDataFields,
  RecipientActionsFields,
  TProspectingGiftingForm,
} from './gifting.types';

const isPhysicalEnabledSchema = boolean().default(true);
const isGiftCardEnabledSchema = boolean().default(true);
const isDonationEnabledSchema = boolean().default(true);

const minPriceSchema = number()
  .label('Min Price')
  .min(0)
  .lessThan(ref(MarketplaceDataFields.MaxPrice), ({ label }) => `${label} should be less than Max Price`)
  .nullable()
  .default(null)
  .when(MarketplaceDataFields.IsPhysicalEnabled, (isEnabled: boolean, schema: NumberSchema<number | null>) =>
    isEnabled ? schema.required() : schema,
  );
const maxPriceSchema = number()
  .label('Max Price')
  .moreThan(ref(MarketplaceDataFields.MinPrice), ({ label }) => `${label} should be more than Min Price`)
  .max(5000)
  .nullable()
  .default(null)
  .when(MarketplaceDataFields.IsPhysicalEnabled, (isEnabled: boolean, schema: NumberSchema<number | null>) =>
    isEnabled ? schema.required() : schema,
  );
const giftCardPriceSchema = number()
  .label('Gift Card Price')
  .min(0)
  .max(5000)
  .nullable()
  .default(null)
  .when(MarketplaceDataFields.IsGiftCardEnabled, (isEnabled: boolean, schema: NumberSchema<number | null>) =>
    isEnabled ? schema.required() : schema,
  );
const donationPriceSchema = number()
  .label('Donation Price')
  .min(0)
  .max(5000)
  .nullable()
  .default(null)
  .when(MarketplaceDataFields.IsDonationEnabled, (isEnabled: boolean, schema: NumberSchema<number | null>) =>
    isEnabled ? schema.required() : schema,
  );
const restrictedTypeIdsSchema = array()
  .label('Product Types')
  .default([])
  .max(Object.values(ProductTypes).length / 2 - 1);
const restrictedBrandIdsSchema = array().default([]);
const restrictedMerchantIdsSchema = array().default([]);

const defaultGiftSchema = array().nullable().default(null);
const overrideDefaultGiftsSchema = boolean()
  .default(true)
  .when(DefaultGiftsDataFields.DefaultGifts, (defaultGifts: TProspectingDefaultGift[] | null, schema: BooleanSchema) =>
    !defaultGifts || defaultGifts?.filter(Boolean)?.length === 0 ? schema.oneOf([true]) : schema,
  );

const acceptSchema = boolean().oneOf([true]).default(true);
const exchangeSchema = boolean().default(true);
const donateSchema = boolean().default(true);
const expireInSecondsSchema = number().label('Total Days').nullable().default(GiftExpireOption['60']).required();

const capturePhoneSchema = boolean().default(false);
const captureEmailSchema = boolean().default(false);
const captureDateSchema = boolean().default(true);
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
const overrideRecipientActionsSchema = boolean().default(true);

const customMarketplaceIdSchema = number().label('Custom marketplace').nullable().default(null).required();

const marketplaceDataSchema = object()
  .shape(
    {
      [MarketplaceDataFields.MinPrice]: minPriceSchema,
      [MarketplaceDataFields.MaxPrice]: maxPriceSchema,
      [MarketplaceDataFields.GiftCardPrice]: giftCardPriceSchema,
      [MarketplaceDataFields.DonationPrice]: donationPriceSchema,
      [MarketplaceDataFields.RestrictedTypeIds]: restrictedTypeIdsSchema,
      [MarketplaceDataFields.RestrictedBrandIds]: restrictedBrandIdsSchema,
      [MarketplaceDataFields.RestrictedMerchantIds]: restrictedMerchantIdsSchema,

      [MarketplaceDataFields.IsPhysicalEnabled]: isPhysicalEnabledSchema,
      [MarketplaceDataFields.IsDonationEnabled]: isDonationEnabledSchema,
      [MarketplaceDataFields.IsGiftCardEnabled]: isGiftCardEnabledSchema,
    },
    [[MarketplaceDataFields.MaxPrice, MarketplaceDataFields.MinPrice]],
  )
  .nullable();

const defaultGiftDataSchema = object().shape({
  [DefaultGiftsDataFields.DefaultGifts]: defaultGiftSchema,
  [DefaultGiftsDataFields.Override]: overrideDefaultGiftsSchema,
});

const giftActionsDataSchema = object().shape({
  [GiftActionsDataFields.Accept]: acceptSchema,
  [GiftActionsDataFields.Exchange]: exchangeSchema,
  [GiftActionsDataFields.Donate]: donateSchema,
  [GiftActionsDataFields.ExpireInSeconds]: expireInSecondsSchema,
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
  [RecipientActionsDataFields.Override]: overrideRecipientActionsSchema,
});

const customMarketplaceDataSchema = object()
  .shape({
    [CustomMarketplaceDataFields.MarketplaceId]: customMarketplaceIdSchema,
  })
  .nullable()
  .default(null);

export const giftingFormSchema = object().shape({
  [GiftingStepFields.MarketplaceData]: marketplaceDataSchema,
  [GiftingStepFields.DefaultGiftsData]: defaultGiftDataSchema,
  [GiftingStepFields.GiftActionsData]: giftActionsDataSchema,
  [GiftingStepFields.RecipientActionsData]: recipientActionsDataSchema,
  [GiftingStepFields.CustomMarketplaceData]: customMarketplaceDataSchema,
});

export const giftingFormResolver = yupResolver(giftingFormSchema);
export const giftingFormDefaultValues = giftingFormSchema.getDefault() as TProspectingGiftingForm;
