import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

const PREFIX = 'ACTIVATE_MODULE/STEPS/FINALIZE';

export const createCampaignRequest = createAction<{ draftId: number }>(`${PREFIX}/CREATE_CAMPAIGN_REQUEST`);
export const createCampaignSuccess = createAction(`${PREFIX}/CREATE_CAMPAIGN_SUCCESS`);
export const createCampaignFail = createAction<TErrors>(`${PREFIX}/CREATE_CAMPAIGN_FAIL`);
