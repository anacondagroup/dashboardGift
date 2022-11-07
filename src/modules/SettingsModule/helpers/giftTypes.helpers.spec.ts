import { SortDirection } from '@alycecom/utils';
import { getLocalSortedGiftTypes } from './giftTypes.helpers';
import { ProductTypes } from '../store/settings.types';
import { PRODUCT_TYPE_DESCRIPTIONS } from '../constants/giftTypes.constants';

describe('getLocalSortedGiftTypes units', () => {
  const physicalGiftType = {
    id: ProductTypes.physical,
    name: 'Physical',
    is_campaign_restricted: false,
    is_team_restricted: false,
    countryIds: [1, 2, 3],
    description: PRODUCT_TYPE_DESCRIPTIONS[ProductTypes.physical],
  };

  const subscriptionGiftType = {
    id: ProductTypes.subscription,
    name: 'Subscription',
    is_campaign_restricted: false,
    is_team_restricted: false,
    countryIds: [1, 2],
    description: PRODUCT_TYPE_DESCRIPTIONS[ProductTypes.subscription],
  };

  const giftCardGiftType = {
    id: ProductTypes.eGift,
    name: 'Gift cards',
    is_campaign_restricted: false,
    is_team_restricted: false,
    countryIds: [1, 3],
    description: PRODUCT_TYPE_DESCRIPTIONS[ProductTypes.eGift],
  };

  const giftTypes = [physicalGiftType, subscriptionGiftType, giftCardGiftType];
  const sorting = { order: SortDirection.asc, column: 'id' };

  it('gift types list should be as is', () => {
    expect(getLocalSortedGiftTypes({ giftTypes, sorting })).toEqual(giftTypes);
  });

  it('gift types list should be searched by name', () => {
    expect(getLocalSortedGiftTypes({ giftTypes, sorting, search: 'Subscrip' })).toEqual([subscriptionGiftType]);
  });

  it('gift types list should be searched by countries', () => {
    expect(getLocalSortedGiftTypes({ giftTypes, sorting, selectedCountryIds: [1, 3] })).toEqual([
      physicalGiftType,
      giftCardGiftType,
    ]);
  });

  it('gift types list should be searched by countries and sorted by name asc', () => {
    expect(
      getLocalSortedGiftTypes({
        giftTypes,
        sorting: { order: SortDirection.asc, column: 'name' },
        selectedCountryIds: [1, 3],
      }),
    ).toEqual([giftCardGiftType, physicalGiftType]);
  });

  it('gift types list should be empty because of countries filter', () => {
    expect(
      getLocalSortedGiftTypes({
        giftTypes,
        sorting,
        selectedCountryIds: [5, 6],
      }),
    ).toEqual([]);
  });
});
