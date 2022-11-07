import { IPriceAvailability } from '../../MarketplaceModule/store/priceAvailability/priceAvailability.types';

export interface ICampaignBudgetTitleParams {
  budget: {
    giftMinPrice: number;
    giftMaxPrice: number;
    giftCardPrice: number;
    giftDonationPrice: number;
  };
  isInternational: boolean;
  currencySign?: string;
}

// TODO: Get rid this function after old activate code become deleted.
export const getCampaignBudgetTitle = ({
  budget,
  isInternational,
  currencySign = '$',
}: ICampaignBudgetTitleParams): string => {
  const minPrice = `${currencySign}${budget.giftMinPrice}`;
  const cardPrice = `${currencySign}${budget.giftCardPrice}`;
  const donationPrice = `${currencySign}${budget.giftDonationPrice}`;
  const giftRange = !isInternational ? `Budget: ${minPrice} - ${budget.giftMaxPrice}; ` : '';
  return `${giftRange}Gift card: ${cardPrice}; Donation: ${donationPrice}`;
};

export const getCampaignSettingsBudgetTitle = ({
  budget,
  priceAvailability,
  currencySign = '$',
}: ICampaignBudgetTitleParams & { priceAvailability: IPriceAvailability }): string => {
  const prices = [];
  if (priceAvailability.isPhysicalAvailable) {
    prices.push(`Merchandise: ${currencySign}${budget.giftMinPrice} - ${budget.giftMaxPrice}`);
  }
  if (priceAvailability.isDigitalAvailable) {
    prices.push(`Gift cards: ${currencySign}${budget.giftCardPrice}`);
  }
  if (priceAvailability.isDonationAvailable) {
    prices.push(`Gift donation: ${currencySign}${budget.giftDonationPrice}`);
  }
  return prices.join('; ');
};
