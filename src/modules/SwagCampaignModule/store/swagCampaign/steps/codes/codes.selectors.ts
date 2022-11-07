import { pipe, prop } from 'ramda';

import { IRootState } from '../../../../../../store/root.types';

import { TCodesState } from './codes.reducer';

const getCodesState = (state: IRootState): TCodesState => state.swagCampaign.steps.codes;

export const getGiftCodeFormat = pipe(getCodesState, prop('giftCodeFormat'));

export const getIsOpenCodesSettingBar = pipe(getCodesState, prop('isOpenCodesSideBar'));

export const getIsOpenCardsSettingBar = pipe(getCodesState, prop('isOpenCardsSideBar'));

export const getCardsOrder = pipe(getCodesState, prop('cardsOrder'));

export const getCardDesign = pipe(getCodesState, prop('cardDesign'));

export const getErrors = pipe(getCodesState, prop('errors'));
