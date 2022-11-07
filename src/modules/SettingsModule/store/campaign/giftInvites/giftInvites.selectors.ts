import { CommonData } from '@alycecom/modules';
import { pipe } from 'ramda';
import { createSelector } from 'reselect';

import { getCampaignSettingsState } from '../campaign.selectors';
import { ProductTypes } from '../../settings.types';

export const getCampaignGiftInvitesSettingsState = pipe(getCampaignSettingsState, state => state.giftInvites);

export const getCampaignGiftInvitesSettings = pipe(
  getCampaignGiftInvitesSettingsState,
  giftInvitesState => giftInvitesState.campaign,
);

export const getCampaignSettingsIsLoading = pipe(
  getCampaignGiftInvitesSettingsState,
  giftInvitesState => giftInvitesState.isLoading,
);

export const getCampaignSettingsErrors = pipe(
  getCampaignGiftInvitesSettingsState,
  giftInvitesState => giftInvitesState.errors,
);

export const getCampaignGiftCustomisationSettings = pipe(
  getCampaignGiftInvitesSettings,
  campaignSettings => campaignSettings?.customisation,
);

export const getGiftInvitesVendorsState = pipe(
  getCampaignGiftInvitesSettingsState,
  giftInvitesState => giftInvitesState.vendors,
);
export const getGiftInvitesVendors = pipe(
  getGiftInvitesVendorsState,
  campaignVendorsState => campaignVendorsState.giftVendors,
);
export const getGiftInvitesVendorsAvailableProductsCount = pipe(
  getGiftInvitesVendorsState,
  campaignVendorsState => campaignVendorsState.availableProductsCount,
);
export const getIsGiftInvitesVendorsLoading = pipe(
  getGiftInvitesVendorsState,
  campaignVendorsState => campaignVendorsState.isLoading,
);

export const getGiftInvitesTypesState = pipe(getCampaignGiftInvitesSettingsState, state => state.types);
export const getGiftInvitesTypes = pipe(getGiftInvitesTypesState, typesState => typesState.giftTypes);
export const getIsGiftInvitesTypesLoading = pipe(getGiftInvitesTypesState, typesState => typesState.isLoading);

export const getCountryIds = pipe(getCampaignGiftInvitesSettings, settings => settings?.countryIds || []);

export const getCampaignCurrencies = createSelector(
  getCountryIds,
  CommonData.selectors.getCommonCountriesMap,
  (countryIds, countries) => countryIds.map(id => countries[id]?.currency).filter(currency => Boolean(currency)),
);

export const getGiftTypesCount = createSelector(getGiftInvitesTypes, giftTypes => giftTypes.length);

export const getRestrictedGiftTypesCount = createSelector(
  getGiftInvitesTypes,
  giftTypes => giftTypes.filter(type => type.is_campaign_restricted || type.is_team_restricted).length,
);

export const getGiftTypesSelectedCount = createSelector(
  getGiftInvitesTypes,
  giftTypes => giftTypes.filter(type => !type.is_campaign_restricted && !type.is_team_restricted).length,
);

export const getIsDonationGiftTypeRestricted = createSelector(
  getGiftInvitesTypes,
  giftTypes => giftTypes.find(({ id }) => id === ProductTypes.donation)?.is_campaign_restricted ?? false,
);

export const getRestrictedGiftTypeIds = createSelector(getGiftInvitesTypes, giftTypes =>
  giftTypes.filter(type => type.is_campaign_restricted).map(type => type.id),
);

export const getIsAllGiftTypesNotRestricted = createSelector(getGiftInvitesTypes, giftTypes => {
  const permittedGiftTypes = giftTypes.filter(type => !type.is_team_restricted && type.countryIds.length > 0);
  return permittedGiftTypes.length > 0 && permittedGiftTypes.every(type => !type.is_campaign_restricted);
});

export const getIsAllGiftTypesRestricted = createSelector(getGiftInvitesTypes, giftTypes =>
  giftTypes.every(type => type.is_team_restricted || type.countryIds.length === 0),
);

export const getHasTeamOrCountryRestrictedGiftTypes = createSelector(getGiftInvitesTypes, giftTypes =>
  giftTypes.some(type => type.is_team_restricted || type.countryIds.length === 0),
);

export const getHasRestrictedGiftTypes = createSelector(
  getRestrictedGiftTypesCount,
  restrictedCount => restrictedCount > 0,
);
