import { compose, prop } from 'ramda';
import { EntityId } from '@alycecom/utils';
import { createSelector } from 'reselect';
import { CommonData, TCountry } from '@alycecom/modules';

import { IRootState } from '../../../../../store/root.types';

import { customMarketplacesAdapter, ICustomMarketplacesState } from './customMarketplaces.reducer';

const getCustomMarketplacesState = (state: IRootState): ICustomMarketplacesState =>
  state.marketplace.entities.customMarketplaces;

const selectors = customMarketplacesAdapter.getSelectors(getCustomMarketplacesState);

export const getIsLoading = compose(prop('isLoading'), getCustomMarketplacesState);
export const getIsLoaded = compose(prop('isLoaded'), getCustomMarketplacesState);
export const getCustomMarketplacesIds = selectors.getIds;
export const getCustomMarketplacesMap = selectors.getEntities;
export const getCustomMarketplaces = selectors.getAll;
export const makeGetCustomMarketplaceById = selectors.getById;

export const makeGetCustomMarketplaceCountries = (id: EntityId | null) => (state: IRootState): TCountry[] => {
  if (!id) {
    return [];
  }
  const marketplace = makeGetCustomMarketplaceById(id)(state);
  return marketplace?.countryIds ? CommonData.selectors.makeGetCountriesByIds(marketplace.countryIds)(state) : [];
};

export const makeGetMarketplacesIdsByTeamId = (teamId: EntityId): ((state: IRootState) => EntityId[]) =>
  createSelector(getCustomMarketplaces, marketplaces =>
    marketplaces.filter(marketplace => marketplace.teamIds.includes(teamId)).map(prop('id')),
  );
