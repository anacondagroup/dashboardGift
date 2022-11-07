import { combineReducers } from 'redux';

import campaignSettingsReducer, { ISettingsCampaignState } from './campaign/campaign.reducer';
import { reducer as templatesReducer } from './templates/templates.reducer';
import { reducer as teamsSettingReducer, ITeamsSettingsState } from './teams/teamsSettings.reducer';
import { organisationReducer, IOrganizationState } from './organisation/organisation.reducer';
import { reducer as personalSettingsReducer, IPersonalSettingsState } from './personal/personal.reducer';

// TODO Remove once all properties of settings state is defined
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISettingsState {
  teams: ITeamsSettingsState;
  organisation: IOrganizationState;
  campaign: ISettingsCampaignState;
  templates: any;
  personal: IPersonalSettingsState;
}

export default combineReducers<ISettingsState>({
  teams: teamsSettingReducer,
  organisation: organisationReducer,
  campaign: campaignSettingsReducer,
  templates: templatesReducer,
  personal: personalSettingsReducer,
});
