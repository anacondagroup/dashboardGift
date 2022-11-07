import { createAction } from 'redux-act';

import { TSetRoiFiltersPayload } from './filters.types';

const PREFIX = 'ROI/FILTERS';

export const setRoiFilters = createAction<Partial<TSetRoiFiltersPayload>>(`${PREFIX}/SET`);
