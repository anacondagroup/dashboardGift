import { createAction } from 'redux-act';

const PREFIX = `CAMPAIGN_MANAGEMENT`;

export const fetchCampaignsWithStoredFilters = createAction(`${PREFIX}/DISPATCH_FILTERS`);
