import { pipe, prop, union } from 'ramda';
import { createSelector } from 'reselect';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../store/root.types';

import { giftTypesAdapter } from './giftTypes.reducer';
import { GiftTypes } from './giftTypes.types';

const getGiftTypesState = (state: IRootState) => state.activate.entities.giftTypes;

const selectors = giftTypesAdapter.getSelectors(getGiftTypesState);

export const getStatus = pipe(getGiftTypesState, prop('status'));
export const getIsGiftTypesLoading = pipe(getStatus, status => status === StateStatus.Pending);
export const getIsGiftTypesLoaded = pipe(getStatus, status => status === StateStatus.Fulfilled);
export const getGiftTypesIds = selectors.getIds;
export const getGiftTypesMap = selectors.getEntities;
export const getGiftTypes = selectors.getAll;

export const getGiftTypesIdsRestrictedByTeam = createSelector(getGiftTypes, items =>
  items.filter(item => item.isTeamRestricted).map(item => item.id),
);
export const getGiftTypeIdsUnavailableForCountries = createSelector(getGiftTypes, items =>
  items.filter(item => item.countryIds.length === 0).map(item => item.id),
);

export const getUnavailableTypes = createSelector(
  getGiftTypesIdsRestrictedByTeam,
  getGiftTypeIdsUnavailableForCountries,
  (typesRestrictedByTeam, typesRestrictedForCountries) => union(typesRestrictedByTeam, typesRestrictedForCountries),
);

export const getGiftCardGiftType = createSelector(getGiftTypesMap, entities => entities[GiftTypes.giftCard]);
export const getIsGiftCardsBlockedByTeam = createSelector(
  getGiftTypesMap,
  entities => entities[GiftTypes.giftCard]?.isTeamRestricted ?? false,
);
export const getIsGiftCardsAvailable = createSelector(
  getGiftTypesMap,
  entities => entities[GiftTypes.giftCard]?.countryIds?.length > 0,
);

export const getDonationGiftType = createSelector(getGiftTypesMap, entities => entities[GiftTypes.donation]);
export const getIsDonationsBlockedByTeam = createSelector(
  getGiftTypesMap,
  entities => entities[GiftTypes.donation]?.isTeamRestricted ?? false,
);
export const getIsDonationsAvailable = createSelector(
  getGiftTypesMap,
  entities => entities[GiftTypes.donation]?.countryIds?.length > 0,
);
