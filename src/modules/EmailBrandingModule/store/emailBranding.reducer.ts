import { combineReducers } from 'redux';

import { brandingSettings, TBrandingSettingsState } from './brandingSettings/brandingSettings.reducer';

export interface IEmailBrandingState {
  brandingSettings: TBrandingSettingsState;
}

const reducer = combineReducers<IEmailBrandingState>({
  brandingSettings,
});

export default reducer;
