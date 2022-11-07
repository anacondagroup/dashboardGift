import { Epic } from 'redux-observable';
import { catchError, debounceTime, map, mergeMap, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { ofType, pickNotEmptyAndNil, queryParamsBuilder } from '@alycecom/utils';
import { handleError, handlers, MessageType } from '@alycecom/services';

import { MARKETPLACE_ROUTES } from '../../routePaths';
import { MarketplaceMode } from '../../types';

import {
  exportProductsFail,
  exportProductsRequest,
  exportProductsSuccess,
  loadProductsFail,
  loadProductsSuccess,
  resetProducts,
  setFilters,
  setLoading,
  setPage,
  setSearch,
  setSorting,
  updateFilters,
} from './products.actions';
import { getDefaultFilters, getFilters, getPagination, getSearch, getSorting } from './products.selectors';
import { IFilters, IProductsResponse, ISort, ProductFilter } from './products.types';

const getPreviewMarketplaceId = (): string => {
  const match = MARKETPLACE_ROUTES.matchCustomPath(window.location.pathname);

  return match !== null && (match.params.mode === MarketplaceMode.Preview || !match.params.mode)
    ? match.params.marketplaceId
    : '';
};

const getMarketplaceProductsUrl = ({
  page,
  search,
  sort,
  filters,
  marketplaceId,
  isExport = false,
}: {
  page: number;
  search: string;
  sort: ISort;
  filters: IFilters;
  marketplaceId: string;
  isExport?: boolean;
}) => {
  const requestParams = {
    page,
    search,
    orderColumn: sort.value.column,
    orderDirection: sort.value.order,
    minPrice: filters[ProductFilter.MinPrice],
    maxPrice: filters[ProductFilter.MaxPrice],
    donationPrice: filters[ProductFilter.DonationPrice],
    giftCardPrice: filters[ProductFilter.GiftCardPrice],
    categories: filters[ProductFilter.CategoryIds]?.join(','),
    countries: filters[ProductFilter.CountryIds]?.join(','),
    types: filters[ProductFilter.TypeIds]?.join(','),
    brands: filters[ProductFilter.BrandIds]?.join(','),
    merchants: filters[ProductFilter.MerchantIds]?.join(','),
    teamIds: filters[ProductFilter.TeamIds]?.join(','),
    customMarketplaceId: marketplaceId || filters[ProductFilter.MarketplaceId],
    [ProductFilter.HiddenProductIds]: filters[ProductFilter.HiddenProductIds]?.join(','),
  };
  return `/api/v1/marketplace/products${isExport ? '/export' : ''}?${queryParamsBuilder(requestParams)}`;
};

export const initLoadingEpic: Epic = action$ =>
  action$.pipe(
    ofType(setLoading),
    map(() => resetProducts()),
  );

export const filterProductsEpic: Epic = action$ =>
  action$.pipe(
    ofType(...[setFilters, setSorting, setSearch, updateFilters]),
    switchMap(() => [resetProducts(), setPage(1)]),
  );

export const loadProductsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(setPage),
    debounceTime(250),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const search = getSearch(state);
      const sort = getSorting(state);
      const filtersWithDefault = {
        ...getDefaultFilters(state),
        ...pickNotEmptyAndNil<Partial<IFilters>, IFilters>(getFilters(state)),
      } as IFilters;
      const { currentPage } = getPagination(state);
      const marketplaceId = getPreviewMarketplaceId();

      return apiService
        .get(
          getMarketplaceProductsUrl({
            page: currentPage,
            search,
            sort,
            filters: filtersWithDefault,
            marketplaceId,
          }),
          null,
          true,
        )
        .pipe(
          takeUntil(action$.ofType(...[setFilters, setSorting, setSearch, updateFilters])),
          map(({ data, pagination }: IProductsResponse) => loadProductsSuccess({ products: data, pagination })),
          catchError(handleError(handlers.handleAnyError(loadProductsFail))),
        );
    }),
  );

export const exportProductsEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(exportProductsRequest),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const search = getSearch(state);
      const sort = getSorting(state);
      const filters = {
        ...getDefaultFilters(state),
        ...pickNotEmptyAndNil<Partial<IFilters>, IFilters>(getFilters(state)),
      } as IFilters;
      const { currentPage } = getPagination(state);
      const marketplaceId = getPreviewMarketplaceId();

      return apiService
        .get(
          getMarketplaceProductsUrl({
            page: currentPage,
            search,
            sort,
            filters,
            marketplaceId,
            isExport: true,
          }),
          null,
          true,
        )
        .pipe(
          mergeMap(() => [
            exportProductsSuccess(),
            showGlobalMessage({
              type: MessageType.Success,
              text: 'Report will be sent to your email address',
            }),
          ]),
          catchError(handleError(handlers.handleAnyError(exportProductsFail))),
        );
    }),
  );

export const productsEpics = [filterProductsEpic, loadProductsEpic, exportProductsEpic, initLoadingEpic];
