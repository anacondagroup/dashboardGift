import { createAction } from 'redux-act';
import { EntityId, TDictionary } from '@alycecom/utils';

import { IUserDraft } from './userDrafts.types';

const PREFIX = 'USERS_MANAGEMENT/ENTITIES/USER_DRAFTS';

export const addUserDrafts = createAction<{ users: TDictionary<IUserDraft> }>(`${PREFIX}/ADD_USER_DRAFTS`);

export const resetUserDrafts = createAction<void>(`${PREFIX}/RESET_USER_DRAFTS_DATA`);

export const deleteUserDraftById = createAction<EntityId>(`${PREFIX}/DELETE_USER_DRAFT_BY_ID`);
