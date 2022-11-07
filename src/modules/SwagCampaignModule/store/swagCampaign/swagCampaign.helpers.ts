import { omit } from 'ramda';

import { SwagPhysicalCardColors, TSwagDraftCampaign, TSwagDraftCampaignResponse } from './swagCampaign.types';

const defaultExchangeMarketplaceSettings = {
  minBudgetAmount: null,
  maxBudgetAmount: null,
  giftCardMaxBudget: null,
  donationMaxBudget: null,
  restrictedGiftTypeIds: [],
  restrictedBrandIds: [],
  restrictedMerchantIds: [],
};

// TODO: Remove this transformer after backend part will be changed.
export const transformSwagCampaignResponse = (data: TSwagDraftCampaignResponse): TSwagDraftCampaign => {
  const {
    id,
    details,
    exchangeMarketplaceSettings,
    giftActions,
    giftExchangeOption,
    defaultGift,
    customMarketplace,
    messaging,
    recipientActions,
    cardOrder,
    cardDesign,
  } = data;

  const hasGifting = Boolean(exchangeMarketplaceSettings || customMarketplace);

  return {
    id,
    details,
    gifting: hasGifting
      ? {
          option: giftExchangeOption,
          exchangeMarketplaceSettings: exchangeMarketplaceSettings ?? defaultExchangeMarketplaceSettings,
          customMarketplaceData: customMarketplace ?? { id: null },
          defaultGiftData: { defaultGift },
          giftActionsData: giftActions ?? { accept: true, exchange: true, donate: false },
          recipientActionsData: { recipientActions },
        }
      : null,
    messaging: messaging ? { messageData: messaging } : null,
    codes: cardOrder
      ? {
          cardOrder,
          cardDesign: cardDesign
            ? {
                ...omit(
                  [
                    SwagPhysicalCardColors.CardCmykColorC,
                    SwagPhysicalCardColors.CardCmykColorM,
                    SwagPhysicalCardColors.CardCmykColorY,
                    SwagPhysicalCardColors.CardCmykColorK,
                  ],
                  cardDesign,
                ),
                cardCmykColor: {
                  c: +cardDesign.cardCmykColorC,
                  m: +cardDesign.cardCmykColorM,
                  y: +cardDesign.cardCmykColorY,
                  k: +cardDesign.cardCmykColorK,
                },
                file: `${cardDesign.cardLogo}`,
              }
            : null,
        }
      : null,
  };
};
