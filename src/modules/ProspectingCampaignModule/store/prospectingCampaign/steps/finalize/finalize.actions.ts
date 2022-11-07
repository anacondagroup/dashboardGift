import { createAsyncAction } from '@alycecom/utils';

import { TCreateProspectingResponse } from './finalize.types';

export const prefix = 'PROSPECTING_CAMPAIGN/STEPS/FINALIZE';

export const createProspectingCampaignByDraftId = createAsyncAction<number, TCreateProspectingResponse>(
  `${prefix}/FINISH`,
);
