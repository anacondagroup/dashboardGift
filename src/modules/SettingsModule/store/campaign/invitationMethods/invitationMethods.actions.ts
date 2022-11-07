import { createAction } from 'redux-act';

import { IGiftInvitationMethod } from './invitationMethods.types';

const PREFIX = 'SETTINGS/CAMPAIGN/GIFT_INVITATION_METHODS';

export const fetchGiftInvitationMethods = createAction<{ campaignId: number }>(`${PREFIX}/FETCH_REQUEST`);
export const fetchGiftInvitationMethodsSuccess = createAction<IGiftInvitationMethod[]>(`${PREFIX}/FETCH_SUCCESS`);
export const fetchGiftInvitationMethodsFail = createAction(`${PREFIX}/FETCH_FAIL`);

export const updateGiftInvitationMethods = createAction<{ campaignId: number; restrictedMethodIds: number[] }>(
  `${PREFIX}/UPDATE_REQUEST`,
);
export const updateGiftInvitationMethodsSuccess = createAction<{ restrictedMethodIds: number[] }>(
  `${PREFIX}/UPDATE_SUCCESS`,
);
export const updateGiftInvitationMethodsFail = createAction(`${PREFIX}/UPDATE_FAIL`);
