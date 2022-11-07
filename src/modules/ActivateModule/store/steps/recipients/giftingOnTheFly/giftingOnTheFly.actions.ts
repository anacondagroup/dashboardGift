import { createAction } from 'redux-act';

const PREFIX = 'ACTIVATE_MODULE/STEPS/RECIPIENTS/GIFTING_ON_THE_FLY';

export const updateGiftingOnTheFlyRequest = createAction<{ isEnabled: boolean }>(`${PREFIX}/UPDATE_REQUEST`);
export const updateGiftingOnTheFlySuccess = createAction<{ isEnabled: boolean }>(`${PREFIX}/UPDATE_SUCCESS`);
export const updateGiftingOnTheFlyFail = createAction(`${PREFIX}/UPDATE_FAIL`);
