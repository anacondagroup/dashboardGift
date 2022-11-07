import { Epic, ofType as classicOfType, StateObservable } from 'redux-observable';
import { parse, stringify } from 'query-string';
import { EntityId, ofType, pickNotEmptyAndNil } from '@alycecom/utils';
import { debounceTime, filter, map, mergeMap, switchMap, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { applySpec, omit, without } from 'ramda';
import { combineLatest } from 'rxjs';
import { LOCATION_CHANGE, replace } from 'connected-react-router';
import { SORT_MOST_POPULAR } from '@alycecom/ui';

import { IRootState } from '../../../store/root.types';
import { MARKETPLACE_ROUTES } from '../routePaths';
import { getTeams } from '../../../store/teams/teams.selectors';

import { productsEpics } from './products/products.epics';
import { productDetailsEpics } from './productDetails/productDetails.epics';
import campaignSettingsEpics from './campaignSettings/campaignSettings.epics';
import customMarketplaceEpics from './customMarketplace/customMarketplace.epics';
import teamSettingsEpics from './teamSettings/teamSettings.epics';
import { entitiesEpics } from './entities';
import { fetchCampaignSettingsSuccess } from './campaignSettings/campaignSettings.actions';
import { fetchProductVendorsSuccess } from './entities/productVendors/productVendors.actions';
import {
  getCampaignDefaultBrandIds,
  getCampaignDefaultMerchantIds,
  getCampaignDefaultTypeIds,
  getCampaignMarketplaceId,
  getCampaignSettingsAsFilters,
  getCampaignTeamId,
  getCountryIds,
  getEnabledVendorsMap,
  getRestrictedTypeIds as getCampaignRestrictedTypeIds,
} from './campaignSettings/campaignSettings.selectors';
import {
  getBudgetFilters,
  getEntityIdsFilters,
  getGiftFilters,
  getPagination,
  getSearch,
  getSelectedGiftTypes,
  getSorting,
} from './products/products.selectors';
import { IFilters, ProductFilter } from './products/products.types';
import {
  loadProductsSuccess,
  setDefaultFilters,
  setFilters,
  setSearch,
  updateFilters,
} from './products/products.actions';
import { fetchProductTypesSuccess } from './entities/productTypes/productTypes.actions';
import { getVendorsMap } from './entities/productVendors/productVendors.selectors';
import { parseParams, reduceFilters } from './marketplace.helpers';
import {
  fetchCustomMarketplaceSuccess,
  updateCustomMarketplaceSuccess,
} from './customMarketplace/customMarketplace.actions';
import {
  getCustomMarketplaceAsFilters,
  getCustomMarketplaceCountryIds,
  getCustomMarketplaceTeamIds,
  getDefaultTypeIds,
  getRestrictedTypeIds,
} from './customMarketplace/customMarketplace.selectors';
import { getIsCustomMarketplaceSettingsDiffWithFilters } from './marketplace.selectors';
import priceAvailabilityEpics from './priceAvailability/priceAvailability.epics';
import { DEFAULT_DONATION_PRICE, DEFAULT_GIFT_CARD_PRICE } from './marketplace.constants';

export const initCampaignMarketplaceEpic: Epic = (action$, state$) =>
  action$.pipe(classicOfType(LOCATION_CHANGE), take(1)).pipe(
    filter(() => MARKETPLACE_ROUTES.matchCampaignPath(window.location.pathname) !== null),
    mergeMap(() =>
      combineLatest(
        action$.pipe(ofType(fetchCampaignSettingsSuccess)),
        action$.pipe(ofType(fetchProductVendorsSuccess)),
        action$.pipe(ofType(fetchProductTypesSuccess)),
      )
        .pipe(take(1))
        .pipe(
          withLatestFrom(state$),
          mergeMap(([, state]) => {
            const vendors = getEnabledVendorsMap(state);
            const restrictedTypeIds = getCampaignRestrictedTypeIds(state);
            const [params, filters] = parseParams(vendors);
            const actions = [setSearch(params.search || '')];

            const filtersToUpdate = reduceFilters(filters);

            if (filtersToUpdate[ProductFilter.TypeIds]?.length && restrictedTypeIds.length) {
              filtersToUpdate[ProductFilter.TypeIds] = without(
                restrictedTypeIds,
                filtersToUpdate[ProductFilter.TypeIds] as EntityId[],
              );
            }

            return [...actions, updateFilters(filtersToUpdate)];
          }),
        ),
    ),
  );

export const initDefaultMarketplaceEpic: Epic = (action$, state$) =>
  action$.pipe(classicOfType(LOCATION_CHANGE)).pipe(
    filter(() => MARKETPLACE_ROUTES.matchSharedPath(window.location.pathname) !== null),
    switchMap(() =>
      combineLatest(
        action$.pipe(ofType(fetchProductTypesSuccess)),
        action$.pipe(ofType(fetchProductVendorsSuccess)),
      ).pipe(
        take(1),
        withLatestFrom(state$),
        mergeMap(([, state]) => {
          const vendors = getVendorsMap(state);
          const [params, filters] = parseParams(vendors);
          const teamIds = getTeams(state).map(team => team.id);

          return [
            setDefaultFilters({
              [ProductFilter.DonationPrice]: DEFAULT_DONATION_PRICE,
              [ProductFilter.GiftCardPrice]: DEFAULT_GIFT_CARD_PRICE,
              [ProductFilter.TeamIds]: teamIds,
            }),
            setFilters({
              ...filters,
            }),
            setSearch(params.search || ''),
          ];
        }),
        takeUntil(
          action$.pipe(
            classicOfType(LOCATION_CHANGE),
            filter(() => MARKETPLACE_ROUTES.matchSharedPath(window.location.pathname) === null),
          ),
        ),
      ),
    ),
  );

export const initCustomMarketplaceEpic: Epic = (action$, state$) =>
  action$.pipe(classicOfType(LOCATION_CHANGE), take(1)).pipe(
    filter(() => MARKETPLACE_ROUTES.matchCustomPath(window.location.pathname) !== null),
    mergeMap(() =>
      combineLatest(
        action$.pipe(ofType(fetchProductTypesSuccess)),
        action$.pipe(ofType(fetchProductVendorsSuccess)),
      ).pipe(
        take(1),
        withLatestFrom(state$),
        mergeMap(([, state]) => {
          const vendors = getVendorsMap(state);
          const [params, filters] = parseParams(vendors);

          const actions = [];
          const filtersToUpdate = pickNotEmptyAndNil(
            omit(
              [
                ProductFilter.MinPrice,
                ProductFilter.MaxPrice,
                ProductFilter.DonationPrice,
                ProductFilter.GiftCardPrice,
                ProductFilter.CountryIds,
              ],
              filters,
            ),
          ) as Partial<IFilters>;

          if (params.search) {
            actions.push(setSearch(params.search));
          }

          if (Object.keys(filtersToUpdate).length) {
            if (filtersToUpdate[ProductFilter.TypeIds]) {
              filtersToUpdate[ProductFilter.TypeIds] = without(
                getRestrictedTypeIds(state),
                filtersToUpdate[ProductFilter.TypeIds] as EntityId[],
              );
            }

            actions.push(updateFilters(filtersToUpdate));
          }

          return actions;
        }),
      ),
    ),
  );

export const applyCampaignSettingsToFiltersEpic: Epic = (action$, state$: StateObservable<IRootState>) =>
  combineLatest(
    action$.pipe(ofType(fetchCampaignSettingsSuccess)),
    action$.pipe(ofType(fetchProductVendorsSuccess)),
  ).pipe(
    filter(() => MARKETPLACE_ROUTES.matchAnyMarketplacePath(window.location.pathname) !== null),
    withLatestFrom(state$),
    mergeMap(([, state]) => {
      const settingFilters = getCampaignSettingsAsFilters(state);
      const defaultTypeIds = getCampaignDefaultTypeIds(state);
      const defaultMerchantIds = getCampaignDefaultMerchantIds(state);
      const defaultBrandIds = getCampaignDefaultBrandIds(state);
      const customMarketplaceId = getCampaignMarketplaceId(state);
      const countryIds = getCountryIds(state);
      const teamId = getCampaignTeamId(state);

      const filters = getGiftFilters(state);

      return [
        setDefaultFilters({
          [ProductFilter.DonationPrice]: DEFAULT_DONATION_PRICE,
          [ProductFilter.GiftCardPrice]: DEFAULT_GIFT_CARD_PRICE,
          [ProductFilter.TypeIds]: defaultTypeIds,
          [ProductFilter.BrandIds]: defaultBrandIds,
          [ProductFilter.MerchantIds]: defaultMerchantIds,
          [ProductFilter.CountryIds]: countryIds,
          [ProductFilter.MarketplaceId]: customMarketplaceId ?? undefined,
          [ProductFilter.TeamIds]: teamId ? [teamId] : [],
        }),
        updateFilters({
          ...settingFilters,
          ...reduceFilters(filters),
        }),
      ];
    }),
  );

export const applyCustomMarketplaceSettingsToFiltersEpic: Epic = (action$, state$) =>
  combineLatest(
    action$.pipe(ofType(fetchCustomMarketplaceSuccess)),
    action$.pipe(ofType(fetchProductTypesSuccess)),
  ).pipe(
    filter(() => MARKETPLACE_ROUTES.matchAnyMarketplacePath(window.location.pathname) !== null),
    withLatestFrom(state$),
    mergeMap(([, state]) => {
      const actions = [
        setDefaultFilters({
          [ProductFilter.TypeIds]: getDefaultTypeIds(state),
          [ProductFilter.TeamIds]: getCustomMarketplaceTeamIds(state),
          [ProductFilter.CountryIds]: getCustomMarketplaceCountryIds(state),
        }),
      ];

      if (getIsCustomMarketplaceSettingsDiffWithFilters(state)) {
        actions.push(
          updateFilters({
            ...getCustomMarketplaceAsFilters(state),
            [ProductFilter.TypeIds]: without(getRestrictedTypeIds(state), getSelectedGiftTypes(state)),
          }),
        );
      }

      return actions;
    }),
  );

export const applyCustomMarketplaceSettingsWhenUpdatedToFiltersEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(updateCustomMarketplaceSuccess),
    withLatestFrom(state$),
    filter(([, state]) => getIsCustomMarketplaceSettingsDiffWithFilters(state)),
    mergeMap(([, state]) => [
      updateFilters({
        ...getCustomMarketplaceAsFilters(state),
        [ProductFilter.TypeIds]: without(getRestrictedTypeIds(state), getSelectedGiftTypes(state)),
      }),
      setDefaultFilters({
        [ProductFilter.TypeIds]: getDefaultTypeIds(state),
        [ProductFilter.TeamIds]: getCustomMarketplaceTeamIds(state),
      }),
    ]),
  );

export const syncFilterToUrlQueryEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(loadProductsSuccess),
    filter(() => MARKETPLACE_ROUTES.matchAnyMarketplacePath(window.location.pathname) !== null),
    debounceTime(300),
    withLatestFrom(state$),
    map(([, state]) => {
      const {
        search,
        sorting: {
          value: { column: orderColumn, order: orderDirection },
        },
        pagination: { currentPage: page },
        budget,
        entityIds,
      } = applySpec({
        search: getSearch,
        sorting: getSorting,
        pagination: getPagination,
        budget: getBudgetFilters,
        entityIds: getEntityIdsFilters,
      })(state);
      const currentParams = parse(window.location.search);
      const queryString = stringify(
        pickNotEmptyAndNil({
          ...currentParams,
          ...budget,
          ...entityIds,
          page: page === 1 ? undefined : page,
          orderColumn: SORT_MOST_POPULAR.value.column === orderColumn ? undefined : orderColumn,
          orderDirection: SORT_MOST_POPULAR.value.order === orderDirection ? undefined : orderDirection,
          search,
        }),
        { arrayFormat: 'comma' },
      );
      return replace({
        search: queryString,
      });
    }),
  );

export default [
  ...entitiesEpics,
  ...productsEpics,
  ...productDetailsEpics,
  ...campaignSettingsEpics,
  ...customMarketplaceEpics,
  ...teamSettingsEpics,
  ...priceAvailabilityEpics,
  applyCampaignSettingsToFiltersEpic,
  initCampaignMarketplaceEpic,
  initDefaultMarketplaceEpic,
  syncFilterToUrlQueryEpic,
  initCustomMarketplaceEpic,
  applyCustomMarketplaceSettingsToFiltersEpic,
  applyCustomMarketplaceSettingsWhenUpdatedToFiltersEpic,
];
