import { equals, pipe, prop } from 'ramda';
import { StateStatus } from '@alycecom/utils';
import { createSelector } from 'reselect';

import { IRootState } from '../../../../../../store/root.types';

import { TGiftingState } from './gifting.reducer';
import { GiftingStepFields, MarketplaceDataFields, TProspectingGiftingForm } from './gifting.types';

const getGiftingState = (state: IRootState): TGiftingState => state.prospectingCampaign.steps.gifting;

export const getGiftingData = pipe(getGiftingState, prop('data'));
export const getGiftingErrors = pipe(getGiftingState, prop('errors'));

const getGiftingStatus = pipe(getGiftingState, prop('status'));
export const getIsGiftingIdle = pipe(getGiftingStatus, equals(StateStatus.Idle));
export const getIsGiftingPending = pipe(getGiftingStatus, equals(StateStatus.Pending));
export const getIsGiftingFulfilled = pipe(getGiftingStatus, equals(StateStatus.Fulfilled));

export const getGiftingDataAsFormValues = createSelector(
  getGiftingData,
  (giftingData): TProspectingGiftingForm | null => {
    if (!giftingData) {
      return null;
    }
    const marketplaceData = giftingData[GiftingStepFields.MarketplaceData];

    return {
      ...giftingData,
      [GiftingStepFields.MarketplaceData]: marketplaceData
        ? {
            ...marketplaceData,
            [MarketplaceDataFields.IsGiftCardEnabled]: marketplaceData[MarketplaceDataFields.GiftCardPrice] !== null,
            [MarketplaceDataFields.IsDonationEnabled]: marketplaceData[MarketplaceDataFields.DonationPrice] !== null,
            [MarketplaceDataFields.IsPhysicalEnabled]:
              marketplaceData[MarketplaceDataFields.MinPrice] !== null &&
              marketplaceData[MarketplaceDataFields.MaxPrice] !== null,
          }
        : null,
    };
  },
);
