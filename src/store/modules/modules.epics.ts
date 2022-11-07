import {
  CampaignSettings,
  Currencies,
  CurrencyConverter,
  Features,
  GiftingOnTheFly,
  User,
  Messaging,
  ProductsCount,
  Marketplace,
  GiftEmailPreview,
  Users,
  Teams,
} from '@alycecom/modules';

export default [
  ...GiftingOnTheFly.epics,
  ...Features.epics,
  ...CurrencyConverter.epics,
  ...Currencies.epics,
  ...CampaignSettings.epics,
  ...User.epics,
  ...Messaging.epics,
  ...ProductsCount.epics,
  ...Marketplace.epics,
  ...GiftEmailPreview.epics,
  ...Users.epics,
  ...Teams.epics,
];
