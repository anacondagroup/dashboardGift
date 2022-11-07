import { pipe, prop, propEq } from 'ramda';
import { createSelector } from 'reselect';
import { EntityId, StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../store/root.types';

import { customMarketplacesAdapter, TCustomMarketplacesState } from './customMarketplaces.reducer';

const getCustomMarketplacesState = (state: IRootState): TCustomMarketplacesState =>
  state.activate.entities.customMarketplaces;

const selectors = customMarketplacesAdapter.getSelectors(getCustomMarketplacesState);

export const getIsLoading = pipe(getCustomMarketplacesState, propEq('status', StateStatus.Pending));
export const getIsLoaded = pipe(getCustomMarketplacesState, propEq('status', StateStatus.Fulfilled));
export const getIsIdle = pipe(getCustomMarketplacesState, propEq('status', StateStatus.Idle));
export const getCustomMarketplacesIds = selectors.getIds;
export const getCustomMarketplacesMap = selectors.getEntities;
export const getCustomMarketplaces = selectors.getAll;
export const getCustomMarketplaceById = selectors.getById;

export const makeGetMarketplacesIdsByTeamAndCountry = ({
  teamId,
  countryIds,
}: {
  teamId: EntityId;
  countryIds?: number[];
}): ((state: IRootState) => EntityId[]) =>
  createSelector(getCustomMarketplaces, marketplaces =>
    marketplaces
      .filter(
        marketplace =>
          marketplace.teamIds.includes(teamId) &&
          countryIds?.some(countryId => marketplace.countryIds.includes(countryId)),
      )
      .map(prop('id')),
  );
