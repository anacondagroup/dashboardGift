import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';
import { createAsyncAction } from '@alycecom/utils';

import { TSwagCardOrder, TSwagCardDesign } from '../../swagCampaign.types';

const prefix = 'SWAG_CAMPAIGNS/STEPS/CODES';

export const setGiftCodeFormat = createAction<string>(`${prefix}/SET_GIFT_CODE_FORMAT`);

export const setOpenCloseCodesSettingsBar = createAction<boolean>(`${prefix}/OPEN_CODES_SETTINGS_BAR`);

export const setOpenCloseCardsSettingsBar = createAction<boolean>(`${prefix}/OPEN_CARDS_SETTINGS_BAR`);

export const updateDraftSwagCardOrder = createAction<TSwagCardOrder>(`${prefix}/CARD_ORDER_UPDATE`);

export const updateDraftCardDesign = createAction<TSwagCardDesign>(`${prefix}/CARD_DESIGN_UPDATE`);

export const saveSwagDraftCardOrder = createAsyncAction<
  TSwagCardOrder & { draftId: number | null },
  TSwagCardOrder,
  TErrors<Partial<TSwagCardOrder & TSwagCardDesign>>
>(`${prefix}/CARD_ORDER_SAVE`);

export const saveSwagDraftCardDesign = createAsyncAction<
  TSwagCardDesign & { draftId: number | null },
  TSwagCardDesign,
  TErrors<Partial<TSwagCardOrder & TSwagCardDesign>>
>(`${prefix}/CARD_DESIGN_SAVE`);

export const resetCodesSettings = createAction(`${prefix}/RESET_CODES_SETTINGS`);

export const generateCodesList = createAsyncAction<
  { campaignId: number | null },
  void,
  TErrors<Partial<TSwagCardOrder & TSwagCardDesign>>
>(`${prefix}/GENERATE_CODES_LIST`);
