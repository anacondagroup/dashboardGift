import { createAction } from 'redux-act';
import { dissoc, prop } from 'ramda';

import { IGeneralSettingsChange } from './generalSettings.types';

const PREFIX = 'ED/TEAM_SETTINGS';

export const getSettings = createAction<number>(`${PREFIX}/GET_SETTINGS_REQUEST`);
export const getSettingsSuccess = createAction<IGeneralSettingsChange>(`${PREFIX}/GET_SETTINGS_SUCCESS`);
export const getSettingsFail = createAction<Record<string, unknown>>(`${PREFIX}/GET_SETTINGS_FAIL`);

export const updateSettings = createAction<Partial<IGeneralSettingsChange>>(
  `${PREFIX}/UPDATE_SETTINGS_REQUEST`,
  dissoc('teamId'),
  prop('teamId'),
);
export const updateSettingsSuccess = createAction<Partial<IGeneralSettingsChange>>(`${PREFIX}/UPDATE_SETTINGS_SUCCESS`);
export const updateSettingsFail = createAction<Record<string, unknown>>(`${PREFIX}/UPDATE_SETTINGS_FAIL`);
