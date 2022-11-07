import { createAction } from 'redux-act';

import { GiftingStepFields, TSwagCampaignGiftingForm } from '../../steps/gifting/gifting.types';

const prefix = 'SWAG_CAMPAIGN/UI/GIFTING_STEP_LOCAL_DRAFT';

export const saveGiftingDraftDataById = createAction<TSwagCampaignGiftingForm & { id: number }>(`${prefix}/SAVE_BY_ID`);
export const saveGiftingMarketplaceDataById = createAction<
  TSwagCampaignGiftingForm[GiftingStepFields.ExchangeMarketplaceSettings] & { id: number }
>(`${prefix}/SAVE_MARKETPLACE`);
export const resetGiftingDraftDataById = createAction<number>(`${prefix}/RESET_BY_ID`);
