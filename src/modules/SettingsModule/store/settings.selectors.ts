import { IRootState } from '../../../store/root.types';

import { ISettingsState } from './settings.reducer';

export const getSettingsState = (state: IRootState): ISettingsState => state.settings;
