import { createAction } from 'redux-act';
import { createAsyncAction } from '@alycecom/utils';
import { TErrors } from '@alycecom/services';

import { TTeamFormParams } from './team.types';

const PREFIX = 'TEAM_MANAGEMENT/TEAM';

export const createTeam = createAsyncAction<TTeamFormParams, void, TErrors>(`${PREFIX}/CREATE`);

export const renameTeam = createAsyncAction<TTeamFormParams & { teamId: number }, void, TErrors>(`${PREFIX}/RENAME`);

export const resetTeamData = createAction(`${PREFIX}/RESET_TEAM_CREATE_DATA`);
