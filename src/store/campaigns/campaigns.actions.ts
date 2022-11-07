import { createAction } from 'redux-act';

import { ICampaign } from './campaigns.types';

const PREFIX = 'DASHBOARD/CAMPAIGNS';

export const loadCampaignsRequest = createAction(`${PREFIX}/LOAD_CAMPAIGNS_REQUEST`);
export const loadCampaignsSuccess = createAction<ICampaign[]>(`${PREFIX}/LOAD_CAMPAIGNS_SUCCESS`);
export const loadCampaignsFail = createAction(`${PREFIX}/LOAD_CAMPAIGNS_FAIL`);
