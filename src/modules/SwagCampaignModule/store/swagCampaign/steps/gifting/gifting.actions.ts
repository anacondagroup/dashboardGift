import { createAsyncAction } from '@alycecom/utils';

import { TSwagGifting } from '../../swagCampaign.types';

import { TGiftingErrors } from './gifting.types';

const prefix = 'SWAG_CAMPAIGN/STEPS/GIFTING';

export const updateDraftSwagGifting = createAsyncAction<TSwagGifting & { id: number }, TSwagGifting, TGiftingErrors>(
  `${prefix}/UPDATE_DRAFT`,
);

export const updateSwagGifting = createAsyncAction<TSwagGifting & { id: number }, TSwagGifting, TGiftingErrors>(
  `${prefix}/UPDATE`,
);
