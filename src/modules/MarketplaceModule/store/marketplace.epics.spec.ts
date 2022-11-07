import { TestScheduler } from 'rxjs/testing';
import { ActionsObservable, StateObservable } from 'redux-observable';
import { LOCATION_CHANGE, replace } from 'connected-react-router';
import {
  getCampaignDefaultBrandIds,
  getCampaignDefaultMerchantIds,
  getCampaignDefaultTypeIds,
  getCampaignMarketplaceId,
  getCampaignSettingsAsFilters,
  getCountryIds,
  getEnabledVendorsMap,
  getIsInternational,
  getRestrictedTypeIds as getCampaignRestrictedTypeIds,
} from './campaignSettings/campaignSettings.selectors';
import {
  getGiftFilters,
  getBudgetFilters,
  getEntityIdsFilters,
  getSorting,
  getPagination,
  getSearch,
  getSelectedGiftTypes,
} from './products/products.selectors';
import {
  loadProductsSuccess,
  setDefaultFilters,
  setFilters,
  setSearch,
  updateFilters,
} from './products/products.actions';
import { ProductVendorsTypes } from './entities/productVendors/productVendors.types';
import { getVendorsMap } from './entities/productVendors/productVendors.selectors';

import {
  applyCampaignSettingsToFiltersEpic,
  applyCustomMarketplaceSettingsToFiltersEpic,
  initCampaignMarketplaceEpic,
  initCustomMarketplaceEpic,
  initDefaultMarketplaceEpic,
  syncFilterToUrlQueryEpic,
} from './marketplace.epics';
import { fetchCampaignSettingsSuccess } from './campaignSettings/campaignSettings.actions';
import { TMarketplaceCampaignSettings } from './campaignSettings/campaignSettings.types';
import { fetchProductVendorsSuccess } from './entities/productVendors/productVendors.actions';
import { ProductFilter } from './products/products.types';
import { fetchProductTypesSuccess } from './entities/productTypes/productTypes.actions';
import {
  getCustomMarketplaceAsFilters,
  getCustomMarketplaceCountryIds,
  getCustomMarketplaceTeamIds,
  getDefaultTypeIds,
  getRestrictedTypeIds,
} from './customMarketplace/customMarketplace.selectors';
import { fetchCustomMarketplaceSuccess } from './customMarketplace/customMarketplace.actions';
import { TCustomMarketplace } from './customMarketplace/customMarketplace.types';
import { getIsCustomMarketplaceSettingsDiffWithFilters } from './marketplace.selectors';
import { getTeams } from '../../../store/teams/teams.selectors';

jest.mock('./marketplace.selectors');
const getIsCustomMarketplaceSettingsDiffWithFiltersMock = getIsCustomMarketplaceSettingsDiffWithFilters as jest.MockedFunction<
  typeof getIsCustomMarketplaceSettingsDiffWithFilters
>;

jest.mock('./customMarketplace/customMarketplace.selectors');
const getCustomMarketplaceAsFiltersMock = getCustomMarketplaceAsFilters as jest.MockedFunction<
  typeof getCustomMarketplaceAsFilters
>;
const getDefaultTypeIdsMock = getDefaultTypeIds as jest.MockedFunction<typeof getDefaultTypeIds>;
const getRestrictedTypeIdsMock = getRestrictedTypeIds as jest.MockedFunction<typeof getRestrictedTypeIds>;
const getCustomMarketplaceTeamIdsMock = getCustomMarketplaceTeamIds as jest.MockedFunction<
  typeof getCustomMarketplaceTeamIds
>;
const getCustomMarketplaceCountryIdsMock = getCustomMarketplaceCountryIds as jest.MockedFunction<
  typeof getCustomMarketplaceCountryIds
>;

jest.mock('./entities/productVendors/productVendors.selectors');
const getVendorsMapMock = getVendorsMap as jest.MockedFunction<typeof getVendorsMap>;
const getEnabledVendorsMapMock = getEnabledVendorsMap as jest.MockedFunction<typeof getEnabledVendorsMap>;
const getCampaignRestrictedTypeIdsMock = getCampaignRestrictedTypeIds as jest.MockedFunction<
  typeof getCampaignRestrictedTypeIds
