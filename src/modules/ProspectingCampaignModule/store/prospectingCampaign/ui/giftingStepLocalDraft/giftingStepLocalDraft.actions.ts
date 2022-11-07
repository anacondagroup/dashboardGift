import { createAction } from 'redux-act';

import { GiftingStepFields, TProspectingGiftingForm } from '../../steps/gifting/gifting.types';

const prefix = 'PROSPECTING_CAMPAIGN/UI/GIFTING_STEP_LOCAL_DRAFT';

export const saveGiftingDraftDataById = createAction<TProspectingGiftingForm & { id: number }>(`${prefix}/SAVE_BY_ID`);
export const saveGiftingMarketplaceDataById = createAction<
  TProspectingGiftingForm[GiftingStepFields.MarketplaceData] & { id: number }
>(`${prefix}/SAVE_MARKETPLACE`);
export const resetGiftingDraftDataById = createAction<number>(`${prefix}/RESET_BY_ID`);
