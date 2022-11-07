import { equals, pipe, prop } from 'ramda';
import { StateStatus } from '@alycecom/utils';
import { createSelector } from 'reselect';

import { IRootState } from '../../../../../../store/root.types';

import { TGiftingState } from './gifting.reducer';
import { GiftingStepFields, MarketplaceDataFields, TSwagCampaignGiftingForm } from './gifting.types';

const getGiftingState = (state: IRootState): TGiftingState => state.swagCampaign.steps.gifting;

export const getGiftingData = pipe(getGiftingState, prop('data'));
export const getGiftingErrors = pipe(getGiftingState, prop('errors'));

const getGiftingStatus = pipe(getGiftingState, prop('status'));
export const getIsGiftingIdle = pipe(getGiftingStatus, equals(StateStatus.Idle));
export const getIsGiftingPending = pipe(getGiftingStatus, equals(StateStatus.Pending));
export const getIsGiftingFulfilled = pipe(getGiftingStatus, equals(StateStatus.Fulfilled));

export const getGiftingDataAsFormValues = createSelector(
  getGiftingData,
  (giftingData): TSwagCampaignGiftingForm | null => {
    if (!giftingData) {
      return null;
    }
    const marketplaceData = giftingData[GiftingStepFields.ExchangeMarketplaceSettings];
    const customMarketplaceData = giftingData[GiftingStepFields.CustomMarketPlaceData];
    const recipientActions = giftingData[GiftingStepFields.RecipientActionsData];
    return {
      ...giftingData,
      [GiftingStepFields.ExchangeMarketplaceSettings]: {
        ...marketplaceData,
        [MarketplaceDataFields.IsGiftCardEnabled]: marketplaceData[MarketplaceDataFields.GiftCardMaxBudget] !== null,
        // TODO: Need to fix donation functionality from BE side. Right now it doesn't work at all. We don't have donationMaxBudget field in the backend response.
        [MarketplaceDataFields.IsDonationEnabled]: !!marketplaceData[MarketplaceDataFields.DonationMaxBudget],
        [MarketplaceDataFields.IsPhysicalEnabled]:
          marketplaceData[MarketplaceDataFields.MinBudgetAmount] !== null &&
          marketplaceData[MarketplaceDataFields.MaxBudgetAmount] !== null,
      },
      [GiftingStepFields.CustomMarketPlaceData]: {
        ...customMarketplaceData,
      },
      [GiftingStepFields.RecipientActionsData]: recipientActions,
    };
  },
);
