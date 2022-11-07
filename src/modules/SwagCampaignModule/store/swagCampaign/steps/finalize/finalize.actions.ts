import { createAsyncAction } from '@alycecom/utils';

import { TCreateSwagResponse } from './finalize.types';

export const prefix = 'SWAG_CAMPAIGN/STEPS/FINALIZE';

export const createSwagCampaignByDraftId = createAsyncAction<number, TCreateSwagResponse>(`${prefix}/FINISH`);
