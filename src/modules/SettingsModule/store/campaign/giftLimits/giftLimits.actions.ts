import { createAction } from 'redux-act';

import { IGiftLimit } from './giftLimits.types';

const PREFIX = 'SETTINGS/CAMPAIGN';

export const loadGiftLimitsRequest = createAction<{ campaignId: number }>(`${PREFIX}/LOAD_GIFT_LIMITS_REQUEST`);
export const loadGiftLimitsSuccess = createAction<IGiftLimit[]>(`${PREFIX}/LOAD_GIFT_LIMITS_SUCCESS`);
export const loadGiftLimitsFail = createAction(`${PREFIX}/LOAD_GIFT_LIMITS_FAIL`);

export const updateGiftLimitsRequest = createAction<{ campaignId: number; giftLimits: IGiftLimit[] }>(
  `${PREFIX}/UPDATE_GIFT_LIMITS_REQUEST`,
);
export const updateGiftLimitsSuccess = createAction<IGiftLimit[]>(`${PREFIX}/UPDATE_GIFT_LIMITS_SUCCESS`);
export const updateGiftLimitsFail = createAction(`${PREFIX}/UPDATE_GIFT_LIMITS_FAIL`);

export const setGiftLimits = createAction<IGiftLimit[]>(`${PREFIX}/SET_GIFT_LIMITS`);

export const toggleUserLimitSelection = createAction<{ userLimit: IGiftLimit; checked: boolean }>(
  `${PREFIX}/TOGGLE_USER_GIFT_LIMIT_SELECTION`,
);

export const toggleUsersLimitSelections = createAction<{ usersLimits: IGiftLimit[]; checked: boolean }>(
  `${PREFIX}/TOGGLE_USERS_GIFT_LIMITS_SELECTION`,
);
