import { createAsyncAction } from '@alycecom/utils';

import { TProspectingGifting } from '../../prospectingCampaign.types';

import { TGiftingErrors } from './gifting.types';

const prefix = 'PROSPECTING_CAMPAIGN/STEPS/GIFTING';

export const updateDraftProspectingGifting = createAsyncAction<
  TProspectingGifting & { id: number },
  TProspectingGifting,
  TGiftingErrors
>(`${prefix}/UPDATE_DRAFT`);

export const updateProspectingGifting = createAsyncAction<
  TProspectingGifting & { id: number },
  TProspectingGifting,
  TGiftingErrors
>(`${prefix}/UPDATE`);
