import { createAction } from 'redux-act';

import { ICampaignsFilters } from './filters.types';

const PREFIX = 'CAMPAIGN_MANAGEMENT/FILTERS';

export const setFilters = createAction<Partial<ICampaignsFilters>>(`${PREFIX}/SET_FILTERS`);

export const resetFilters = createAction(`${PREFIX}/RESET_FILTERS`);
