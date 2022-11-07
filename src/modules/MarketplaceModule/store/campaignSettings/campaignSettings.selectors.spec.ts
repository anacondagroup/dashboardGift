import { initialState, ICampaignSettingsState } from './campaignSettings.reducer';
import * as selectors from './campaignSettings.selectors';
import { IRootState } from '../../../../store/root.types';
import { ProductVendorsTypes } from '../entities/productVendors/productVendors.types';
import { ProductFilter } from '../products/products.types';

const createStateMock = (state: Partial<ICampaignSettingsState>) =>
  (({
    marketplace: {
      campaignSettings: {
        ...initialState,
        ...state,
      },
    },
  } as unknown) as IRootState);

const restrictedProductTypeMock = [
  { id: 1, label: 'Money', isRestrictedForCampaign: false, isRestrictedForTeam: true },
  { id: 2, label: 'Cards', isRestrictedForCampaign: true, isRestrictedForTeam: false },
  { id: 3, label: 'Anything', isRestrictedForCampaign: true, isRestrictedForTeam: false },
];

const restrictedProductVendorMock = [
  {
    id: 1,
    type: ProductVendorsTypes.Merchant,
    label: 'Vendor 1',
    isRestrictedForCampaign: false,
    isRestrictedForTeam: true,
  },
  {
    id: 2,
    type: ProductVendorsTypes.Brand,
    label: 'Vendor 2',
    isRestrictedForCampaign: true,
    isRestrictedForTeam: false,
  },
  {
    id: 3,
    type: ProductVendorsTypes.Merchant,
    label: 'Vendor 3',
    isRestrictedForCampaign: true,
    isRestrictedForTeam: false,
  },
  {
    id: 4,
    type: ProductVendorsTypes.Brand,
    label: 'Vendor 4',
    isRestrictedForCampaign: false,
    isRestrictedForTeam: true,
  },
];

const vendorsMapMock = {
  'merchant/1': {
    id: 1,
    type: ProductVendorsTypes.Merchant,
    label: 'Vendor 1',
  },
  'brand/2': {
    id: 2,
    type: ProductVendorsTypes.Brand,
    label: 'Vendor 2',
  },
  'merchant/3': {
    id: 3,
    type: ProductVendorsTypes.Merchant,
    label: 'Vendor 3',
  },
  'brand/4': {
    id: 4,
    type: ProductVendorsTypes.Brand,
    label: 'Vendor 4',
  },
};

