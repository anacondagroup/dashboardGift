import { createAction } from 'redux-act';

import { ITeam } from './teams.types';

const PREFIX = 'TEAMS_SETTINGS';

export const loadTeamsSettingsRequest = createAction(`${PREFIX}/LOAD_TEAMS_SETTINGS_REQUEST`);
export const loadTeamsSettingsSuccess = createAction<ITeam[]>(`${PREFIX}/LOAD_TEAMS_SETTINGS_SUCCESS`);
export const loadTeamsSettingsFail = createAction<boolean>(`${PREFIX}/LOAD_TEAMS_SETTINGS_FAIL`);

export const clearTeamsSetting = createAction(`${PREFIX}/CLEAR_TEAM_SETTING`);
