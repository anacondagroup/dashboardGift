import { combineReducers } from 'redux';

import {
  reducer as emailNotificationsReducer,
  IEmailNotificationsState,
} from './emailNotifications/emailNotifications.reducer';

export interface IPersonalSettingsState {
  emailNotifications: IEmailNotificationsState;
}

export const reducer = combineReducers<IPersonalSettingsState>({
  emailNotifications: emailNotificationsReducer,
});
