import { createAction } from 'redux-act';

import { IPriceAvailability } from './priceAvailability.types';

const PREFIX = 'MARKETPLACE';

export const getPriceAvailabilityRequest = createAction<{ campaignId: number }>(
  `${PREFIX}/GET_PRICE_AVAILABILITY_REQUEST`,
);
export const getPriceAvailabilitySuccess = createAction<IPriceAvailability>(`${PREFIX}/GET_PRICE_AVAILABILITY_SUCCESS`);
export const getPriceAvailabilityFail = createAction(`${PREFIX}/GET_PRICE_AVAILABILITY_FAIL`);
