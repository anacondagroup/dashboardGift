import { createAction } from 'redux-act';

import { TTeamSettingsData } from './teamSettings.types';

const prefix = 'MARKETPLACE/TEAM_SETTINGS';

export const fetchTeamSettings = createAction<{ teamId: number }>(`${prefix}/FETCH_REQUEST`);
export const fetchTeamSettingsSuccess = createAction<TTeamSettingsData>(`${prefix}/FETCH_SUCCESS`);
export const fetchTeamSettingsFail = createAction(`${prefix}/FETCH_FAIL`);

export const resetTeamSettings = createAction(`${prefix}/RESET`);
