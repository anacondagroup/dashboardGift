import { combineReducers } from 'redux';

import emailTypesReducer, { IEmailTypesState } from './emailTypes/emailTypes.reducer';
import brandingSettingsReducer, { IBrandingSettingsState } from './brandingSettings/brandingSettings.reducer';
import emailPreviewReducer, { IEmailPreviewState } from './emailPreview/emailPreview.reducer';

export interface IEmailBrandingState {
  emailTypes: IEmailTypesState;
  brandingSettings: IBrandingSettingsState;
  email: IEmailPreviewState;
}

const reducer = combineReducers<IEmailBrandingState>({
  emailTypes: emailTypesReducer,
  brandingSettings: brandingSettingsReducer,
  email: emailPreviewReducer,
});

export default reducer;
