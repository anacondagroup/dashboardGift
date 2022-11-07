import { Epic } from 'redux-observable';
import { ofType, pickNotEmptyAndNil } from '@alycecom/utils';
import { catchError, debounceTime, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { handleError, handlers, IApiService, IResponse } from '@alycecom/services';
import qs from 'query-string';
import { applySpec } from 'ramda';
import { User } from '@alycecom/modules';

import { getDefaultFilters, getFilters, getSearch } from '../products/products.selectors';
import { IFilters, ProductFilter } from '../products/products.types';
import {
  trackCustomMarketplaceCreated,
  trackCustomMarketplaceFilterApplied,
  trackCustomMarketplaceSettingsChanged,
} from '../../events';
import { updateFilters } from '../products/products.actions';
import { MARKETPLACE_ROUTES } from '../../routePaths';

import {
  addAllProductsToMarketplace,
  addAllProductsToMarketplaceFail,
  addAllProductsToMarketplaceSuccess,
  addCustomMarketplaceProduct,
  addCustomMarketplaceProductFail,
  addCustomMarketplaceProductSuccess,
  createCustomMarketplace,
  createCustomMarketplaceFail,
  createCustomMarketplaceSuccess,
  fetchCustomMarketplaceById,
  fetchCustomMarketplaceFail,
  fetchCustomMarketplaceSuccess,
  removeAllProductsFromMarketplace,
  removeAllProductsFromMarketplaceSuccess,
  removeAllProductsFromToMarketplaceFail,
  removeCustomMarketplaceProduct,
  removeCustomMarketplaceProductFail,
  removeCustomMarketplaceProductSuccess,
  updateCustomMarketplace,
  updateCustomMarketplaceFail,
  updateCustomMarketplaceSuccess,
} from './customMarketplace.actions';
import { TCustomMarketplace } from './customMarketplace.types';
import {
  getCustomMarketplaceName,
  getMarketplaceId,
  getPendingAddProductIds,
  getPendingRemoveProductIds,
} from './customMarketplace.selectors';

const fetchCustomMarketplace = (apiService: IApiService, id: number) =>
  apiService.get(`/api/v1/marketplace/custom/${id}`, {}, true).pipe(
    map(response => fetchCustomMarketplaceSuccess(((response as unknown) as IResponse<TCustomMarketplace>).data)),
    catchError(handleError(handlers.handleAnyError(fetchCustomMarketplaceFail))),
  );

const createCustomMarketplaceEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(createCustomMarketplace),
    switchMap(({ payload }) =>
      apiService.post('/api/v1/marketplace/custom', { body: payload }, true).pipe(
        map((response: { data: TCustomMarketplace }) => createCustomMarketplaceSuccess(response.data)),
        catchError(handleError(handlers.handleAnyError(createCustomMarketplaceFail))),
      ),
    ),
  );

const fetchCustomMarketplaceEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(fetchCustomMarketplaceById),
    switchMap(({ payload }) => fetchCustomMarketplace(apiService, payload)),
  );

const updateCustomMarketplaceEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(updateCustomMarketplace),
    withLatestFrom(state$),
    switchMap(([{ payload: { id, ...body } }, state]) =>
      apiService.put(`/api/v1/marketplace/custom/${id}`, { body }, true).pipe(
        mergeMap((response: { data: TCustomMarketplace }) => [
          updateCustomMarketplaceSuccess(response.data),
          showGlobalMessage({
            icon: 'heart',
            type: 'success',
            text: `Changes to ${getCustomMarketplaceName(state)} have been saved.`,
          }),
        ]),
        catchError(handleError(handlers.handleAnyError(updateCustomMarketplaceFail))),
      ),
    ),
  );

const addAllProductsEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(addAllProductsToMarketplace),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const defaultFilters = getDefaultFilters(state);
      const userFilters = getFilters(state);
      const id = getMarketplaceId(state);
      const search = getSearch(state);
      const filters = {
        ...defaultFilters,
        ...pickNotEmptyAndNil<IFilters, Partial<IFilters>>({ ...userFilters }),
        search,
      };

      return apiService
        .put(
          `/api/v1/marketplace/custom/${id}/products?${qs.stringify(filters, {
            arrayFormat: 'comma',
            skipNull: true,
            skipEmptyString: true,
          })}`,
          {},
          true,
        )
        .pipe(
          mergeMap(() => [
            addAllProductsToMarketplaceSuccess(),
            showGlobalMessage({
              icon: 'heart',
              type: 'success',
              text: `Changes to ${getCustomMarketplaceName(state)} have been saved.`,
            }),
          ]),
          catchError(handleError(handlers.handleAnyError(addAllProductsToMarketplaceFail))),
        );
    }),
  );

const removeAllProductsEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(removeAllProductsFromMarketplace),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const defaultFilters = getDefaultFilters(state);
      const userFilters = getFilters(state);
      const id = getMarketplaceId(state);
      const search = getSearch(state);
      const filters = {
        ...defaultFilters,
        ...pickNotEmptyAndNil<IFilters, Partial<IFilters>>(userFilters),
        search,
      };

      return apiService
        .delete(
          `/api/v1/marketplace/custom/${id}/products?${qs.stringify(filters, {
            arrayFormat: 'comma',
            skipNull: true,
            skipEmptyString: true,
          })}`,
          {},
          true,
        )
        .pipe(
          mergeMap(() => [
            removeAllProductsFromMarketplaceSuccess(),
            showGlobalMessage({
              icon: 'heart',
              type: 'success',
              text: `Changes to ${getCustomMarketplaceName(state)} have been saved.`,
            }),
          ]),
          catchError(handleError(handlers.handleAnyError(removeAllProductsFromToMarketplaceFail))),
        );
    }),
  );

const reFetchOnBulkSuccessEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(...[addAllProductsToMarketplaceSuccess, removeAllProductsFromMarketplaceSuccess]),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const id = getMarketplaceId(state);

      return fetchCustomMarketplace(apiService, id as number);
    }),
  );

const addCustomMarketplaceProductEpic: Epic = (action$, state$, { apiService, messagesService }) =>
  action$.pipe(
    ofType(addCustomMarketplaceProduct),
    debounceTime(1000),
    withLatestFrom(
      state$.pipe(
        map(
          applySpec({
            marketplaceId: getMarketplaceId,
            pendingAddIds: getPendingAddProductIds,
          }),
        ),
      ),
    ),
    switchMap(([, { marketplaceId, pendingAddIds }]) =>
      apiService
        .put(`/api/v1/marketplace/custom/${marketplaceId}/products?products=${pendingAddIds.join(',')}`, {}, true)
        .pipe(
          mergeMap(() => [
            addCustomMarketplaceProductSuccess({ addedProductIds: pendingAddIds, updatedAt: new Date().toISOString() }),
            messagesService.showGlobalMessage({
              type: 'success',
              text: `${pendingAddIds.length} product${pendingAddIds.length > 1 ? 's' : ''} added`,
            }),
          ]),
          catchError(
            handleError(
              handlers.handleAnyError(addCustomMarketplaceProductFail({ rejectedProductIds: pendingAddIds })),
            ),
          ),
        ),
    ),
  );

