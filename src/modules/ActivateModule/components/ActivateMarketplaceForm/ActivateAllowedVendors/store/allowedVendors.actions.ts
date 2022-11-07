import { createAction } from 'redux-act';
import { SortDirectionType } from 'react-virtualized';

import { FilterKeys, VendorsOptions } from '../../../../constants/marketplaceSidebar.constants';

const PREFIX = 'ACTIVATE_MODULE/VENDORS';

export const setSearch = createAction<{ search: string }>(`${PREFIX}/SET_SEARCH`);
export const setFilter = createAction<{ filter: FilterKeys }>(`${PREFIX}/SET_FILTER`);
export const setSorting = createAction<{ direction: SortDirectionType }>(`${PREFIX}/SET_SORTING`);
export const setVendorsOption = createAction<{ vendorsOption: VendorsOptions }>(`${PREFIX}/SET_VENDORS_OPTION`);
