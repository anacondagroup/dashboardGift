import { createAction } from 'redux-act';

import { IMember } from './batchOwners.types';

const PREFIX = 'CAMPAIGN/SETTINGS/GENERAL';

export const loadGeneralSettingsBatchOwnersRequest = createAction<number>(`${PREFIX}/LOAD_BATCH_OWNERS_REQUEST`);
export const loadGeneralSettingsBatchOwnersSuccess = createAction<IMember[]>(`${PREFIX}/LOAD_BATCH_OWNERS_SUCCESS`);
export const loadGeneralSettingsBatchOwnersFail = createAction<Record<string, unknown>>(
  `${PREFIX}/LOAD_BATCH_OWNERS_FAIL`,
);
export const generalSettingsClearBatchOwnersData = createAction(`${PREFIX}/CLEAR_BATCH_OWNERS_DATA`);
