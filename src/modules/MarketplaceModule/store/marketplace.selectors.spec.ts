import * as selectors from './marketplace.selectors';
import { ProductFilter } from './products/products.types';
import { TProductCategory } from './entities/productCategories/productCategories.types';

const budgetMockA = {
  [ProductFilter.MinPrice]: 10,
  [ProductFilter.MaxPrice]: 100,
  [ProductFilter.DonationPrice]: 50,
  [ProductFilter.GiftCardPrice]: 75,
};

const budgetMockB = {
  [ProductFilter.MinPrice]: 10,
  [ProductFilter.MaxPrice]: 101,
  [ProductFilter.DonationPrice]: 50,
  [ProductFilter.GiftCardPrice]: 75,
};

const categoryMockA: TProductCategory = {
  id: 1,
  label: 'Drinking',
};

const categoryMockB: TProductCategory = {
  id: 2,
  label: 'Smoking',
};

const categoryMap = {
  1: categoryMockA,
  2: categoryMockB,
};

describe('MarketplaceModule > root selectors', () => {
  test('getRestrictedBrands', () => {
    expect(selectors.getRestrictedBrands.resultFunc(false, [1], [1, 2, 3])).toEqual([]);
    expect(selectors.getRestrictedBrands.resultFunc(true, [1], [1, 2, 3])).toEqual([2, 3]);
  });

  test('getRestrictedMerchants', () => {
    expect(selectors.getRestrictedMerchants.resultFunc(false, [1], [1, 2, 3])).toEqual([]);
    expect(selectors.getRestrictedMerchants.resultFunc(true, [1], [1, 2, 3])).toEqual([2, 3]);
  });

  test('getRestrictedTypes', () => {
    expect(selectors.getDisabledTypes.resultFunc(false, [1], [1, 2, 3])).toEqual([]);
    expect(selectors.getDisabledTypes.resultFunc(true, [1], [1, 2, 3])).toEqual([2, 3]);
    expect(selectors.getDisabledTypes.resultFunc(true, [1], [])).toEqual([]);
  });

  test('getIsCampaignMarketplaceLoaded', () => {
    expect(selectors.getIsCampaignMarketplaceLoaded.resultFunc(false, false, false, 0)).toBe(false);
    expect(selectors.getIsCampaignMarketplaceLoaded.resultFunc(true, false, false, 0)).toBe(false);
    expect(selectors.getIsCampaignMarketplaceLoaded.resultFunc(false, true, false, 0)).toBe(false);
    expect(selectors.getIsCampaignMarketplaceLoaded.resultFunc(false, false, true, 0)).toBe(false);
    expect(selectors.getIsCampaignMarketplaceLoaded.resultFunc(false, false, false, 1)).toBe(false);
    expect(selectors.getIsCampaignMarketplaceLoaded.resultFunc(true, true, true, 1)).toBe(true);
  });

  test('getIsVendorsDiffWithCampaignSettings', () => {
    expect(selectors.getIsVendorsDiffWithCampaignSettings.resultFunc(false, [1], [1], [1], [1])).toBe(false);
    expect(selectors.getIsVendorsDiffWithCampaignSettings.resultFunc(true, [1], [1], [1], [1])).toBe(false);
    expect(selectors.getIsVendorsDiffWithCampaignSettings.resultFunc(true, [1], [1], [1], [1])).toBe(false);

    expect(selectors.getIsVendorsDiffWithCampaignSettings.resultFunc(true, [1, 2, 3], [1], [3, 2, 1], [1])).toBe(false);
    expect(selectors.getIsVendorsDiffWithCampaignSettings.resultFunc(true, [], [], [], [])).toBe(false);

    expect(selectors.getIsVendorsDiffWithCampaignSettings.resultFunc(true, [1, 2], [1], [1], [1])).toBe(true);
    expect(selectors.getIsVendorsDiffWithCampaignSettings.resultFunc(true, [1], [1], [1, 2], [1])).toBe(true);

    expect(selectors.getIsVendorsDiffWithCampaignSettings.resultFunc(true, [1], [1, 2], [1], [1])).toBe(true);
    expect(selectors.getIsVendorsDiffWithCampaignSettings.resultFunc(true, [1], [1], [1], [1, 2])).toBe(true);
  });

  test('getIsTypesDiffWithCampaignSettings', () => {
    expect(selectors.getIsTypesDiffWithCampaignSettings.resultFunc(false, [], [1])).toBe(false);
    expect(selectors.getIsTypesDiffWithCampaignSettings.resultFunc(true, [2, 1], [1, 2])).toBe(false);
    expect(selectors.getIsTypesDiffWithCampaignSettings.resultFunc(true, [], [])).toBe(false);

    expect(selectors.getIsTypesDiffWithCampaignSettings.resultFunc(true, [1, 2], [3, 2, 1])).toBe(true);
    expect(selectors.getIsTypesDiffWithCampaignSettings.resultFunc(true, [1, 2, 3], [3, 2])).toBe(true);
  });

  test('getIsBudgetDiffWithCampaignSettings', () => {
    expect(selectors.getIsBudgetDiffWithCampaignSettings.resultFunc(false, budgetMockA, budgetMockB)).toBe(false);
    expect(selectors.getIsBudgetDiffWithCampaignSettings.resultFunc(true, budgetMockA, { ...budgetMockA })).toBe(false);
    expect(selectors.getIsBudgetDiffWithCampaignSettings.resultFunc(true, budgetMockA, budgetMockB)).toBe(true);
  });

  test('getIsFiltersDiffWithCampaignSettings', () => {
    expect(selectors.getIsFiltersDiffWithCampaignSettings.resultFunc(true, false, false)).toBe(true);
    expect(selectors.getIsFiltersDiffWithCampaignSettings.resultFunc(false, true, false)).toBe(true);
    expect(selectors.getIsFiltersDiffWithCampaignSettings.resultFunc(false, false, true)).toBe(true);
    expect(selectors.getIsFiltersDiffWithCampaignSettings.resultFunc(false, false, false)).toBe(false);
  });

  test('getSelectedCategories', () => {
    expect(selectors.getSelectedCategories.resultFunc([1], categoryMap)).toEqual([categoryMockA]);
    expect(selectors.getSelectedCategories.resultFunc([2, 1], categoryMap)).toEqual([categoryMockA, categoryMockB]);
    expect(selectors.getSelectedCategories.resultFunc([], categoryMap)).toEqual([]);
    expect(selectors.getSelectedCategories.resultFunc([3], categoryMap)).toEqual([]);
  });
});
