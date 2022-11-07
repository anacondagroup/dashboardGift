import { object, number, NumberSchema } from 'yup';

import { IPriceAvailability } from '../../../../MarketplaceModule/store/priceAvailability/priceAvailability.types';

// TODO: Maybe need to make it nullable
const giftMinPriceRule = number()
  .label('The min amount')
  .when(['$priceAvailability'], {
    is: (priceAvailability: IPriceAvailability) => priceAvailability?.isPhysicalAvailable,
    then: number()
      .transform(value => (Number.isNaN(value) ? undefined : value))
      .required()
      .positive()
      .integer()
      .min(0)
      .max(5000),
  })
  .when('enterprise_max_price', (maxGiftAmount: number, schema: NumberSchema) =>
    maxGiftAmount > 0 ? schema.lessThan(maxGiftAmount, 'The min price should be less than max price') : schema,
  );

const giftMaxPriceRule = number()
  .label('The max amount')
  .when(['$priceAvailability'], {
    is: (priceAvailability: IPriceAvailability) => priceAvailability?.isPhysicalAvailable,
    then: number()
      .transform(value => (Number.isNaN(value) ? undefined : value))
      .required()
      .positive()
      .integer()
      .min(1)
      .max(5000),
  })
  .when('enterprise_min_price', (minGiftAmount: number, schema: NumberSchema) =>
    minGiftAmount > 0 ? schema.moreThan(minGiftAmount, 'The max price should be more than min price') : schema,
  );

const giftCardPriceRule = number()
  .label('The gift card price')
  .when(['$priceAvailability'], {
    is: (priceAvailability: IPriceAvailability) => priceAvailability?.isDigitalAvailable,
    then: number()
      .transform(value => (Number.isNaN(value) ? undefined : value))
      .required()
      .positive()
      .integer()
      .min(0)
      .max(5000),
  });

const giftDonationPriceRule = number()
  .label('The donation amount')
  .when(['$priceAvailability'], {
    is: (priceAvailability: IPriceAvailability) => priceAvailability?.isDonationAvailable,
    then: number()
      .transform(value => (Number.isNaN(value) ? undefined : value))
      .required()
      .positive()
      .integer()
      .min(0)
      .max(5000),
  });

export const campaignBudgetValidationSchema = object().shape(
  {
    enterprise_min_price: giftMinPriceRule,
    enterprise_max_price: giftMaxPriceRule,
    enterprise_gift_card_price: giftCardPriceRule,
    enterprise_donation_price: giftDonationPriceRule,
  },
  [['enterprise_min_price', 'enterprise_max_price']],
);
