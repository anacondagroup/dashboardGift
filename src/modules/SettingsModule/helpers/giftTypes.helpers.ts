import { SortDirection } from '@alycecom/utils';
import { sort, ascend, prop, descend } from 'ramda';

import { IGiftType } from '../store/campaign/giftInvites/giftInvites.types';
import { PRODUCT_TYPE_DESCRIPTIONS } from '../constants/giftTypes.constants';

export const mapDescriptionToGiftTypes = (giftTypes: IGiftType[]): IGiftType[] =>
  giftTypes.map(type => ({ ...type, description: PRODUCT_TYPE_DESCRIPTIONS[type.id] }));

type Sorting = {
  column: string;
  order: SortDirection;
};

const sortGiftTypes = (sorting: Sorting) =>
  sort<IGiftType>(sorting.order === SortDirection.asc ? ascend(prop(sorting.column)) : descend(prop(sorting.column)));

interface IGetLocalSortedGiftTypesParams {
  giftTypes: IGiftType[];
  sorting: Sorting;
  selectedCountryIds?: number[];
  search?: string;
}

export const getLocalSortedGiftTypes = ({
  giftTypes,
  sorting,
  selectedCountryIds = [],
  search = '',
}: IGetLocalSortedGiftTypesParams): IGiftType[] => {
  const filteredGiftTypes = giftTypes.filter(({ name, description, countryIds }) => {
    const lowerSearch = search.toLocaleLowerCase();
    const giftTypeHasAllCountries = selectedCountryIds.every(id => countryIds.includes(id));
    const isGiftTypeVisible = selectedCountryIds.length > 0 ? giftTypeHasAllCountries : true;
    return Boolean(
      (name.toLowerCase().includes(lowerSearch) || (description && description.toLowerCase().includes(lowerSearch))) &&
        isGiftTypeVisible,
    );
  });
  return sortGiftTypes(sorting)(filteredGiftTypes);
};
