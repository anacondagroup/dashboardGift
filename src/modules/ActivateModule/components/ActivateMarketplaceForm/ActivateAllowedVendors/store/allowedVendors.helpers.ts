import { ascend, descend, sort, pipe, prop, toLower, filter } from 'ramda';
import { SortDirection, SortDirectionType } from 'react-virtualized';

import { FilterKeys } from '../../../../constants/marketplaceSidebar.constants';
import { IGiftVendor, VendorTypes } from '../../../../store/entities/giftVendors/giftVendors.types';
import { getVendorKey } from '../../../../store/entities/giftVendors/giftVendors.helpers';
import { IRestrictedVendors } from '../../../../store/steps/gift/gift.types';

import { TRestrictedVendorsMap } from './allowedVendors.types';

export const unionVendorsRestriction = ({
  restrictedBrandIds = [],
  restrictedMerchantIds = [],
}: IRestrictedVendors): TRestrictedVendorsMap =>
  [
    ...restrictedBrandIds.map(id => ({ id, type: VendorTypes.brand })),
    ...restrictedMerchantIds.map(id => ({ id, type: VendorTypes.merchant })),
  ].reduce((all, vendor) => ({ ...all, [getVendorKey(vendor)]: vendor }), {});

export const sortBy = (direction: SortDirectionType): ((list: readonly IGiftVendor[]) => IGiftVendor[]) => {
  const sortFn = direction === SortDirection.ASC ? ascend : descend;
  return sort<IGiftVendor>(sortFn(pipe(prop('name'), toLower)));
};

const searchByName = (search: string) =>
  filter<IGiftVendor>(vendor => vendor.name.toLowerCase().includes(search.toLocaleLowerCase()));

const filterAllowedVendors = (restricted: TRestrictedVendorsMap) =>
  filter<IGiftVendor>(vendor => !restricted[getVendorKey(vendor)] && !vendor.isTeamRestricted);

const filterRestrictedVendors = (restricted: TRestrictedVendorsMap) =>
  filter<IGiftVendor>(vendor => !!restricted[getVendorKey(vendor)] || vendor.isTeamRestricted);

interface IGetVendorItemsParams {
  search: string;
  sortDirection: SortDirectionType;
  filter: FilterKeys;
  restricted: TRestrictedVendorsMap;
}

export const getVendorItems = ({
  search = '',
  sortDirection = SortDirection.ASC,
  filter: filterValue = FilterKeys.all,
  restricted = {},
}: IGetVendorItemsParams) => (items: IGiftVendor[]): IGiftVendor[] => {
  const sortedItems = sortBy(sortDirection)(items);
  const searchedItems = searchByName(search)(sortedItems);

  if (filterValue === FilterKeys.allowed) {
    return filterAllowedVendors(restricted)(searchedItems);
  }

  if (filterValue === FilterKeys.restricted) {
    return filterRestrictedVendors(restricted)(searchedItems);
  }

  return searchedItems;
};