>;

jest.mock('./products/products.selectors');
const getGiftFiltersMock = getGiftFilters as jest.MockedFunction<typeof getGiftFilters>;
const getBudgetFiltersMock = getBudgetFilters as jest.MockedFunction<typeof getBudgetFilters>;
const getEntityIdsFiltersMock = getEntityIdsFilters as jest.MockedFunction<typeof getEntityIdsFilters>;
const getSortingMock = getSorting as jest.MockedFunction<typeof getSorting>;
const getPaginationMock = getPagination as jest.MockedFunction<typeof getPagination>;
const getSearchMock = getSearch as jest.MockedFunction<typeof getSearch>;
const getSelectedGiftTypesMock = getSelectedGiftTypes as jest.MockedFunction<typeof getSelectedGiftTypes>;

jest.mock('./campaignSettings/campaignSettings.selectors');
const getCampaignSettingsAsFiltersMock = getCampaignSettingsAsFilters as jest.MockedFunction<
  typeof getCampaignSettingsAsFilters
>;
const getIsInternationalMock = getIsInternational as jest.MockedFunction<typeof getIsInternational>;
const getCampaignDefaultTypeIdsMock = getCampaignDefaultTypeIds as jest.MockedFunction<
  typeof getCampaignDefaultTypeIds
>;
const getCampaignDefaultMerchantIdsMock = getCampaignDefaultMerchantIds as jest.MockedFunction<
  typeof getCampaignDefaultMerchantIds
>;
const getCampaignDefaultBrandIdsMock = getCampaignDefaultBrandIds as jest.MockedFunction<
  typeof getCampaignDefaultBrandIds
>;
const getCampaignMarketplaceIdMock = getCampaignMarketplaceId as jest.MockedFunction<typeof getCampaignMarketplaceId>;
const getCampaignCountriesIdsMock = getCountryIds as jest.MockedFunction<typeof getCountryIds>;

jest.mock('../../../store/teams/teams.selectors');
const getTeamsMock = getTeams as jest.MockedFunction<typeof getTeams>;

const locationChangeActionMock = {
  type: LOCATION_CHANGE,
};

const vendorsMock = [
  { id: 1, type: ProductVendorsTypes.Brand, label: 'Vendor 1' },
  { id: 2, type: ProductVendorsTypes.Merchant, label: 'Vendor 2' },
  { id: 3, type: ProductVendorsTypes.Brand, label: 'Vendor 3' },
  { id: 4, type: ProductVendorsTypes.Merchant, label: 'Vendor 4' },
];

const campaignSettingsAsFiltersMock = {
  [ProductFilter.MinPrice]: 10,
  [ProductFilter.MaxPrice]: 20,
  [ProductFilter.DonationPrice]: 30,
  [ProductFilter.GiftCardPrice]: 40,
  [ProductFilter.TypeIds]: [1, 2, 3],
  [ProductFilter.MerchantIds]: [2, 4],
  [ProductFilter.BrandIds]: [1, 3],
  [ProductFilter.Vendors]: vendorsMock,
};

