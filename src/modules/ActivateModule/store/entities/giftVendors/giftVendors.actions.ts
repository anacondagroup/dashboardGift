import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { IGiftVendor } from './giftVendors.types';

const PREFIX = 'ACTIVATE_MODULE/ENTITIES/GIFT_VENDORS';

export const loadGiftVendorsRequest = createAction<{ campaignId: number }>(`${PREFIX}/LOAD_REQUEST`);
export const loadGiftVendorsSuccess = createAction<IGiftVendor[]>(`${PREFIX}/LOAD_SUCCESS`);
export const loadGiftVendorsFail = createAction<TErrors>(`${PREFIX}/LOAD_FAIL`);
