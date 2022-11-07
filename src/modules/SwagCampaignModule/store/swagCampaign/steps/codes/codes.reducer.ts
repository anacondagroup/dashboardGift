import { createReducer } from 'redux-act';
import { Path } from 'react-hook-form';
import { StateStatus } from '@alycecom/utils';

import { TSwagCardDesign, TSwagCardOrder } from '../../swagCampaign.types';
import { fetchSwagDraftById, resetSwagCampaign } from '../../swagCampaign.actions';

import { CodesType } from './codes.constants';
import {
  setOpenCloseCodesSettingsBar,
  setOpenCloseCardsSettingsBar,
  setGiftCodeFormat,
  updateDraftSwagCardOrder,
  updateDraftCardDesign,
  resetCodesSettings,
  saveSwagDraftCardOrder,
  saveSwagDraftCardDesign,
} from './codes.actions';

export type TCodesState = {
  giftCodeFormat: string;
  isOpenCodesSideBar: boolean;
  isOpenCardsSideBar: boolean;
  cardsOrder: TSwagCardOrder | null;
  cardDesign: TSwagCardDesign | null;
  statusCardOrder: StateStatus;
  statusCardDesign: StateStatus;
  errors: Partial<Record<Path<TSwagCardOrder & TSwagCardDesign>, string[]>>;
};

export const initialState: TCodesState = {
  giftCodeFormat: CodesType.Physical,
  isOpenCodesSideBar: false,
  isOpenCardsSideBar: false,
  cardsOrder: null,
  cardDesign: null,
  statusCardOrder: StateStatus.Idle,
  statusCardDesign: StateStatus.Idle,
  errors: {},
};

export const codes = createReducer({}, initialState);

codes
  .on(fetchSwagDraftById.pending, () => ({
    ...initialState,
    status: StateStatus.Pending,
  }))
  .on(fetchSwagDraftById.fulfilled, (state, payload) => ({
    ...state,
    giftCodeFormat: payload.data?.codes?.cardOrder?.codeFormat ?? CodesType.Physical,
    cardsOrder: payload.data?.codes?.cardOrder ?? null,
    cardDesign: payload.data?.codes?.cardDesign ?? null,
    status: StateStatus.Fulfilled,
  }));

codes.on(setGiftCodeFormat, (state, payload) => ({
  ...state,
  giftCodeFormat: payload,
}));

codes.on(setOpenCloseCodesSettingsBar, (state, payload) => ({
  ...state,
  isOpenCodesSideBar: payload,
}));

codes.on(setOpenCloseCardsSettingsBar, (state, payload) => ({
  ...state,
  isOpenCardsSideBar: payload,
}));

codes.on(updateDraftSwagCardOrder, (state, payload) => ({
  ...state,
  cardsOrder: payload,
}));

codes.on(updateDraftCardDesign, (state, payload) => ({
  ...state,
  cardDesign: payload,
}));

codes
  .on(saveSwagDraftCardOrder.pending, state => ({
    ...state,
    statusCardOrder: StateStatus.Pending,
  }))
  .on(saveSwagDraftCardOrder.fulfilled, (state, payload) => ({
    ...state,
    statusCardOrder: StateStatus.Fulfilled,
    cardsOrder: payload,
  }))
  .on(saveSwagDraftCardOrder.rejected, (state, errors) => ({
    ...state,
    statusCardOrder: StateStatus.Rejected,
    errors,
  }));

codes
  .on(saveSwagDraftCardDesign.pending, state => ({
    ...state,
    statusCardDesign: StateStatus.Pending,
  }))
  .on(saveSwagDraftCardDesign.fulfilled, (state, payload) => ({
    ...state,
    statusCardDesign: StateStatus.Fulfilled,
    cardDesign: payload,
  }))
  .on(saveSwagDraftCardDesign.rejected, (state, errors) => ({
    ...state,
    statusCardDesign: StateStatus.Rejected,
    errors,
  }));

codes.on(resetCodesSettings, () => initialState);

codes.on(resetSwagCampaign, () => initialState);
