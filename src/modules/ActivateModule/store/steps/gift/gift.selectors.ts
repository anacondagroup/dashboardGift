import { pipe, union, without, filter, map, prop, propEq } from 'ramda';
import { createSelector } from 'reselect';
import { EntityId, StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../store/root.types';
import { RecipientActions } from '../../activate.types';
import { GiftExchangeOptions } from '../../../constants/exchange.constants';
import {
  getIsGiftCardsBlockedByTeam,
  getIsDonationsBlockedByTeam,
  getGiftTypesIdsRestrictedByTeam,
  getGiftTypeIdsUnavailableForCountries,
  getIsGiftCardsAvailable,
  getIsDonationsAvailable,
  getGiftTypesIds,
} from '../../entities/giftTypes/giftTypes.selectors';
import { getIsGiftBudgetBlocked } from '../../entities/giftTypes/giftTypes.helpers';
import {
  getGiftVendors,
  getRestrictedByTeamBrandIds,
  getRestrictedByTeamMerchantIds,
} from '../../entities/giftVendors/giftVendors.selectors';
import { IGiftVendor, VendorTypes } from '../../entities/giftVendors/giftVendors.types';
import { GiftTypes } from '../../entities/giftTypes/giftTypes.types';

import { MarketplaceFormFields } from './gift.schemas';
import { RECIPIENT_ACTION_LABELS } from './gift.constants';

const getGiftStep = (state: IRootState) => state.activate.steps.gift;

export const getExchangeMarketplaceSettings = pipe(getGiftStep, state => state.data.exchangeMarketplaceSettings);
export const getGiftExchangeOptions = pipe(getGiftStep, state => state.data.giftExchangeOptions);
export const getDefaultGift = pipe(getGiftStep, state => state.data.defaultGift);
export const getFallbackGift = pipe(getGiftStep, state => state.data.fallbackGift);
export const getRecipientActions = pipe(getGiftStep, state => state.data.recipientActions);

export const getIsLoading = pipe(getGiftStep, state => state.status === StateStatus.Pending);
export const getIsLoaded = pipe(getGiftStep, state => state.status === StateStatus.Fulfilled);

export const getRestrictedGiftTypesIds = createSelector(
  getExchangeMarketplaceSettings,
  settings => settings?.restrictedGiftTypeIds || [],
);
export const getAvailableTypesIds = createSelector(
  getGiftTypesIds,
  getRestrictedGiftTypesIds,
  getGiftTypesIdsRestrictedByTeam,
  getGiftTypeIdsUnavailableForCountries,
  (typeIds, restrictedByMarketplaceIds, restrictedByTeamIds, restrictedByCountriesIds) =>
    pipe(without(restrictedByTeamIds), without(restrictedByCountriesIds), without(restrictedByMarketplaceIds))(typeIds),
);

export const getAvailableMerchantsIds = createSelector(
  getGiftVendors,
  getExchangeMarketplaceSettings,
  (vendors, settings) => {
    const { restrictedMerchantIds = [] } = settings || {};
    const getAvailableVendors: (vendors: IGiftVendor[]) => EntityId[] = pipe(
      filter(propEq('type', VendorTypes.merchant)) as (x0: IGiftVendor[]) => IGiftVendor[],
      map(prop('id')),
      without(restrictedMerchantIds),
    );
    return getAvailableVendors(vendors);
  },
);

export const getAvailableBrandsIds = createSelector(
  getGiftVendors,
  getExchangeMarketplaceSettings,
  (vendors, settings) => {
    const { restrictedBrandIds = [] } = settings || {};
    const getAvailableVendors: (vendors: IGiftVendor[]) => EntityId[] = pipe(
      filter(propEq('type', VendorTypes.brand)) as (x0: IGiftVendor[]) => IGiftVendor[],
      map(prop('id')),
      without(restrictedBrandIds),
    );
    return getAvailableVendors(vendors);
  },
);

export const getRestrictedVendorsAmount = createSelector(
  getExchangeMarketplaceSettings,
  getRestrictedByTeamBrandIds,
  getRestrictedByTeamMerchantIds,
  (settings, restrictedByTeamBrandIds, restrictedByTeamMerchantIds) => {
    const { restrictedBrandIds = [], restrictedMerchantIds = [] } = settings || {};
    return (
      union(restrictedBrandIds, restrictedByTeamBrandIds).length +
      union(restrictedMerchantIds, restrictedByTeamMerchantIds).length
    );
  },
);

export const getInitialExchangeMarketplaceSettings = createSelector(
  getIsGiftCardsBlockedByTeam,
  getIsGiftCardsAvailable,
  getIsDonationsBlockedByTeam,
  getIsDonationsAvailable,
  getGiftTypesIdsRestrictedByTeam,
  getGiftTypeIdsUnavailableForCountries,
  getExchangeMarketplaceSettings,
  getRestrictedByTeamBrandIds,
  getRestrictedByTeamMerchantIds,
  (
    isGiftCardsBlockedByTeam,
    isGiftCardsAvailable,
    isDonationsBlockedByTeam,
    isDonationsAvailable,
    restrictedByTeamGiftTypeIds,
    unavailableGiftTypeIds,
    settings,
    restrictedByTeamBrandIds,
    restrictedByTeamMerchantIds,
  ) => {
    const {
      minBudgetAmount,
      maxBudgetAmount,
      donationMaxBudget,
      giftCardMaxBudget,
      restrictedGiftTypeIds = [],
      restrictedBrandIds = [],
      restrictedMerchantIds = [],
    } = settings || {};
    const isGiftBudgetBlocked = getIsGiftBudgetBlocked(
      restrictedGiftTypeIds,
      restrictedByTeamGiftTypeIds,
      unavailableGiftTypeIds,
    );
    return {
      [MarketplaceFormFields.GiftTypes]: union(
        union(restrictedGiftTypeIds, restrictedByTeamGiftTypeIds),
        unavailableGiftTypeIds,
      ),
      [MarketplaceFormFields.AllowedVendors]: {
        restrictedBrandIds: union(restrictedBrandIds, restrictedByTeamBrandIds),
        restrictedMerchantIds: union(restrictedMerchantIds, restrictedByTeamMerchantIds),
      },
      [MarketplaceFormFields.MinBudgetPrice]: !isGiftBudgetBlocked ? minBudgetAmount : null,
      [MarketplaceFormFields.MaxBudgetPrice]: !isGiftBudgetBlocked ? maxBudgetAmount : null,
      [MarketplaceFormFields.MaxGiftCardPrice]:
        !isGiftCardsBlockedByTeam && isGiftCardsAvailable && !restrictedGiftTypeIds.includes(GiftTypes.giftCard)
          ? giftCardMaxBudget
          : null,
      [MarketplaceFormFields.DonationPrice]:
        !isDonationsBlockedByTeam && isDonationsAvailable && !restrictedGiftTypeIds.includes(GiftTypes.donation)
          ? donationMaxBudget
          : null,
    };
  },
);

export const getSelectedRecipientActions = createSelector(getRecipientActions, actions => {
  if (actions === null) {
    return '';
  }
  return (Object.keys(actions || []) as RecipientActions[])
    .reduce((acc, key) => {
      if (actions[key] && typeof actions[key] !== 'string') {
        acc.push(RECIPIENT_ACTION_LABELS[key]);
      }
      return acc;
    }, [] as string[])
    .join(', ');
});

export const getCustomMarketplaceSetting = pipe(getGiftStep, state => state.data.customMarketplace);
export const getDonationSetting = pipe(getGiftStep, state => state.data.donationSettings);
export const getSelectedCustomMarketplaceId = pipe(getCustomMarketplaceSetting, state => state?.id || null);

export const getIsExchangeMarketplaceSettingsValid = createSelector(
  getGiftExchangeOptions,
  getExchangeMarketplaceSettings,
  getSelectedCustomMarketplaceId,
  getDonationSetting,
  (giftExchangeOptionValue, marketplaceSettings, customMarketplaceId, donationSetting) =>
    (giftExchangeOptionValue === GiftExchangeOptions.campaignBudget && marketplaceSettings) ||
    (giftExchangeOptionValue === GiftExchangeOptions.customMarketplace && customMarketplaceId) ||
    giftExchangeOptionValue === GiftExchangeOptions.acceptOnly ||
    (giftExchangeOptionValue === GiftExchangeOptions.noExchange && donationSetting),
);