describe('MarketplaceModule > campaignSettings > selectors', () => {
  test('getIsLoaded', () => {
    expect(selectors.getIsLoaded(createStateMock({ isLoaded: true }))).toBe(true);
  });

  test('getIsLoading', () => {
    expect(selectors.getIsLoaded(createStateMock({ isLoaded: true }))).toBe(true);
  });

  test('getCampaignId', () => {
    expect(selectors.getCampaignId(createStateMock({ campaignId: 100 }))).toBe(100);
  });

  test('getIsInternational', () => {
    expect(selectors.getIsInternational(createStateMock({ isInternational: true }))).toBe(true);
  });

  test('getCountryIds', () => {
    expect(selectors.getCountryIds(createStateMock({ countryIds: [2] }))).toEqual([2]);
  });

  test('getMinPrice', () => {
    expect(selectors.getMinPrice(createStateMock({ minPrice: 10 }))).toBe(10);
  });

  test('getMaxPrice', () => {
    expect(selectors.getMaxPrice(createStateMock({ maxPrice: 20 }))).toBe(20);
  });

  test('getGiftCardPrice', () => {
    expect(selectors.getGiftCardPrice(createStateMock({ giftCardPrice: 40 }))).toBe(40);
  });

  test('getDonationPrice', () => {
    expect(selectors.getDonationPrice(createStateMock({ donationPrice: 30 }))).toBe(30);
  });

  test('getRestrictedTypes', () => {
    expect(selectors.getRestrictedTypes(createStateMock({ restrictedProductsTypes: restrictedProductTypeMock }))).toBe(
      restrictedProductTypeMock,
    );
  });

  test('getRestrictedTypeIds', () => {
    expect(selectors.getRestrictedTypeIds.resultFunc(restrictedProductTypeMock)).toEqual([1, 2, 3]);
  });

  test('getRestrictedVendors', () => {
    expect(
      selectors.getRestrictedVendors(createStateMock({ restrictedProductsVendors: restrictedProductVendorMock })),
    ).toBe(restrictedProductVendorMock);
  });

  test('getRestrictedBrandsIds', () => {
    expect(selectors.getRestrictedBrandsIds.resultFunc(restrictedProductVendorMock)).toEqual([2, 4]);
  });

  test('getRestrictedMerchantsIds', () => {
    expect(selectors.getRestrictedMerchantsIds.resultFunc(restrictedProductVendorMock)).toEqual([1, 3]);
  });

  test('getRestrictedVendorIds', () => {
    expect(selectors.getRestrictedVendorIds.resultFunc(restrictedProductVendorMock)).toEqual([
      'merchant/1',
      'brand/2',
      'merchant/3',
      'brand/4',
    ]);
  });

  test('getEnabledVendorsMap', () => {
    expect(selectors.getEnabledVendorsMap.resultFunc(false, false, [], {})).toEqual({});
    expect(selectors.getEnabledVendorsMap.resultFunc(false, true, [], vendorsMapMock)).toEqual({});
    expect(selectors.getEnabledVendorsMap.resultFunc(true, true, ['merchant/1', 'brand/4'], vendorsMapMock)).toEqual({
      'brand/2': vendorsMapMock['brand/2'],
      'merchant/3': vendorsMapMock['merchant/3'],
    });
  });

  test('getEnabledVendors', () => {
    expect(selectors.getEnabledVendors.resultFunc(vendorsMapMock)).toEqual(Object.values(vendorsMapMock));
  });

  test('getEnabledMerchantIds', () => {
    expect(selectors.getEnabledMerchantIds.resultFunc(Object.values(vendorsMapMock))).toEqual([1, 3]);
  });

  test('getEnabledBrandIds', () => {
    expect(selectors.getEnabledBrandIds.resultFunc(Object.values(vendorsMapMock))).toEqual([2, 4]);
  });

  test('getEnabledTypeIds', () => {
    expect(selectors.getEnabledTypeIds.resultFunc(false, false, [], [])).toEqual([]);
    expect(selectors.getEnabledTypeIds.resultFunc(true, false, [1, 4], [])).toEqual([]);
    expect(selectors.getEnabledTypeIds.resultFunc(false, true, [], [1, 2])).toEqual([]);
    expect(selectors.getEnabledTypeIds.resultFunc(true, true, [2, 4], [1, 2, 3, 4])).toEqual([1, 3]);
  });

  test('getBudgetAsFilters', () => {
    expect(selectors.getBudgetAsFilters.resultFunc(10, 20, 30, 40)).toEqual({
      [ProductFilter.MinPrice]: 10,
      [ProductFilter.MaxPrice]: 20,
      [ProductFilter.DonationPrice]: 30,
      [ProductFilter.GiftCardPrice]: 40,
    });
  });

  test('getCampaignSettingsAsFilters', () => {
    expect(
      selectors.getCampaignSettingsAsFilters.resultFunc(
        {
          [ProductFilter.MinPrice]: 10,
          [ProductFilter.MaxPrice]: 20,
          [ProductFilter.DonationPrice]: 30,
          [ProductFilter.GiftCardPrice]: 40,
        },
        [{ id: 1, type: ProductVendorsTypes.Brand, label: 'Pop it' }],
        [1, 2, 3],
        [4, 5, 6],
        [7, 8],
      ),
    ).toEqual({
      [ProductFilter.MinPrice]: 10,
      [ProductFilter.MaxPrice]: 20,
      [ProductFilter.DonationPrice]: 30,
      [ProductFilter.GiftCardPrice]: 40,
      [ProductFilter.Vendors]: [{ id: 1, type: ProductVendorsTypes.Brand, label: 'Pop it' }],
      [ProductFilter.MerchantIds]: [1, 2, 3],
      [ProductFilter.BrandIds]: [4, 5, 6],
      [ProductFilter.TypeIds]: [7, 8],
    });
  });
});