const removeCustomMarketplaceProductEpic: Epic = (action$, state$, { apiService, messagesService }) =>
  action$.pipe(
    ofType(removeCustomMarketplaceProduct),
    debounceTime(1000),
    withLatestFrom(
      state$.pipe(
        map(
          applySpec({
            marketplaceId: getMarketplaceId,
            pendingRemoveIds: getPendingRemoveProductIds,
          }),
        ),
      ),
    ),
    switchMap(([, { marketplaceId, pendingRemoveIds }]) =>
      apiService
        .delete(`/api/v1/marketplace/custom/${marketplaceId}/products?products=${pendingRemoveIds.join(',')}`, {}, true)
        .pipe(
          mergeMap(() => [
            removeCustomMarketplaceProductSuccess({
              removedProductIds: pendingRemoveIds,
              updatedAt: new Date().toISOString(),
            }),
            messagesService.showGlobalMessage({
              type: 'success',
              text: `${pendingRemoveIds.length} product${pendingRemoveIds.length > 1 ? 's' : ''} removed`,
            }),
          ]),
          catchError(
            handleError(
              handlers.handleAnyError(removeCustomMarketplaceProductFail({ rejectedProductIds: pendingRemoveIds })),
            ),
          ),
        ),
    ),
  );

const trackCreatedCustomMarketplaceEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(createCustomMarketplaceSuccess),
    withLatestFrom(state$),
    map(([{ payload }, state]) => {
      const [eventPayload, options] = User.selectors.getBaseEventPayload(state);

      return trackCustomMarketplaceCreated(
        {
          ...eventPayload,
          minPrice: payload.minPrice,
          maxPrice: payload.maxPrice,
          giftCardPrice: payload.giftCardPrice,
          donationPrice: payload.donationPrice,
          marketplaceId: payload.id,
          countryIds: payload.countryIds,
          teamIds: payload.teamIds,
        },
        options,
      );
    }),
  );

const trackUpdatedCustomMarketplaceEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(updateCustomMarketplaceSuccess),
    withLatestFrom(state$),
    map(([{ payload }, state]) => {
      const [eventPayload, options] = User.selectors.getBaseEventPayload(state);

      return trackCustomMarketplaceSettingsChanged(
        {
          ...eventPayload,
          minPrice: payload.minPrice,
          maxPrice: payload.maxPrice,
          giftCardPrice: payload.giftCardPrice,
          donationPrice: payload.donationPrice,
          marketplaceId: payload.id,
          countryIds: payload.countryIds,
          teamIds: payload.teamIds,
        },
        options,
      );
    }),
  );

const trackFiltersAppliedEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(updateFilters),
    filter(() => MARKETPLACE_ROUTES.matchCustomPath(window.location.pathname) !== null),
    withLatestFrom(state$),
    mergeMap(([{ payload: filters }, state]) => {
      const events = [];
      const marketplaceId = getMarketplaceId(state);
      if (!marketplaceId) {
        return [];
      }
      const [payload, options] = User.selectors.getBaseEventPayload(state);

      if ((filters[ProductFilter.TypeIds]?.length ?? 0) !== 0) {
        events.push(
          trackCustomMarketplaceFilterApplied(
            {
              ...payload,
              marketplaceId,
              name: 'productTypes',
            },
            options,
          ),
        );
      }

      if ((filters[ProductFilter.Vendors]?.length ?? 0) !== 0) {
        events.push(
          trackCustomMarketplaceFilterApplied(
            {
              ...payload,
              marketplaceId,
              name: 'productVendors',
            },
            options,
          ),
        );
      }

      if ((filters[ProductFilter.CategoryIds]?.length ?? 0) !== 0) {
        events.push(
          trackCustomMarketplaceFilterApplied(
            {
              ...payload,
              marketplaceId,
              name: 'interests',
            },
            options,
          ),
        );
      }

      return events;
    }),
  );

export default [
  createCustomMarketplaceEpic,
  fetchCustomMarketplaceEpic,
  updateCustomMarketplaceEpic,
  addCustomMarketplaceProductEpic,
  removeCustomMarketplaceProductEpic,
  addAllProductsEpic,
  removeAllProductsEpic,
  reFetchOnBulkSuccessEpic,
  trackCreatedCustomMarketplaceEpic,
  trackUpdatedCustomMarketplaceEpic,
  trackFiltersAppliedEpic,
];
