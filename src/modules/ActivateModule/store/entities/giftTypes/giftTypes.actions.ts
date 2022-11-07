import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { IGiftType } from './giftTypes.types';

const PREFIX = 'ACTIVATE_MODULE/ENTITIES/GIFT_TYPES';

export const loadGiftTypesRequest = createAction<{ campaignId: number }>(`${PREFIX}/LOAD_REQUEST`);
export const loadGiftTypesSuccess = createAction<IGiftType[]>(`${PREFIX}/LOAD_SUCCESS`);
export const loadGiftTypesFail = createAction<TErrors>(`${PREFIX}/LOAD_FAIL`);