describe('MarketplaceModule > root > epics', () => {
  let scheduler: TestScheduler;
  let state$: StateObservable<Record<string, unknown>>;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
      writable: true,
    });
    getCampaignSettingsAsFiltersMock.mockReset().mockReturnValue(campaignSettingsAsFiltersMock);
    getIsInternationalMock.mockReset().mockReturnValue(false);

    getVendorsMapMock.mockReset().mockReturnValue({
      'brand/1': vendorsMock[0],
      'merchant/2': vendorsMock[1],
      'brand/3': vendorsMock[2],
      'merchant/4': vendorsMock[3],
    });
    getEnabledVendorsMapMock.mockReset().mockReturnValue({
      'brand/1': vendorsMock[0],
      'merchant/2': vendorsMock[1],
      'brand/3': vendorsMock[2],
      'merchant/4': vendorsMock[3],
    });
    getCampaignRestrictedTypeIdsMock.mockReset().mockReturnValue([]);

    getGiftFiltersMock.mockReset().mockReturnValue({
      [ProductFilter.MinPrice]: 100,
      [ProductFilter.MaxPrice]: 200,
      [ProductFilter.DonationPrice]: undefined,
      [ProductFilter.GiftCardPrice]: 400,
      [ProductFilter.TypeIds]: [],
      [ProductFilter.MerchantIds]: [2],
      [ProductFilter.BrandIds]: [1],
      [ProductFilter.Vendors]: [vendorsMock[0], vendorsMock[1]],
    });
    getSelectedGiftTypesMock.mockReset().mockReturnValue([]);
    getSearchMock.mockReset().mockReturnValue('Simple dimple');
    getSortingMock.mockReset().mockReturnValue({
      id: 1,
      value: { column: 'name', order: 'asc' },
    });
    getPaginationMock.mockReset().mockReturnValue({
      currentPage: 2,
      perPage: 20,
      total: 6780,
      totalPages: 100,
    });
    getBudgetFiltersMock.mockReset().mockReturnValue({
      [ProductFilter.MinPrice]: 100,
      [ProductFilter.MaxPrice]: 200,
      [ProductFilter.DonationPrice]: 300,
      [ProductFilter.GiftCardPrice]: 400,
    });
    getEntityIdsFiltersMock.mockReset().mockReturnValue({
      [ProductFilter.TypeIds]: [120],
      [ProductFilter.CategoryIds]: [10, 20],
      [ProductFilter.MerchantIds]: [2],
      [ProductFilter.BrandIds]: [1, 3, 10],
      [ProductFilter.CountryIds]: [2, 4],
    });

    getDefaultTypeIdsMock.mockReset().mockReturnValue([1, 2, 3]);
    getCustomMarketplaceAsFiltersMock.mockReset().mockReturnValue({
      [ProductFilter.MinPrice]: 100,
      [ProductFilter.MaxPrice]: 200,
      [ProductFilter.DonationPrice]: 300,
      [ProductFilter.GiftCardPrice]: 400,
      [ProductFilter.CountryIds]: [1],
    });
    getCustomMarketplaceTeamIdsMock.mockReset().mockReturnValue([101, 102]);
    getCustomMarketplaceCountryIdsMock.mockReset().mockReturnValue([1, 4, 5]);
    getIsCustomMarketplaceSettingsDiffWithFiltersMock.mockReset().mockReturnValue(false);
    getRestrictedTypeIdsMock.mockReset().mockReturnValue([]);
    getCampaignDefaultTypeIdsMock.mockReset().mockReturnValue([1, 5, 6]);
    getCampaignDefaultMerchantIdsMock.mockReset().mockReturnValue([52]);
    getCampaignDefaultBrandIdsMock.mockReset().mockReturnValue([1997, 2001]);
    getCampaignMarketplaceIdMock.mockReset().mockReturnValue(1);
    getCampaignCountriesIdsMock.mockReset().mockReturnValue([1, 2]);
    getTeamsMock.mockReset().mockReturnValue([
      { id: 1, name: 'Team 1', settings: { country_id: 1, currency_id: 1, enterprise_mode_enabled: true } },
      { id: 2, name: 'Team 2', settings: { country_id: 1, currency_id: 1, enterprise_mode_enabled: true } },
    ]);

    scheduler = new TestScheduler((a, b) => {
      expect(a).toEqual(b);
    });

    const stateMock = {};
    state$ = new StateObservable(
      scheduler.createHotObservable('s', {
        s: stateMock,
      }),
      stateMock,
    );
  });

  test('applyCampaignSettingsToFiltersEpic', () => {
    window.location = (new URL('https://example.com/marketplace/campaign/123') as unknown) as Location;
    getCampaignSettingsAsFiltersMock.mockReturnValue({
      ...campaignSettingsAsFiltersMock,
      [ProductFilter.Vendors]: [],
      [ProductFilter.MerchantIds]: [],
      [ProductFilter.BrandIds]: [],
    });
    scheduler.run(({ expectObservable, hot }) => {
      const action$ = new ActionsObservable(
        hot('-a--b', {
          a: fetchCampaignSettingsSuccess({} as TMarketplaceCampaignSettings & { campaignId: number }),
          b: fetchProductVendorsSuccess([]),
        }),
      );

      const expectedMarble = '----(dc)';
      const expected = {
        c: updateFilters({
          minPrice: 100,
          maxPrice: 200,
          donationPrice: 30,
          giftCardPrice: 400,
          types: [1, 2, 3],
          merchants: [2],
          brands: [1],
          vendors: [vendorsMock[0], vendorsMock[1]],
        }),
        d: setDefaultFilters({
          types: [1, 5, 6],
          merchants: [52],
          brands: [1997, 2001],
          giftCardPrice: 50,
          donationPrice: 50,
          countries: [1, 2],
          marketplaceId: 1,
          teamIds: [],
        }),
      };
      expectObservable(applyCampaignSettingsToFiltersEpic(action$, state$, {})).toBe(expectedMarble, expected);
    });
  });

  test('applyCampaignSettingsToFiltersEpic > should apply international campaign settings', () => {
    window.location = (new URL('https://example.com/marketplace/campaign/123') as unknown) as Location;
    getIsInternationalMock.mockReturnValue(true);
    getCampaignSettingsAsFiltersMock.mockReturnValue({
      ...campaignSettingsAsFiltersMock,
      [ProductFilter.Vendors]: [],
      [ProductFilter.MerchantIds]: [],
      [ProductFilter.BrandIds]: [],
    });
    scheduler.run(({ expectObservable, hot }) => {
      const action$ = new ActionsObservable(
        hot('-a--b', {
          a: fetchCampaignSettingsSuccess({} as TMarketplaceCampaignSettings & { campaignId: number }),
          b: fetchProductVendorsSuccess([]),
        }),
      );

      const expectedMarble = '----(dc)';
      const expected = {
        c: updateFilters({
          minPrice: 100,
          maxPrice: 200,
          donationPrice: 30,
          giftCardPrice: 400,
          types: [1, 2, 3],
          merchants: [2],
          brands: [1],
          vendors: [vendorsMock[0], vendorsMock[1]],
        }),
        d: setDefaultFilters({
          types: [1, 5, 6],
          merchants: [52],
          brands: [1997, 2001],
          giftCardPrice: 50,
          donationPrice: 50,
          countries: [1, 2],
          marketplaceId: 1,
          teamIds: [],
        }),
      };
      expectObservable(applyCampaignSettingsToFiltersEpic(action$, state$, {})).toBe(expectedMarble, expected);
    });
  });

  test('initDefaultMarketplaceEpic > all filters exist', () => {
    window.location = (new URL(
      'https://example.com/marketplace/campaign?brands=1,3&merchants=4&search=my text&minPrice=1&maxPrice=2&types=7,6,4&categories=10,20,30&countries=2,1&giftCardPrice=100&donationPrice=200',
    ) as unknown) as Location;
    scheduler.run(({ expectObservable, hot }) => {
      const action$ = new ActionsObservable(
        hot('a--b--c---a-b-c', {
          a: locationChangeActionMock,
          b: fetchProductTypesSuccess([]),
          c: fetchProductVendorsSuccess([]),
        }),
      );

      const expectedMarble = '------(gde)---(gde)';
      const expected = {
        g: setDefaultFilters({
          donationPrice: 50,
          giftCardPrice: 50,
          teamIds: [1, 2],
        }),
        d: setFilters({
          brands: [1, 3],
          merchants: [4],
          vendors: [vendorsMock[0], vendorsMock[2], vendorsMock[3]],
          countries: [2, 1],
          minPrice: 1,
          maxPrice: 2,
          donationPrice: 200,
          giftCardPrice: 100,
          types: [7, 6, 4],
          categories: [10, 20, 30],
        }),
        e: setSearch('my text'),
      };

      expectObservable(initDefaultMarketplaceEpic(action$, state$, {})).toBe(expectedMarble, expected);
    });
  });

  test('initDefaultMarketplaceEpic > without filters', () => {
    window.location = (new URL('https://example.com/marketplace/campaign') as unknown) as Location;
    scheduler.run(({ expectObservable, hot }) => {
      const action$ = new ActionsObservable(
        hot('a--b--c---a-b-c', {
          a: locationChangeActionMock,
          b: fetchProductTypesSuccess([]),
          c: fetchProductVendorsSuccess([]),
        }),
      );

      const expectedMarble = '------(gde)---(gde)';
      const expected = {
        g: setDefaultFilters({
          donationPrice: 50,
          giftCardPrice: 50,
          teamIds: [1, 2],
        }),
        d: setFilters({
          brands: [],
          merchants: [],
          vendors: [],
          countries: [],
          minPrice: undefined,
          maxPrice: undefined,
          donationPrice: undefined,
          giftCardPrice: undefined,
          types: [],
          categories: [],
        }),
        e: setSearch(''),
      };

      expectObservable(initDefaultMarketplaceEpic(action$, state$, {})).toBe(expectedMarble, expected);
    });
  });

  test('initCampaignMarketplaceEpic > not international', () => {
    window.location = (new URL(
      'https://example.com/marketplace/campaign/123?brands=1,3&merchants=4&search=my text&minPrice=1&maxPrice=2&types=7,6,4&categories=10,20,30&countries=2,1',
    ) as unknown) as Location;
    getCampaignRestrictedTypeIdsMock.mockReturnValue([6, 4]);
    scheduler.run(({ expectObservable, hot }) => {
      const action$ = new ActionsObservable(
        hot('a--b--c--d---a-b-c-d', {
          a: locationChangeActionMock,
          b: fetchCampaignSettingsSuccess({} as TMarketplaceCampaignSettings & { campaignId: number }),
          c: fetchProductVendorsSuccess([]),
          d: fetchProductTypesSuccess([]),
        }),
      );

      const expectedMarble = '---------(ef|)';
      const expected = {
        e: setSearch('my text'),
        f: updateFilters({
          brands: [1, 3],
          merchants: [4],
          vendors: [vendorsMock[0], vendorsMock[2], vendorsMock[3]],
          countries: [2, 1],
          minPrice: 1,
          maxPrice: 2,
          types: [7],
          categories: [10, 20, 30],
        }),
      };
      expectObservable(initCampaignMarketplaceEpic(action$, state$, {})).toBe(expectedMarble, expected);
    });
  });

  test('initCampaignMarketplaceEpic > international', () => {
    window.location = (new URL(
      'https://example.com/marketplace/campaign/123?brands=1,3&merchants=4&search=my text&minPrice=1&maxPrice=2&types=7,6,4&categories=10,20,30&countries=2,1',
    ) as unknown) as Location;
    getIsInternationalMock.mockReturnValue(true);
    scheduler.run(({ expectObservable, hot }) => {
      const action$ = new ActionsObservable(
        hot('a--b--c--d--a-b-c-d', {
          a: locationChangeActionMock,
          b: fetchCampaignSettingsSuccess({} as TMarketplaceCampaignSettings & { campaignId: number }),
          c: fetchProductVendorsSuccess([]),
          d: fetchProductTypesSuccess([]),
        }),
      );

      const expectedMarble = '---------(ef|)';
      const expected = {
        e: setSearch('my text'),
        f: updateFilters({
          brands: [1, 3],
          merchants: [4],
          vendors: [vendorsMock[0], vendorsMock[2], vendorsMock[3]],
          countries: [2, 1],
          minPrice: 1,
          maxPrice: 2,
          types: [7, 6, 4],
          categories: [10, 20, 30],
        }),
      };
      expectObservable(initCampaignMarketplaceEpic(action$, state$, {})).toBe(expectedMarble, expected);
    });
  });

  test('initCustomMarketplaceEpic', () => {
    window.location = (new URL(
      'https://example.com/marketplace/custom/123?brands=1,3&merchants=4&search=my text&minPrice=1&maxPrice=2&donationPrice=3&giftCardPrice=4&types=7,6,4&categories=10,20,30&countries=2,1',
    ) as unknown) as Location;

    scheduler.run(({ expectObservable, hot }) => {
      const action$ = new ActionsObservable(
        hot('a--b--c---a-b-c', {
          a: locationChangeActionMock,
          b: fetchProductTypesSuccess([]),
          c: fetchProductVendorsSuccess([]),
        }),
      );
      const expectedMarble = '------(de|)';
      const expected = {
        d: setSearch('my text'),
        e: updateFilters({
          brands: [1, 3],
          merchants: [4],
          vendors: [vendorsMock[0], vendorsMock[2], vendorsMock[3]],
          types: [7, 6, 4],
          categories: [10, 20, 30],
        }),
      };
      expectObservable(initCustomMarketplaceEpic(action$, state$, {})).toBe(expectedMarble, expected);
    });
  });

  test('initCustomMarketplaceEpic - with restricted types', () => {
    window.location = (new URL(
      'https://example.com/marketplace/custom/123?brands=1,3&merchants=4&search=my text&minPrice=1&maxPrice=2&donationPrice=3&giftCardPrice=4&types=7,6,4&categories=10,20,30&countries=2,1',
    ) as unknown) as Location;
    getRestrictedTypeIdsMock.mockReturnValue([6, 4]);

    scheduler.run(({ expectObservable, hot }) => {
      const action$ = new ActionsObservable(
        hot('a--b--c---a-b-c', {
          a: locationChangeActionMock,
          b: fetchProductTypesSuccess([]),
          c: fetchProductVendorsSuccess([]),
        }),
      );
      const expectedMarble = '------(de|)';
      const expected = {
        d: setSearch('my text'),
        e: updateFilters({
          brands: [1, 3],
          merchants: [4],
          vendors: [vendorsMock[0], vendorsMock[2], vendorsMock[3]],
          types: [7],
          categories: [10, 20, 30],
        }),
      };
      expectObservable(initCustomMarketplaceEpic(action$, state$, {})).toBe(expectedMarble, expected);
    });
  });

  test('applyCustomMarketplaceSettingsToFiltersEpic > when filters NOT changed', () => {
    window.location = (new URL('https://example.com/marketplace/custom/123') as unknown) as Location;

    scheduler.run(({ expectObservable, hot }) => {
      const action$ = new ActionsObservable(
        hot('ab', {
          a: fetchCustomMarketplaceSuccess(({} as unknown) as TCustomMarketplace),
          b: fetchProductTypesSuccess([]),
        }),
      );
      const expectedMarble = '-(c)';
      const expected = {
        c: setDefaultFilters({
          [ProductFilter.TypeIds]: [1, 2, 3],
          [ProductFilter.TeamIds]: [101, 102],
          [ProductFilter.CountryIds]: [1, 4, 5],
        }),
      };
      expectObservable(applyCustomMarketplaceSettingsToFiltersEpic(action$, state$, {})).toBe(expectedMarble, expected);
    });
  });

  test('applyCustomMarketplaceSettingsToFiltersEpic > when filters changed', () => {
    window.location = (new URL('https://example.com/marketplace/custom/123') as unknown) as Location;
    getIsCustomMarketplaceSettingsDiffWithFiltersMock.mockReturnValue(true);
    scheduler.run(({ expectObservable, hot }) => {
      const action$ = new ActionsObservable(
        hot('ab', {
          a: fetchCustomMarketplaceSuccess(({} as unknown) as TCustomMarketplace),
          b: fetchProductTypesSuccess([]),
        }),
      );
      const expectedMarble = '-(cd)';
      const expected = {
        c: setDefaultFilters({
          [ProductFilter.TypeIds]: [1, 2, 3],
          [ProductFilter.TeamIds]: [101, 102],
          [ProductFilter.CountryIds]: [1, 4, 5],
        }),
        d: updateFilters({
          [ProductFilter.MinPrice]: 100,
          [ProductFilter.MaxPrice]: 200,
          [ProductFilter.DonationPrice]: 300,
          [ProductFilter.GiftCardPrice]: 400,
          [ProductFilter.CountryIds]: [1],
          [ProductFilter.TypeIds]: [],
        }),
      };
      expectObservable(applyCustomMarketplaceSettingsToFiltersEpic(action$, state$, {})).toBe(expectedMarble, expected);
    });
  });

  test('applyCustomMarketplaceSettingsToFiltersEpic - with selected and restricted types', () => {
    window.location = (new URL('https://example.com/marketplace/custom/123') as unknown) as Location;
    getIsCustomMarketplaceSettingsDiffWithFiltersMock.mockReturnValue(true);
    getSelectedGiftTypesMock.mockReturnValue([1, 2, 3, 4]);
    getRestrictedTypeIdsMock.mockReturnValue([2, 4]);
    scheduler.run(({ expectObservable, hot }) => {
      const action$ = new ActionsObservable(
        hot('ab', {
          a: fetchCustomMarketplaceSuccess(({} as unknown) as TCustomMarketplace),
          b: fetchProductTypesSuccess([]),
        }),
      );
      const expectedMarble = '-(cd)';
      const expected = {
        c: setDefaultFilters({
          [ProductFilter.TypeIds]: [1, 2, 3],
          [ProductFilter.TeamIds]: [101, 102],
          [ProductFilter.CountryIds]: [1, 4, 5],
        }),
        d: updateFilters({
          [ProductFilter.MinPrice]: 100,
          [ProductFilter.MaxPrice]: 200,
          [ProductFilter.DonationPrice]: 300,
          [ProductFilter.GiftCardPrice]: 400,
          [ProductFilter.CountryIds]: [1],
          [ProductFilter.TypeIds]: [1, 3],
        }),
      };
      expectObservable(applyCustomMarketplaceSettingsToFiltersEpic(action$, state$, {})).toBe(expectedMarble, expected);
    });
  });

  test('syncFilterToUrlQueryEpic > without default values', () => {
    window.location = (new URL('https://example.com/marketplace/custom') as unknown) as Location;
    scheduler.run(({ expectObservable, hot }) => {
      const action$ = new ActionsObservable(
        hot('aa--a', {
          a: loadProductsSuccess({
            products: [],
            pagination: { currentPage: 1, perPage: 20, total: 100, totalPages: 200 },
          }),
        }),
      );

      const expectedMarble = '300ms ----b';
      const expected = {
        b: replace({
          search:
            'brands=1,3,10&categories=10,20&countries=2,4&donationPrice=300&giftCardPrice=400&maxPrice=200&merchants=2&minPrice=100&orderColumn=name&orderDirection=asc&page=2&search=Simple%20dimple&types=120',
        }),
      };

      expectObservable(syncFilterToUrlQueryEpic(action$, state$, {})).toBe(expectedMarble, expected);
    });
  });

  test('syncFilterToUrlQueryEpic > with default values', () => {
    window.location = (new URL('https://example.com/marketplace/campaign') as unknown) as Location;
    getSearchMock.mockReturnValue('');
    getSortingMock.mockReturnValue({
      id: 1,
      value: { column: 'popular', order: 'desc' },
    });
    getPaginationMock.mockReturnValue({
      currentPage: 1,
      perPage: 20,
      total: 6780,
      totalPages: 100,
    });
    getBudgetFiltersMock.mockReset().mockReturnValue({
      [ProductFilter.MinPrice]: undefined,
      [ProductFilter.MaxPrice]: 200,
      [ProductFilter.DonationPrice]: undefined,
      [ProductFilter.GiftCardPrice]: 400,
    });
    getEntityIdsFiltersMock.mockReset().mockReturnValue({
      [ProductFilter.TypeIds]: [120],
      [ProductFilter.CategoryIds]: [10, 20],
      [ProductFilter.MerchantIds]: [],
      [ProductFilter.BrandIds]: [1, 3, 10],
      [ProductFilter.CountryIds]: [],
    });
    scheduler.run(({ expectObservable, hot }) => {
      const action$ = new ActionsObservable(
        hot('aa--a', {
          a: loadProductsSuccess({
            products: [],
            pagination: { currentPage: 1, perPage: 20, total: 100, totalPages: 200 },
          }),
        }),
      );

      const expectedMarble = '300ms ----b';
      const expected = {
        b: replace({
          search: 'brands=1,3,10&categories=10,20&giftCardPrice=400&maxPrice=200&orderColumn=popular&types=120',
        }),
      };

      expectObservable(syncFilterToUrlQueryEpic(action$, state$, {})).toBe(expectedMarble, expected);
    });
  });
});
