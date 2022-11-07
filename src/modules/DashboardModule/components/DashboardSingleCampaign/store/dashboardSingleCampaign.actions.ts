import { createAction } from 'redux-act';

import { ICampaign } from '../../../../../store/campaigns/campaigns.types';

export const setEmail = createAction<string>('SET_EMAIL');
export const setReportModalDisplay = createAction<boolean>('SET_REPORT_MODAL_DISPLAY');
export const setCurrentActionCampaign = createAction<ICampaign | null>('SET_CURRENT_ACTION_CAMPAIGN');
export const setUnClaimedGiftsCount = createAction<number>('SET_UNCLAIMED_GIFTS_COUNT');
